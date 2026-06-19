"use client";

import { Activity, Globe2, LayoutDashboard, MousePointerClick, PanelsTopLeft, Users } from "lucide-react";
import { EventsOverTime } from "@/components/charts/events-over-time";
import { SessionTrend } from "@/components/charts/session-trend";
import { TopPages } from "@/components/charts/top-pages";
import { DeviceAnalytics } from "@/components/charts/device-analytics";
import { DimensionList } from "@/components/charts/dimension-list";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { DashboardSkeleton } from "@/components/dashboard/page-skeleton";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RecentSessionsTable } from "@/components/dashboard/recent-sessions-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { useSocketEvents } from "@/hooks/use-socket-events";

export function DashboardClient() {
  const { overview, sessions, loading, error, refresh } = useDashboardData();
  useSocketEvents({ onRefresh: () => void refresh() });

  if (loading && !overview && !sessions) {
    return <DashboardSkeleton />;
  }

  if (error && !overview && !sessions) {
    return (
      <Card>
        <CardContent className="flex min-h-72 flex-col items-center justify-center gap-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-md bg-destructive/15 text-destructive">
            <Activity className="size-6" />
          </div>
          <div>
            <p className="text-lg font-semibold">Analytics unavailable</p>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
          <Button onClick={() => void refresh()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  const metrics = overview?.metrics ?? {
    totalSessions: 0,
    totalEvents: 0,
    uniquePages: 0,
    avgEventsPerSession: 0
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-muted-foreground">
            <LayoutDashboard className="size-3.5 text-primary" />
            Realtime dashboard
          </div>
          <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">User Analytics</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Sessions, journeys, devices, pages, and visitor behavior in one operational view.
          </p>
        </div>
      </div>

      <FilterBar />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Sessions" value={metrics.totalSessions} icon={Users} accent="teal" />
        <MetricCard label="Total Events" value={metrics.totalEvents} icon={MousePointerClick} accent="orange" />
        <MetricCard label="Unique Pages" value={metrics.uniquePages} icon={PanelsTopLeft} accent="emerald" />
        <MetricCard label="Avg Events / Session" value={metrics.avgEventsPerSession} icon={Activity} accent="violet" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <EventsOverTime data={overview?.eventsOverTime ?? []} />
        <SessionTrend data={overview?.sessionTrend ?? []} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <TopPages data={overview?.topPages ?? []} />
        <ActivityFeed events={overview?.activityFeed ?? []} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <DeviceAnalytics data={overview?.deviceAnalytics ?? []} />
        <DimensionList title="Browser Analytics" data={overview?.browserAnalytics ?? []} icon={PanelsTopLeft} />
        <DimensionList title="Geographical Analytics" data={overview?.geographicalAnalytics ?? []} icon={Globe2} />
      </section>

      {sessions ? <RecentSessionsTable data={sessions} /> : null}
    </div>
  );
}
