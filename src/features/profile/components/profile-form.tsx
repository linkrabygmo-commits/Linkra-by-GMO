"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/features/profile/actions";
import type { ProfileDto } from "@/features/profile/repository";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfileForm({ profile }: { profile: ProfileDto }) {
  const [state, action, pending] = useActionState(updateProfileAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Avatar size="lg">
          <AvatarImage src={profile.avatarUrl ?? undefined} alt="" />
          <AvatarFallback>{profile.displayName.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <p className="text-sm text-muted-foreground">{profile.email}</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="displayName">お名前</Label>
        <Input
          id="displayName"
          name="displayName"
          defaultValue={profile.displayName}
          required
        />
        {state?.status === "error" && state.errors?.displayName && (
          <p className="text-sm text-destructive">
            {state.errors.displayName[0]}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="title">肩書き(任意)</Label>
        <Input id="title" name="title" defaultValue={profile.title ?? ""} />
        {state?.status === "error" && state.errors?.title && (
          <p className="text-sm text-destructive">{state.errors.title[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="avatarUrl">アバター画像URL(任意)</Label>
        <Input
          id="avatarUrl"
          name="avatarUrl"
          defaultValue={profile.avatarUrl ?? ""}
          placeholder="https://..."
        />
        {state?.status === "error" && state.errors?.avatarUrl && (
          <p className="text-sm text-destructive">
            {state.errors.avatarUrl[0]}
          </p>
        )}
      </div>

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

      <Button type="submit" disabled={pending} className="mt-2 w-fit">
        {pending ? "保存中..." : "保存"}
      </Button>
    </form>
  );
}
