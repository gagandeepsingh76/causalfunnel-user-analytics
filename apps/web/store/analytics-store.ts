"use client";

import { create } from "zustand";
import type { DashboardFilters } from "@/lib/types";

interface AnalyticsStore {
  filters: DashboardFilters;
  liveVisitors: number;
  setFilter: <K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) => void;
  setFilters: (filters: Partial<DashboardFilters>) => void;
  resetFilters: () => void;
  setLiveVisitors: (count: number) => void;
}

const initialFilters: DashboardFilters = {
  search: "",
  from: "",
  to: "",
  pageUrl: "",
  deviceType: "",
  country: "",
  page: 1,
  limit: 10
};

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  filters: initialFilters,
  liveVisitors: 0,
  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
        page: key === "page" ? Number(value) : 1
      }
    })),
  setFilters: (filters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters
      }
    })),
  resetFilters: () => set({ filters: initialFilters }),
  setLiveVisitors: (count) => set({ liveVisitors: count })
}));
