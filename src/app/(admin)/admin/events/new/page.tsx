import { Suspense } from "react";
import type { Metadata } from "next";
import { EventForm } from "@/features/events/components/event-form";

export const metadata: Metadata = {
  title: "イベントを作成",
};

export default function NewEventPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-semibold text-foreground">イベントを作成</h1>
      <div className="max-w-md">
        <Suspense fallback={null}>
          <EventForm />
        </Suspense>
      </div>
    </div>
  );
}
