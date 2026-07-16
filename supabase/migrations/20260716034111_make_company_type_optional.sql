-- 会社の「種別」(client/partner/group)は、企業のマッチングの仕方が多様なため
-- 作成フローから廃止する。既存データを壊さないよう列とenum自体は残し、
-- NOT NULL制約とcreate_company()での必須引数のみ外す。

alter table public.companies alter column type drop not null;

create or replace function public.create_company(
  company_name text,
  company_type public.company_type default null,
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
