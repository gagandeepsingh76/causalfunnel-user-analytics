export type EventType = "page_view" | "click";

export interface AnalyticsEvent {
  id: string;
  sessionId: string;
  eventType: EventType;
  pageUrl: string;
  timestamp: string;
  x?: number;
  y?: number;
  screenWidth?: number;
  screenHeight?: number;
  userAgent: string;
  deviceType: string;
  browser: string;
  country: string;
}

export interface SessionSummary {
  sessionId: string;
  eventCount: number;
  firstVisit: string;
  lastVisit: string;
  pages: string[];
  deviceType: string;
  browser: string;
  country: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SessionsResponse {
  sessions: SessionSummary[];
  pagination: Pagination;
}

export interface MetricSummary {
  totalSessions: number;
  totalEvents: number;
  uniquePages: number;
  avgEventsPerSession: number;
}

export interface TimePoint {
  date: string;
  events: number;
}

export interface SessionTrendPoint {
  date: string;
  sessions: number;
}

export interface TopPage {
  pageUrl: string;
  events: number;
}

export interface DimensionPoint {
  name: string;
  value: number;
}

export interface DashboardOverview {
  metrics: MetricSummary;
  eventsOverTime: TimePoint[];
  sessionTrend: SessionTrendPoint[];
  topPages: TopPage[];
  deviceAnalytics: DimensionPoint[];
  browserAnalytics: DimensionPoint[];
  geographicalAnalytics: DimensionPoint[];
  activityFeed: AnalyticsEvent[];
  liveVisitors: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface SessionJourney {
  sessionId: string;
  events: AnalyticsEvent[];
}

export interface HeatmapPoint {
  x: number;
  y: number;
  count: number;
  intensity: number;
  latest: string;
}

export interface HeatmapResponse {
  pageUrl: string;
  totalClicks: number;
  bounds: {
    width: number;
    height: number;
  };
  points: HeatmapPoint[];
}

export interface PageOption {
  pageUrl: string;
  events: number;
  lastSeen: string;
}

export interface DashboardFilters {
  search: string;
  from: string;
  to: string;
  pageUrl: string;
  deviceType: string;
  country: string;
  page: number;
  limit: number;
}
