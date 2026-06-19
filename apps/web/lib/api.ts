import axios from "axios";
import type {
  ApiEnvelope,
  DashboardFilters,
  DashboardOverview,
  HeatmapResponse,
  PageOption,
  SessionJourney,
  SessionsResponse
} from "@/lib/types";
import { API_BASE_URL } from "@/lib/runtime-config";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

function cleanParams(filters: Partial<DashboardFilters>) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== "" && value !== undefined && value !== null)
  );
}

export async function fetchOverview(filters: Partial<DashboardFilters>) {
  const response = await api.get<ApiEnvelope<DashboardOverview>>("/api/analytics/overview", {
    params: cleanParams(filters)
  });

  return response.data.data;
}

export async function fetchSessions(filters: Partial<DashboardFilters>) {
  const response = await api.get<ApiEnvelope<SessionsResponse>>("/api/sessions", {
    params: cleanParams(filters)
  });

  return response.data.data;
}

export async function fetchSessionJourney(sessionId: string) {
  const response = await api.get<ApiEnvelope<SessionJourney>>(`/api/sessions/${sessionId}`);
  return response.data.data;
}

export async function fetchTrackedPages(search?: string) {
  const response = await api.get<ApiEnvelope<PageOption[]>>("/api/heatmap/pages", {
    params: cleanParams({ search: search ?? "" })
  });

  return response.data.data;
}

export async function fetchHeatmap(pageUrl: string) {
  const response = await api.get<ApiEnvelope<HeatmapResponse>>("/api/heatmap", {
    params: { page: pageUrl }
  });

  return response.data.data;
}

export function sessionExportUrl(sessionId: string) {
  return `${API_BASE_URL}/api/sessions/${encodeURIComponent(sessionId)}/export`;
}

export function sessionsExportUrl(filters: Partial<DashboardFilters>) {
  const params = new URLSearchParams();

  Object.entries(cleanParams(filters)).forEach(([key, value]) => {
    params.set(key, String(value));
  });

  const query = params.toString();
  return `${API_BASE_URL}/api/sessions/export${query ? `?${query}` : ""}`;
}
