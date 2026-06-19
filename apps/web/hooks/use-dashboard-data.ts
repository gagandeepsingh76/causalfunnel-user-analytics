"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchOverview, fetchSessions } from "@/lib/api";
import type { DashboardOverview, SessionsResponse } from "@/lib/types";
import { useAnalyticsStore } from "@/store/analytics-store";

interface DashboardState {
  overview: DashboardOverview | null;
  sessions: SessionsResponse | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useDashboardData(): DashboardState {
  const filters = useAnalyticsStore((state) => state.filters);
  const setLiveVisitors = useAnalyticsStore((state) => state.setLiveVisitors);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [sessions, setSessions] = useState<SessionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const overviewFilters = useMemo(
    () => ({
      from: filters.from,
      to: filters.to,
      pageUrl: filters.pageUrl,
      deviceType: filters.deviceType,
      country: filters.country
    }),
    [filters.country, filters.deviceType, filters.from, filters.pageUrl, filters.to]
  );

  const refresh = useCallback(async () => {
    setError(null);

    try {
      const [overviewData, sessionsData] = await Promise.all([
        fetchOverview(overviewFilters),
        fetchSessions(filters)
      ]);

      setOverview(overviewData);
      setSessions(sessionsData);
      setLiveVisitors(overviewData.liveVisitors);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load analytics");
    } finally {
      setLoading(false);
    }
  }, [filters, overviewFilters, setLiveVisitors]);

  useEffect(() => {
    setLoading(true);
    void refresh();
  }, [refresh]);

  return {
    overview,
    sessions,
    loading,
    error,
    refresh
  };
}
