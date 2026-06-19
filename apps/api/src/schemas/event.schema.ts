import { z } from "zod";

const dateQuery = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) {
    return undefined;
  }

  return value;
}, z.coerce.date().optional());

const optionalString = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) {
    return undefined;
  }

  return value;
}, z.string().trim().optional());

export const createEventSchema = z.object({
  body: z.object({
    sessionId: z.string().trim().min(8).max(128),
    eventType: z.enum(["page_view", "click"]),
    pageUrl: z.string().trim().min(1).max(2048),
    timestamp: z.coerce.date().optional(),
    x: z.coerce.number().finite().nonnegative().optional(),
    y: z.coerce.number().finite().nonnegative().optional(),
    screenWidth: z.coerce.number().finite().nonnegative().optional(),
    screenHeight: z.coerce.number().finite().nonnegative().optional()
  })
});

export const sessionsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: optionalString,
    pageUrl: optionalString,
    deviceType: optionalString,
    country: optionalString,
    eventType: z.enum(["page_view", "click"]).optional(),
    from: dateQuery,
    to: dateQuery
  })
});

export const analyticsQuerySchema = z.object({
  query: z.object({
    pageUrl: optionalString,
    deviceType: optionalString,
    country: optionalString,
    from: dateQuery,
    to: dateQuery
  })
});

export const heatmapQuerySchema = z.object({
  query: z.object({
    page: z.string().trim().min(1).max(2048)
  })
});

export const pagesQuerySchema = z.object({
  query: z.object({
    search: optionalString
  })
});

export const sessionParamsSchema = z.object({
  params: z.object({
    id: z.string().trim().min(1).max(128)
  })
});

export type CreateEventBody = z.infer<typeof createEventSchema>["body"];
export type SessionsQuery = z.infer<typeof sessionsQuerySchema>["query"];
export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>["query"];
export type HeatmapQuery = z.infer<typeof heatmapQuerySchema>["query"];
export type PagesQuery = z.infer<typeof pagesQuerySchema>["query"];
export type SessionParams = z.infer<typeof sessionParamsSchema>["params"];
