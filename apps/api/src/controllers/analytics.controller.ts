import type { Request, Response } from "express";
import type { AnalyticsQuery } from "../schemas/event.schema.js";
import { getDashboardOverview, getLiveVisitorsCount } from "../services/analytics.service.js";

export async function overview(req: Request, res: Response) {
  const data = await getDashboardOverview(req.query as unknown as AnalyticsQuery);

  res.json({
    success: true,
    data
  });
}

export async function liveVisitors(req: Request, res: Response) {
  const count = await getLiveVisitorsCount();

  res.json({
    success: true,
    data: {
      count
    }
  });
}
