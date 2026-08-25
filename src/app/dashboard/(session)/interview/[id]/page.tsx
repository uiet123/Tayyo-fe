import type { Metadata } from "next";
import { InterviewRoom } from "@/components/interview/interview-room";

export const metadata: Metadata = {
  title: "Interview room",
};

export default async function InterviewRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InterviewRoom sessionId={id} />;
}
