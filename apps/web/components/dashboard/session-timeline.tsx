"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Globe2, MousePointerClick, ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSessionJourney, sessionExportUrl } from "@/lib/api";
import type { AnalyticsEvent, SessionJourney } from "@/lib/types";
import { formatDateTime, shortId } from "@/lib/utils";
import { EmptyState } from "./empty-state";

interface SessionTimelineProps {
  sessionId: string;
}

function JourneyEvent({ event, index }: { event: AnalyticsEvent; index: number }) {
  const Icon = event.eventType === "click" ? MousePointerClick : ScrollText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.035 }}
      className="relative pl-10"
    >
      <div className="absolute left-0 top-1 flex size-7 items-center justify-center rounded-md border border-white/15 bg-[#111827]">
        <Icon className="size-4 text-primary" />
      </div>
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant={event.eventType === "click" ? "warning" : "success"}>{event.eventType}</Badge>
              <span className="text-sm text-muted-foreground">{formatDateTime(event.timestamp)}</span>
            </div>
            <span className="text-xs text-muted-foreground">Step {index + 1}</span>
          </div>
          <p className="mt-3 break-all text-sm font-medium">{event.pageUrl}</p>
          <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
            <span>Device: {event.deviceType}</span>
            <span>Browser: {event.browser}</span>
            <span>Country: {event.country}</span>
          </div>
          {event.eventType === "click" ? (
            <div className="mt-3 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-muted-foreground">
              Click coordinates: {event.x ?? 0}, {event.y ?? 0}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function SessionTimeline({ sessionId }: SessionTimelineProps) {
  const [journey, setJourney] = useState<SessionJourney | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadJourney() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchSessionJourney(sessionId);

        if (!cancelled) {
          setJourney(data);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError.message : "Unable to load session");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadJourney();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <Button asChild variant="ghost" className="-ml-3 mb-3">
            <Link href="/dashboard">
              <ArrowLeft className="size-4" />
              Back
            </Link>
          </Button>
          <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-muted-foreground">
            <Globe2 className="size-3.5 text-primary" />
            Session journey
          </div>
          <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">{shortId(sessionId, 20)}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{journey?.events.length ?? 0} ordered events</p>
        </div>
        <Button asChild variant="outline">
          <a href={sessionExportUrl(sessionId)}>
            <Download className="size-4" />
            Export CSV
          </a>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <EmptyState title="Session unavailable" description={error} />
      ) : journey && journey.events.length > 0 ? (
        <div className="relative space-y-4 before:absolute before:left-3.5 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-white/15">
          {journey.events.map((event, index) => (
            <JourneyEvent key={event.id} event={event} index={index} />
          ))}
        </div>
      ) : (
        <EmptyState title="No events in this session" description="This session does not contain stored activity." />
      )}
    </div>
  );
}
