import { SessionTimeline } from "@/components/dashboard/session-timeline";

interface SessionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;

  return <SessionTimeline sessionId={id} />;
}
