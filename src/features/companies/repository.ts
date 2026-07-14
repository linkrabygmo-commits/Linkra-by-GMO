import "server-only";

import { createClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/auth/session";
import { ForbiddenError } from "@/lib/repository/base";
import type { CompanyRole, CompanyType } from "@/types/database";

export interface CompanyDto {
  id: string;
  name: string;
  type: CompanyType;
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

export interface InvitationDto {
  id: string;
  email: string;
  role: CompanyRole;
  status: string;
  expiresAt: string;
  createdAt: string;
}

export interface InvitationPreviewDto {
  companyName: string;
  role: CompanyRole;
  email: string;
}

export async function listCompanies(): Promise<CompanyDto[]> {
  const supabase = await createClient();

  const [{ data: companies, error: companiesError }, { data: members, error: membersError }] =
    await Promise.all([
      supabase.from("companies").select("*").order("created_at", { ascending: false }),
      supabase.from("company_members").select("company_id"),
    ]);

  if (companiesError) throw new Error(companiesError.message);
  if (membersError) throw new Error(membersError.message);

  const memberCounts = new Map<string, number>();
  for (const row of members ?? []) {
    memberCounts.set(row.company_id, (memberCounts.get(row.company_id) ?? 0) + 1);
  }

  return (companies ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    type: row.type,
    description: row.description,
    logoUrl: row.logo_url,
    memberCount: memberCounts.get(row.id) ?? 0,
    createdAt: row.created_at,
  }));
}

export async function getCompanyById(
  companyId: string,
): Promise<CompanyDetailDto | null> {
  const user = await verifySession();
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
    (members ?? []).find((m) => m.user_id === user.id)?.role ?? null;

  return {
    id: company.id,
    name: company.name,
    type: company.type,
    description: company.description,
    logoUrl: company.logo_url,
    memberCount: (members ?? []).length,
    createdAt: company.created_at,
    currentUserRole,
  };
}

export async function listMembers(companyId: string): Promise<MemberDto[]> {
  const supabase = await createClient();

  const { data: members, error: membersError } = await supabase
    .from("company_members")
    .select("user_id, role, created_at")
    .eq("company_id", companyId)
    .order("created_at", { ascending: true });

  if (membersError) throw new Error(membersError.message);
  if (!members || members.length === 0) return [];

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .in(
      "id",
      members.map((m) => m.user_id),
    );

  if (profilesError) throw new Error(profilesError.message);

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  return members.map((m) => {
    const profile = profileById.get(m.user_id);
    return {
      userId: m.user_id,
      displayName: profile?.display_name ?? "(不明なユーザー)",
      avatarUrl: profile?.avatar_url ?? null,
      role: m.role,
      joinedAt: m.created_at,
    };
  });
}

export async function listInvitations(
  companyId: string,
): Promise<InvitationDto[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invitations")
    .select("id, email, role, status, expires_at, created_at")
    .eq("company_id", companyId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    role: row.role,
    status: row.status,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  }));
}

interface CreateCompanyInput {
  name: string;
  type: CompanyType;
  description?: string;
}

export async function createCompany(
  input: CreateCompanyInput,
): Promise<CompanyDto> {
  await verifySession();
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("create_company", {
    company_name: input.name,
    company_type: input.type,
    company_description: input.description ?? null,
  });

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    name: data.name,
    type: data.type,
    description: data.description,
    logoUrl: data.logo_url,
    memberCount: 1,
    createdAt: data.created_at,
  };
}

interface InviteMemberInput {
  companyId: string;
  email: string;
  role: Extract<CompanyRole, "admin" | "member">;
}

export async function inviteMember({
  companyId,
  email,
  role,
}: InviteMemberInput): Promise<void> {
  const user = await verifySession();
  const supabase = await createClient();

  const { data: membership } = await supabase
    .from("company_members")
    .select("role")
    .eq("company_id", companyId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
    throw new ForbiddenError("この企業への招待権限がありません。");
  }

  const { error } = await supabase.from("invitations").insert({
    company_id: companyId,
    email,
    role,
    invited_by: user.id,
  });

  if (error) throw new Error(error.message);
}

export async function getInvitationPreview(
  token: string,
): Promise<InvitationPreviewDto | null> {
  const supabase = await createClient();

  const { data: invitation, error } = await supabase
    .from("invitations")
    .select("email, role, status, expires_at, company_id")
    .eq("token", token)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!invitation || invitation.status !== "pending") return null;
  if (new Date(invitation.expires_at).getTime() < Date.now()) return null;

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("name")
    .eq("id", invitation.company_id)
    .maybeSingle();

  if (companyError) throw new Error(companyError.message);
  if (!company) return null;

  return {
    companyName: company.name,
    role: invitation.role,
    email: invitation.email,
  };
}

export async function acceptInvitation(token: string): Promise<string> {
  await verifySession();
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("accept_invitation", {
    invitation_token: token,
  });

  if (error) throw new Error(error.message);

  return data.company_id;
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
