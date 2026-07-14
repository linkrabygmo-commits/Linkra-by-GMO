-- companies / company_members / invitations: 企業・コミュニティ基盤

create type public.company_type as enum ('client', 'partner', 'group');
create type public.company_role as enum ('owner', 'admin', 'member');
create type public.invitation_status as enum ('pending', 'accepted', 'revoked');

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.company_type not null,
  description text,
  logo_url text,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.company_members (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.company_role not null default 'member',
  created_at timestamptz not null default now(),
  unique (company_id, user_id)
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  email text not null,
  role public.company_role not null default 'member',
  token uuid not null default gen_random_uuid() unique,
  status public.invitation_status not null default 'pending',
  invited_by uuid not null references public.profiles (id),
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now()
);

alter table public.companies enable row level security;
alter table public.company_members enable row level security;
alter table public.invitations enable row level security;

-- company_members を参照する権限チェックは、RLSの自己参照による無限再帰を避けるため
-- security definerのヘルパー関数(テーブルオーナー権限でRLSをバイパスして評価)を経由する。
create function public.company_role_of(target_company_id uuid)
returns public.company_role
language sql
security definer
set search_path = ''
stable
as $$
  select role from public.company_members
  where company_id = target_company_id and user_id = auth.uid()
  limit 1;
$$;

create function public.is_company_admin(target_company_id uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select public.company_role_of(target_company_id) in ('owner', 'admin');
$$;

-- companies RLS: コミュニティ内の企業ディレクトリとして全認証ユーザーに閲覧を許可。
-- 直接のinsertは許可せず、create_company()関数経由でのみ作成できる。
create policy "Authenticated users can view companies"
on public.companies for select
to authenticated
using (true);

create policy "Company admins can update their company"
on public.companies for update
to authenticated
using (public.is_company_admin(id))
with check (public.is_company_admin(id));

-- company_members RLS: メンバー一覧はコミュニティ内で公開。
-- insertは直接許可せず、create_company()/accept_invitation()関数経由でのみ行う。
create policy "Authenticated users can view company members"
on public.company_members for select
to authenticated
using (true);

create policy "Members can leave, admins can remove members"
on public.company_members for delete
to authenticated
using (auth.uid() = user_id or public.is_company_admin(company_id));

create policy "Company admins can update member roles"
on public.company_members for update
to authenticated
using (public.is_company_admin(company_id))
with check (public.is_company_admin(company_id));

-- invitations RLS: 管理者は自社の招待を閲覧・作成・失効可能。招待された本人もメール一致で閲覧可能。
create policy "Admins can view their company invitations"
on public.invitations for select
to authenticated
using (
  public.is_company_admin(company_id)
  or email = (auth.jwt() ->> 'email')
);

create policy "Company admins can create invitations"
on public.invitations for insert
to authenticated
with check (public.is_company_admin(company_id));

create policy "Company admins can revoke invitations"
on public.invitations for update
to authenticated
using (public.is_company_admin(company_id))
with check (public.is_company_admin(company_id));

-- 企業作成: companiesとcompany_members(owner)を同時に作成するアトミックな関数。
create function public.create_company(
  company_name text,
  company_type public.company_type,
  company_description text default null
)
returns public.companies
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_company public.companies;
begin
  insert into public.companies (name, type, description, created_by)
  values (company_name, company_type, company_description, auth.uid())
  returning * into new_company;

  insert into public.company_members (company_id, user_id, role)
  values (new_company.id, auth.uid(), 'owner');

  return new_company;
end;
$$;

-- 招待承諾: トークンを検証し、company_membersへの追加とinvitationsのステータス更新を
-- アトミックに行う。招待メールと現在のユーザーのメールが一致することを必須とする。
create function public.accept_invitation(invitation_token uuid)
returns public.company_members
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_invitation public.invitations;
  new_member public.company_members;
begin
  select * into target_invitation
  from public.invitations
  where token = invitation_token
    and status = 'pending'
    and expires_at > now()
  for update;

  if not found then
    raise exception '招待が見つからないか、既に無効です。';
  end if;

  if target_invitation.email <> (auth.jwt() ->> 'email') then
    raise exception 'この招待は別のメールアドレス宛てです。';
  end if;

  insert into public.company_members (company_id, user_id, role)
  values (target_invitation.company_id, auth.uid(), target_invitation.role)
  on conflict (company_id, user_id) do update set role = excluded.role
  returning * into new_member;

  update public.invitations
  set status = 'accepted'
  where id = target_invitation.id;

  return new_member;
end;
$$;

create trigger set_companies_updated_at
before update on public.companies
for each row execute function public.set_updated_at();
