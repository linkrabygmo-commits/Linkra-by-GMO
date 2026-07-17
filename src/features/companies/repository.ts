import "server-only";

import { createClient } from "@/lib/supabase/server";
import { verifySession, requireAdmin, getCurrentUser } from "@/lib/auth/session";
import type { CompanyRole } from "@/types/database";

export interface CompanyDto {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  memberCount: number;
  createdAt: string;
}

export interface CompanyDetailDto extends CompanyDto {
  currentUserRole: CompanyRole | null;
}

export interface MemberDto {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  role: CompanyRole;
  joinedAt: string;
}

export async function listCompanies(): Promise<CompanyDto[]> {
  const supabase = await createClient();

  // 会社の「メンバー」は、company_members(会社作成時のオーナー登録等)と、
  // プロフィール画面で会社名を選択しただけのプロフィール(member_directory.
  // company_id)の両方から成る。人数カウントは両方を合算(ユーザーIDで重複排除)
  // する必要がある。
  const [
    { data: companies, error: companiesError },
    { data: members, error: membersError },
    { data: linkedProfiles, error: profilesError },
  ] = await Promise.all([
    supabase.from("companies").select("*").order("created_at", { ascending: false }),
    supabase.from("company_members").select("company_id, user_id"),
    supabase.from("member_directory").select("id, company_id").not("company_id", "is", null),
  ]);

  if (companiesError) throw new Error(companiesError.message);
  if (membersError) throw new Error(membersError.message);
  if (profilesError) throw new Error(profilesError.message);

  const memberIdsByCompany = new Map<string, Set<string>>();
  for (const row of members ?? []) {
    if (!memberIdsByCompany.has(row.company_id)) {
      memberIdsByCompany.set(row.company_id, new Set());
    }
    memberIdsByCompany.get(row.company_id)!.add(row.user_id);
  }
  for (const row of linkedProfiles ?? []) {
    if (!row.company_id) continue;
    if (!memberIdsByCompany.has(row.company_id)) {
      memberIdsByCompany.set(row.company_id, new Set());
    }
    memberIdsByCompany.get(row.company_id)!.add(row.id);
  }

  return (companies ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    logoUrl: row.logo_url,
    memberCount: memberIdsByCompany.get(row.id)?.size ?? 0,
    createdAt: row.created_at,
  }));
}

export async function listNewCompanies(limit: number): Promise<CompanyDto[]> {
  return (await listCompanies()).slice(0, limit);
}

export interface MyCompanyDto {
  id: string;
  name: string;
  role: CompanyRole;
}

export async function listMyCompanies(): Promise<MyCompanyDto[]> {
  const user = await verifySession();
  const supabase = await createClient();

  const { data: memberships, error: membershipsError } = await supabase
    .from("company_members")
    .select("company_id, role")
    .eq("user_id", user.id);

  if (membershipsError) throw new Error(membershipsError.message);
  if (!memberships || memberships.length === 0) return [];

  const { data: companies, error: companiesError } = await supabase
    .from("companies")
    .select("id, name")
    .in(
      "id",
      memberships.map((m) => m.company_id),
    );

  if (companiesError) throw new Error(companiesError.message);

  const roleByCompanyId = new Map(
    memberships.map((m) => [m.company_id, m.role]),
  );

  return (companies ?? []).map((company) => ({
    id: company.id,
    name: company.name,
    role: roleByCompanyId.get(company.id) ?? "member",
  }));
}

export async function getCompanyById(
  companyId: string,
): Promise<CompanyDetailDto | null> {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("*")
    .eq("id", companyId)
    .maybeSingle();

  if (companyError) throw new Error(companyError.message);
  if (!company) return null;

  const { data: members, error: membersError } = await supabase
    .from("company_members")
    .select("user_id, role")
    .eq("company_id", companyId);

  if (membersError) throw new Error(membersError.message);

  const currentUserRole =
    (members ?? []).find((m) => m.user_id === user?.id)?.role ?? null;

  return {
    id: company.id,
    name: company.name,
    description: company.description,
    logoUrl: company.logo_url,
    memberCount: (members ?? []).length,
    createdAt: company.created_at,
    currentUserRole,
  };
}

