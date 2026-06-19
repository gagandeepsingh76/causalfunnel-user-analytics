import type { Request } from "express";
import { EventModel, type EventLean } from "../models/event.model.js";
import type { CreateEventBody } from "../schemas/event.schema.js";
import { getCountry, parseDevice } from "../utils/device.js";
import { serializeEvent } from "./analytics.service.js";

export async function createEvent(input: CreateEventBody, req: Request) {
  const userAgent = req.header("user-agent") ?? "";
  const { deviceType, browser } = parseDevice(userAgent);
  const country = getCountry(req);

  const document = await EventModel.create({
    sessionId: input.sessionId,
    eventType: input.eventType,
    pageUrl: input.pageUrl,
    timestamp: input.timestamp ?? new Date(),
    x: input.eventType === "click" ? input.x : undefined,
    y: input.eventType === "click" ? input.y : undefined,
    screenWidth: input.screenWidth,
    screenHeight: input.screenHeight,
    userAgent,
    deviceType,
    browser,
    country
  });

  return serializeEvent(document.toObject<EventLean>());
}
