import type { Request, Response } from "express";
import type { Server } from "socket.io";
import type { CreateEventBody } from "../schemas/event.schema.js";
import { getLiveVisitorsCount } from "../services/analytics.service.js";
import { createEvent } from "../services/event.service.js";

export async function storeEvent(req: Request, res: Response) {
  const event = await createEvent(req.body as CreateEventBody, req);
  const io = req.app.get("io") as Server | undefined;

  if (io) {
    io.emit("event:new", event);
    io.emit("analytics:refresh", {
      reason: "event_ingested",
      timestamp: new Date().toISOString()
    });
    io.emit("live:count", await getLiveVisitorsCount());
  }

  res.status(201).json({
    success: true,
    data: event
  });
}
