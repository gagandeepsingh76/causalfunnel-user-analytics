import type { Request, Response } from "express";
import type { HeatmapQuery, PagesQuery } from "../schemas/event.schema.js";
import { getHeatmap, getTrackedPages } from "../services/analytics.service.js";

export async function heatmap(req: Request, res: Response) {
  const { page } = req.query as unknown as HeatmapQuery;
  const data = await getHeatmap(page);

  res.json({
    success: true,
    data
  });
}

export async function pages(req: Request, res: Response) {
  const { search } = req.query as unknown as PagesQuery;
  const data = await getTrackedPages(search);

  res.json({
    success: true,
    data: data.map((page) => ({
      pageUrl: page.pageUrl,
      events: page.events,
      lastSeen: page.lastSeen.toISOString()
    }))
  });
}
