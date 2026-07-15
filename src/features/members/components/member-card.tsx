import Link from "next/link";
import type { MemberSummaryDto } from "@/features/members/repository";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export function MemberCard({ member }: { member: MemberSummaryDto }) {
  return (
    <Link href={`/members/${member.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarImage src={member.avatarUrl ?? undefined} alt="" />
            <AvatarFallback>{member.displayName.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <p className="truncate text-sm font-medium text-foreground">
              {member.displayName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {member.companyName ?? "会社名未設定"}
              {member.title ? ` / ${member.title}` : ""}
            </p>
            {member.industry && (
              <p className="truncate text-xs text-muted-foreground">
                {member.industry}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
