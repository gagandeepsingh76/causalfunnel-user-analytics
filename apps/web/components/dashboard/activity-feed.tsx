"use client";

import { MousePointerClick, Radio, ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsEvent } from "@/lib/types";
import { formatDateTime, shortId } from "@/lib/utils";
import { EmptyState } from "./empty-state";

interface ActivityFeedProps {
  events: AnalyticsEvent[];
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="size-4 text-primary" />
          Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <EmptyState title="No activity yet" description="Install the tracker script and events will appear here in realtime." />
        ) : (
          <div className="space-y-3">
            {events.slice(0, 9).map((event) => {
              const Icon = event.eventType === "click" ? MousePointerClick : ScrollText;

              return (
                <div key={event.id} className="flex items-start gap-3 rounded-md border border-white/10 bg-white/[0.035] p-3">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-white/10">
                    <Icon className="size-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={event.eventType === "click" ? "warning" : "success"}>{event.eventType}</Badge>
                      <span className="text-xs text-muted-foreground">{formatDateTime(event.timestamp)}</span>
                    </div>
                    <p className="mt-2 truncate text-sm">{event.pageUrl}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{shortId(event.sessionId, 12)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
