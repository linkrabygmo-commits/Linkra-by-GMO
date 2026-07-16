"use client";

import { useActionState } from "react";
import * as z from "zod";
import { updateProfileAction } from "@/features/profile/actions";
import type { ProfileDto } from "@/features/profile/repository";
import type { UpdateProfileSchema } from "@/features/profile/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageUploadField } from "@/components/storage/image-upload-field";

type FieldName = keyof z.infer<typeof UpdateProfileSchema>;

export function ProfileForm({ profile }: { profile: ProfileDto }) {
  const [state, action, pending] = useActionState(updateProfileAction, undefined);

  const fieldError = (name: FieldName) =>
    state?.status === "error" ? state.errors?.[name]?.[0] : undefined;

  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Avatar size="lg">
          <AvatarImage src={profile.avatarUrl ?? undefined} alt="" />
          <AvatarFallback>{profile.displayName.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <p className="text-sm text-muted-foreground">{profile.email}</p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-foreground">
          基本情報(全員に公開されます)
        </h2>

        <div className="flex flex-col gap-2">
          <Label htmlFor="displayName">お名前</Label>
          <Input
            id="displayName"
            name="displayName"
            defaultValue={profile.displayName}
            required
          />
          {fieldError("displayName") && (
            <p className="text-sm text-destructive">{fieldError("displayName")}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="companyName">会社名(任意)</Label>
          <Input id="companyName" name="companyName" defaultValue={profile.companyName ?? ""} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="title">肩書き(任意)</Label>
          <Input id="title" name="title" defaultValue={profile.title ?? ""} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="industry">業種(任意)</Label>
          <Input id="industry" name="industry" defaultValue={profile.industry ?? ""} />
        </div>

        <ImageUploadField
          name="avatarUrl"
          label="アバター画像(任意)"
          scope="avatars"
          defaultValue={profile.avatarUrl}
        />
        {fieldError("avatarUrl") && (
          <p className="text-sm text-destructive">{fieldError("avatarUrl")}</p>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-foreground">
          連絡先・自己紹介(承認済み会員のみに公開されます)
        </h2>

        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">電話番号(任意)</Label>
          <Input id="phone" name="phone" defaultValue={profile.phone ?? ""} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="address">住所(任意)</Label>
          <Input id="address" name="address" defaultValue={profile.address ?? ""} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="bio">自己紹介(任意)</Label>
          <Textarea id="bio" name="bio" rows={3} defaultValue={profile.bio ?? ""} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="canOffer">紹介できること(任意)</Label>
          <Textarea id="canOffer" name="canOffer" rows={2} defaultValue={profile.canOffer ?? ""} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lookingFor">探していること(任意)</Label>
          <Textarea id="lookingFor" name="lookingFor" rows={2} defaultValue={profile.lookingFor ?? ""} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="twitterUrl">X (Twitter) URL(任意)</Label>
          <Input id="twitterUrl" name="twitterUrl" defaultValue={profile.twitterUrl ?? ""} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="facebookUrl">Facebook URL(任意)</Label>
          <Input id="facebookUrl" name="facebookUrl" defaultValue={profile.facebookUrl ?? ""} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="linkedinUrl">LinkedIn URL(任意)</Label>
          <Input id="linkedinUrl" name="linkedinUrl" defaultValue={profile.linkedinUrl ?? ""} />
        </div>
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
