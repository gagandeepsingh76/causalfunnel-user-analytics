import type { FilterQuery, PipelineStage } from "mongoose";
import { EventModel, type EventLean, type EventRecord } from "../models/event.model.js";
import type { AnalyticsQuery, SessionsQuery } from "../schemas/event.schema.js";

export interface SerializedEvent {
  id: string;
  sessionId: string;
  eventType: EventRecord["eventType"];
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

interface TimeBucket {
  date: string;
  events: number;
}

interface SessionBucket {
  date: string;
  sessions: number;
}

interface TopPageBucket {
  pageUrl: string;
  events: number;
}

interface DimensionBucket {
  name: string;
  value: number;
}

interface SessionSummaryAggregate {
  sessionId: string;
  eventCount: number;
  firstVisit: Date;
  lastVisit: Date;
  pages: string[];
  deviceType: string;
  browser: string;
  country: string;
}

interface SessionFacetResult {
  metadata: Array<{ total: number }>;
  data: SessionSummaryAggregate[];
}

export function serializeEvent(event: EventLean): SerializedEvent {
  const serialized: SerializedEvent = {
    id: String(event._id),
    sessionId: event.sessionId,
    eventType: event.eventType,
    pageUrl: event.pageUrl,
    timestamp: event.timestamp.toISOString(),
    userAgent: event.userAgent,
    deviceType: event.deviceType,
    browser: event.browser,
    country: event.country
  };

  if (event.x !== undefined) {
    serialized.x = event.x;
  }

  if (event.y !== undefined) {
    serialized.y = event.y;
  }

  if (event.screenWidth !== undefined) {
    serialized.screenWidth = event.screenWidth;
  }

  if (event.screenHeight !== undefined) {
    serialized.screenHeight = event.screenHeight;
  }

  return serialized;
}

function buildMatch(filters: Partial<SessionsQuery & AnalyticsQuery>) {
  const match: FilterQuery<EventRecord> = {};

  if (filters.from || filters.to) {
    match.timestamp = {};

    if (filters.from) {
      match.timestamp.$gte = filters.from;
    }

    if (filters.to) {
      match.timestamp.$lte = filters.to;
    }
  }

  if (filters.pageUrl) {
    match.pageUrl = filters.pageUrl;
  }

  if (filters.deviceType) {
    match.deviceType = filters.deviceType;
  }

  if (filters.country) {
    match.country = filters.country.toUpperCase();
  }

  if ("eventType" in filters && filters.eventType) {
    match.eventType = filters.eventType;
  }

  return match;
}

function sessionSearchMatch(search: string | undefined) {
  if (!search) {
    return undefined;
  }

  return {
    $or: [
      { sessionId: { $regex: search, $options: "i" } },
      { pages: { $elemMatch: { $regex: search, $options: "i" } } },
      { country: { $regex: search, $options: "i" } },
      { deviceType: { $regex: search, $options: "i" } },
      { browser: { $regex: search, $options: "i" } }
    ]
  };
}

function serializeSession(session: SessionSummaryAggregate) {
  return {
    sessionId: session.sessionId,
    eventCount: session.eventCount,
    firstVisit: session.firstVisit.toISOString(),
    lastVisit: session.lastVisit.toISOString(),
    pages: session.pages,
    deviceType: session.deviceType,
    browser: session.browser,
    country: session.country
  };
}

export async function getLiveVisitorsCount() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const sessions = await EventModel.distinct("sessionId", {
    timestamp: { $gte: fiveMinutesAgo }
  });

  return sessions.length;
}

export async function getDashboardOverview(filters: AnalyticsQuery) {
  const match = buildMatch(filters);

  const [
    totalEvents,
    sessionIds,
    pageUrls,
    eventsOverTime,
    sessionTrend,
    topPages,
    deviceAnalytics,
    browserAnalytics,
    geographicalAnalytics,
    latestEvents,
    liveVisitors
  ] = await Promise.all([
    EventModel.countDocuments(match),
    EventModel.distinct("sessionId", match),
    EventModel.distinct("pageUrl", match),
    EventModel.aggregate<TimeBucket>([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          events: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", events: 1 } }
    ]),
    EventModel.aggregate<SessionBucket>([
      { $match: match },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            sessionId: "$sessionId"
          }
        }
      },
      {
        $group: {
          _id: "$_id.date",
          sessions: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", sessions: 1 } }
    ]),
    EventModel.aggregate<TopPageBucket>([
      { $match: match },
      {
        $group: {
          _id: "$pageUrl",
          events: { $sum: 1 }
        }
      },
      { $sort: { events: -1 } },
      { $limit: 8 },
      { $project: { _id: 0, pageUrl: "$_id", events: 1 } }
    ]),
    EventModel.aggregate<DimensionBucket>([
      { $match: match },
      { $group: { _id: "$deviceType", value: { $sum: 1 } } },
      { $sort: { value: -1 } },
      { $project: { _id: 0, name: "$_id", value: 1 } }
    ]),
    EventModel.aggregate<DimensionBucket>([
      { $match: match },
      { $group: { _id: "$browser", value: { $sum: 1 } } },
      { $sort: { value: -1 } },
      { $limit: 8 },
      { $project: { _id: 0, name: "$_id", value: 1 } }
    ]),
    EventModel.aggregate<DimensionBucket>([
      { $match: match },
      { $group: { _id: "$country", value: { $sum: 1 } } },
      { $sort: { value: -1 } },
      { $limit: 8 },
      { $project: { _id: 0, name: "$_id", value: 1 } }
    ]),
    EventModel.find(match).sort({ timestamp: -1 }).limit(20).lean<EventLean[]>(),
    getLiveVisitorsCount()
  ]);

  const totalSessions = sessionIds.length;

  return {
    metrics: {
      totalSessions,
      totalEvents,
      uniquePages: pageUrls.length,
      avgEventsPerSession: totalSessions === 0 ? 0 : Number((totalEvents / totalSessions).toFixed(2))
    },
    eventsOverTime,
    sessionTrend,
    topPages,
    deviceAnalytics,
    browserAnalytics,
    geographicalAnalytics,
    activityFeed: latestEvents.map(serializeEvent),
    liveVisitors
  };
}

