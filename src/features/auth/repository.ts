import "server-only";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

interface SignUpInput {
  displayName: string;
  email: string;
  password: string;
}

interface SignInInput {
  email: string;
  password: string;
}

export async function signUp({ displayName, email, password }: SignUpInput) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  // メール確認が有効な場合、signUp直後はsessionがnullになる
  const needsEmailConfirmation = data.session === null;

  return { needsEmailConfirmation };
}

export async function signIn({ email, password }: SignInInput) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

export async function requestPasswordReset(email: string) {
  const supabase = await createClient();
  const headersList = await headers();
  const origin =
    headersList.get("origin") ?? `https://${headersList.get("host")}`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/reset-password`,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    throw new Error(error.message);
  }
}
