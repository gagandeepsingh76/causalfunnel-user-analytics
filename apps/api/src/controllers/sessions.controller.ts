import type { Request, Response } from "express";
import type { EventLean } from "../models/event.model.js";
import type { SessionsQuery } from "../schemas/event.schema.js";
import {
  getFilteredEventsForExport,
  getSessionEventsForExport,
  getSessionJourney,
  getSessions
} from "../services/analytics.service.js";
import { toCsv } from "../utils/csv.js";
import { HttpError } from "../utils/http-error.js";

function eventRows(events: EventLean[]) {
  return events.map((event) => ({
    id: String(event._id),
    sessionId: event.sessionId,
    eventType: event.eventType,
    pageUrl: event.pageUrl,
    timestamp: event.timestamp.toISOString(),
    x: event.x,
    y: event.y,
    userAgent: event.userAgent,
    deviceType: event.deviceType,
    browser: event.browser,
    country: event.country
  }));
}

export async function listSessions(req: Request, res: Response) {
  const data = await getSessions(req.query as unknown as SessionsQuery);

  res.json({
    success: true,
    data
  });
}

export async function sessionJourney(req: Request, res: Response) {
  const rawSessionId = req.params.id;
  const sessionId = Array.isArray(rawSessionId) ? rawSessionId[0] : rawSessionId;

  if (!sessionId) {
    throw new HttpError(400, "Session id is required");
  }

  const events = await getSessionJourney(sessionId);

  if (events.length === 0) {
    throw new HttpError(404, "Session not found");
  }

  res.json({
    success: true,
    data: {
      sessionId,
      events
    }
  });
}

export async function exportSession(req: Request, res: Response) {
  const rawSessionId = req.params.id;
  const sessionId = Array.isArray(rawSessionId) ? rawSessionId[0] : rawSessionId;

  if (!sessionId) {
    throw new HttpError(400, "Session id is required");
  }

  const events = await getSessionEventsForExport(sessionId);

  if (events.length === 0) {
    throw new HttpError(404, "Session not found");
  }

  const rows = eventRows(events);
  const csv = toCsv(rows, [
    "id",
    "sessionId",
    "eventType",
    "pageUrl",
    "timestamp",
    "x",
    "y",
    "userAgent",
    "deviceType",
    "browser",
    "country"
  ]);

  res.header("Content-Type", "text/csv; charset=utf-8");
  res.header("Content-Disposition", `attachment; filename="trackflow-session-${sessionId}.csv"`);
  res.send(csv);
}

export async function exportSessions(req: Request, res: Response) {
  const events = await getFilteredEventsForExport(req.query as unknown as SessionsQuery);
  const rows = eventRows(events);
  const csv = toCsv(rows, [
    "id",
    "sessionId",
    "eventType",
    "pageUrl",
    "timestamp",
    "x",
    "y",
    "userAgent",
    "deviceType",
    "browser",
    "country"
  ]);

  res.header("Content-Type", "text/csv; charset=utf-8");
  res.header("Content-Disposition", "attachment; filename=\"trackflow-sessions.csv\"");
  res.send(csv);
}