export async function getSessions(query: SessionsQuery) {
  const match = buildMatch(query);
  const skip = (query.page - 1) * query.limit;
  const searchMatch = sessionSearchMatch(query.search);
  const pipeline: PipelineStage[] = [
    { $match: match },
    { $sort: { timestamp: 1 } },
    {
      $group: {
        _id: "$sessionId",
        sessionId: { $first: "$sessionId" },
        eventCount: { $sum: 1 },
        firstVisit: { $min: "$timestamp" },
        lastVisit: { $max: "$timestamp" },
        pages: { $addToSet: "$pageUrl" },
        deviceType: { $last: "$deviceType" },
        browser: { $last: "$browser" },
        country: { $last: "$country" }
      }
    }
  ];

  if (searchMatch) {
    pipeline.push({ $match: searchMatch });
  }

  pipeline.push(
    { $sort: { lastVisit: -1 } },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: query.limit }]
      }
    }
  );

  const [result] = await EventModel.aggregate<SessionFacetResult>(pipeline);
  const total = result?.metadata[0]?.total ?? 0;
  const sessions = result?.data ?? [];

  return {
    sessions: sessions.map(serializeSession),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit))
    }
  };
}

export async function getSessionJourney(sessionId: string) {
  const events = await EventModel.find({ sessionId }).sort({ timestamp: 1 }).lean<EventLean[]>();
  return events.map(serializeEvent);
}

export async function getSessionEventsForExport(sessionId: string) {
  return EventModel.find({ sessionId }).sort({ timestamp: 1 }).lean<EventLean[]>();
}

export async function getFilteredEventsForExport(query: SessionsQuery) {
  const match = buildMatch(query);
  return EventModel.find(match).sort({ timestamp: 1 }).limit(10000).lean<EventLean[]>();
}

export async function getTrackedPages(search?: string) {
  const match: FilterQuery<EventRecord> = {};

  if (search) {
    match.pageUrl = { $regex: search, $options: "i" };
  }

  return EventModel.aggregate<{ pageUrl: string; events: number; lastSeen: Date }>([
    { $match: match },
    {
      $group: {
        _id: "$pageUrl",
        events: { $sum: 1 },
        lastSeen: { $max: "$timestamp" }
      }
    },
    { $sort: { events: -1 } },
    { $limit: 100 },
    { $project: { _id: 0, pageUrl: "$_id", events: 1, lastSeen: 1 } }
  ]);
}

export async function getHeatmap(pageUrl: string) {
  const points = await EventModel.aggregate<{
    x: number;
    y: number;
    count: number;
    latest: Date;
  }>([
    {
      $match: {
        pageUrl,
        eventType: "click",
        x: { $ne: null },
        y: { $ne: null }
      }
    },
    {
      $project: {
        bucketX: { $multiply: [{ $floor: { $divide: ["$x", 24] } }, 24] },
        bucketY: { $multiply: [{ $floor: { $divide: ["$y", 24] } }, 24] },
        timestamp: 1
      }
    },
    {
      $group: {
        _id: {
          x: "$bucketX",
          y: "$bucketY"
        },
        count: { $sum: 1 },
        latest: { $max: "$timestamp" }
      }
    },
    { $sort: { count: -1 } },
    {
      $project: {
        _id: 0,
        x: "$_id.x",
        y: "$_id.y",
        count: 1,
        latest: 1
      }
    }
  ]);

  const maxCount = points.reduce((max, point) => Math.max(max, point.count), 0);
  const maxX = points.reduce((max, point) => Math.max(max, point.x), 1440);
  const maxY = points.reduce((max, point) => Math.max(max, point.y), 900);

  return {
    pageUrl,
    totalClicks: points.reduce((sum, point) => sum + point.count, 0),
    bounds: {
      width: maxX,
      height: maxY
    },
    points: points.map((point) => ({
      x: point.x,
      y: point.y,
      count: point.count,
      intensity: maxCount === 0 ? 0 : Number((point.count / maxCount).toFixed(2)),
      latest: point.latest.toISOString()
    }))
  };
}
