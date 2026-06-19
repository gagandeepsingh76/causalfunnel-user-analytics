"use client";

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { SOCKET_URL } from "@/lib/runtime-config";
import { useAnalyticsStore } from "@/store/analytics-store";

interface UseSocketEventsOptions {
  onRefresh: () => void;
}

export function useSocketEvents({ onRefresh }: UseSocketEventsOptions) {
  const setLiveVisitors = useAnalyticsStore((state) => state.setLiveVisitors);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const socket: Socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"]
    });

    const scheduleRefresh = () => {
      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
      }

      refreshTimer.current = setTimeout(() => {
        onRefresh();
      }, 350);
    };

    socket.on("live:count", (count: number) => {
      setLiveVisitors(count);
    });

    socket.on("event:new", scheduleRefresh);
    socket.on("analytics:refresh", scheduleRefresh);

    return () => {
      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
      }

      socket.disconnect();
    };
  }, [onRefresh, setLiveVisitors]);
}
