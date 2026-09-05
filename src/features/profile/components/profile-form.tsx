"use client";

import { useActionState } from "react";
import * as z from "zod";
import { updateProfileAction } from "@/features/profile/actions";
import type { ProfileDto } from "@/features/profile/repository";
import type { UpdateProfileSchema } from "@/features/profile/schema";
import { CompanySelectField } from "@/features/profile/components/company-select-field";
import { AvatarUploadField } from "@/features/profile/components/avatar-upload-field";
import type { CompanyOptionDto } from "@/features/companies/repository";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";

type FieldName = keyof z.infer<typeof UpdateProfileSchema>;

interface ProfileFormProps {
  profile: ProfileDto;
  companies: CompanyOptionDto[];
}

export function ProfileForm({ profile, companies }: ProfileFormProps) {
  const [state, action, pending] = useActionState(
    updateProfileAction,
    undefined,
  );

  const fieldError = (name: FieldName) =>
    state?.status === "error" ? state.errors?.[name]?.[0] : undefined;

  return (
    <form action={action} className="flex flex-col gap-6">
      <AvatarUploadField name="avatarUrl" defaultValue={profile.avatarUrl} />
      {fieldError("avatarUrl") && (
        <p className="text-center text-sm text-destructive">
          {fieldError("avatarUrl")}
        </p>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-foreground">
          基本情報(全員に公開されます)
        </h2>

        <FormField
          htmlFor="displayName"
          label="お名前"
          required
          error={fieldError("displayName")}
        >
          <Input
            id="displayName"
            name="displayName"
            defaultValue={profile.displayName}
            required
          />
        </FormField>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">メールアドレス</Label>
          <Input id="email" value={profile.email} disabled />
        </div>

        <CompanySelectField
          initialCompanies={companies}
          defaultCompanyId={profile.companyId}
        />
        {fieldError("companyId") && (
          <p className="text-sm text-destructive">{fieldError("companyId")}</p>
        )}

        <FormField
          htmlFor="title"
          label="役職"
          required
          error={fieldError("title")}
        >
          <Input
            id="title"
            name="title"
            defaultValue={profile.title ?? ""}
            required
          />
        </FormField>

        <FormField
          htmlFor="industry"
          label="業種"
          required
          error={fieldError("industry")}
        >
          <Input
            id="industry"
            name="industry"
            defaultValue={profile.industry ?? ""}
            required
          />
        </FormField>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-foreground">
          連絡先・自己紹介(承認済み会員のみに公開されます)
        </h2>

        <FormField
          htmlFor="phone"
          label="電話番号"
          required
          error={fieldError("phone")}
        >
          <Input
            id="phone"
            name="phone"
            defaultValue={profile.phone ?? ""}
            required
          />
        </FormField>

        <FormField htmlFor="address" label="住所">
          <Input
            id="address"
            name="address"
            defaultValue={profile.address ?? ""}
          />
        </FormField>

        <FormField htmlFor="bio" label="自己紹介">
          <Textarea
            id="bio"
            name="bio"
            rows={3}
            defaultValue={profile.bio ?? ""}
          />
        </FormField>

        <FormField htmlFor="canOffer" label="紹介できること">
          <Textarea
            id="canOffer"
            name="canOffer"
            rows={2}
            defaultValue={profile.canOffer ?? ""}
          />
        </FormField>

        <FormField htmlFor="lookingFor" label="探していること">
          <Textarea
            id="lookingFor"
            name="lookingFor"
            rows={2}
            defaultValue={profile.lookingFor ?? ""}
          />
        </FormField>

        <FormField htmlFor="twitterUrl" label="X (Twitter) URL">
          <Input
            id="twitterUrl"
            name="twitterUrl"
            defaultValue={profile.twitterUrl ?? ""}
          />
        </FormField>

        <FormField htmlFor="facebookUrl" label="Facebook URL">
          <Input
            id="facebookUrl"
            name="facebookUrl"
            defaultValue={profile.facebookUrl ?? ""}
          />
        </FormField>

        <FormField htmlFor="linkedinUrl" label="LinkedIn URL">
          <Input
            id="linkedinUrl"
            name="linkedinUrl"
            defaultValue={profile.linkedinUrl ?? ""}
          />
        </FormField>
      </section>

      {state?.status === "error" && state.message && (
        <p className="text-sm text-destructive" role="alert">
          {state.message}
        </p>
      )}
      {state?.status === "success" && (
        <p className="text-sm text-foreground" role="status">
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "保存中..." : "保存"}
      </Button>
    </form>
  );
}