export async function listMembers(companyId: string): Promise<MemberDto[]> {
  const supabase = await createClient();

  // company_members(会社作成時のオーナー登録等)と、プロフィール画面で
  // この会社を選択しただけのプロフィール(company_id一致)の両方を合わせて
  // 「この会社のメンバー」として扱う。役職はcompany_membersにあればそれを
  // 使い、無ければ一般の「メンバー」として扱う。
  const [
    { data: companyMembers, error: membersError },
    { data: linkedProfiles, error: linkedProfilesError },
  ] = await Promise.all([
    supabase
      .from("company_members")
      .select("user_id, role, created_at")
      .eq("company_id", companyId),
    supabase.from("member_directory").select("id, created_at").eq("company_id", companyId),
  ]);

  if (membersError) throw new Error(membersError.message);
  if (linkedProfilesError) throw new Error(linkedProfilesError.message);

  const roleByUserId = new Map((companyMembers ?? []).map((m) => [m.user_id, m.role]));
  const joinedAtByUserId = new Map(
    (companyMembers ?? []).map((m) => [m.user_id, m.created_at]),
  );

  const userIds = new Set<string>([
    ...(companyMembers ?? []).map((m) => m.user_id),
    ...(linkedProfiles ?? []).map((p) => p.id),
  ]);

  if (userIds.size === 0) return [];

  // profilesを直接SELECTすると"Authenticated users can view profiles"の全カラム公開
  // ポリシーに依存してしまうため、マスキング済みのmember_directoryビュー経由で取得する。
  const { data: profiles, error: profilesError } = await supabase
    .from("member_directory")
    .select("id, display_name, avatar_url, created_at")
    .in("id", Array.from(userIds));

  if (profilesError) throw new Error(profilesError.message);

  return (profiles ?? [])
    .map((profile) => ({
      userId: profile.id,
      displayName: profile.display_name,
      avatarUrl: profile.avatar_url,
      role: roleByUserId.get(profile.id) ?? "member",
      joinedAt: joinedAtByUserId.get(profile.id) ?? profile.created_at,
    }))
    .sort((a, b) => a.joinedAt.localeCompare(b.joinedAt));
}

interface CreateCompanyInput {
  name: string;
  description?: string;
  logoUrl?: string;
}

export async function createCompany(
  input: CreateCompanyInput,
): Promise<CompanyDto> {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("create_company", {
    company_name: input.name,
    company_description: input.description ?? null,
  });

  if (error) throw new Error(error.message);

  if (input.logoUrl) {
    const { error: updateError } = await supabase
      .from("companies")
      .update({ logo_url: input.logoUrl })
      .eq("id", data.id);

    if (updateError) throw new Error(updateError.message);
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    logoUrl: input.logoUrl ?? data.logo_url,
    memberCount: 1,
    createdAt: data.created_at,
  };
}

export async function deleteCompany(companyId: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.rpc("delete_company", { target_id: companyId });

  if (error) throw new Error(error.message);
}

export interface CompanyOptionDto {
  id: string;
  name: string;
}

export async function listCompanyOptions(): Promise<CompanyOptionDto[]> {
  await verifySession();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("companies")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);

  return data ?? [];
}

// プロフィール画面から、承認待ちの会員も含め誰でも会社を新規登録できるように
// する(会社作成自体は即時反映。重複防止のため事前に既存の会社名と大文字小文字
// を無視して突き合わせる。会社作成のRPC自体はcreateCompany()と同じものを使うが、
// 管理者専用の入口とは別に、requireAdmin()を課さないこちらの入口を用意する)。
export async function createCompanyForMember(name: string): Promise<CompanyOptionDto> {
  await verifySession();

  const trimmedName = name.trim();
  if (!trimmedName) throw new Error("会社名を入力してください。");

  const supabase = await createClient();

  const { data: existingCompanies, error: existingError } = await supabase
    .from("companies")
    .select("id, name");

  if (existingError) throw new Error(existingError.message);

  const duplicate = (existingCompanies ?? []).find(
    (company) => company.name.trim().toLowerCase() === trimmedName.toLowerCase(),
  );

  if (duplicate) {
    throw new Error(`「${duplicate.name}」は既に登録されています。一覧から選択してください。`);
  }

  const { data, error } = await supabase.rpc("create_company", {
    company_name: trimmedName,
  });

  if (error) throw new Error(error.message);

  return { id: data.id, name: data.name };
}

export async function leaveCompany(companyId: string): Promise<void> {
  const user = await verifySession();
  const supabase = await createClient();

  const { error } = await supabase
    .from("company_members")
    .delete()
    .eq("company_id", companyId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
}
