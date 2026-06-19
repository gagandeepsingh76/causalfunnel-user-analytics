import { Router } from "express";
import { heatmap, pages } from "../controllers/heatmap.controller.js";
import { validate } from "../middleware/validate.js";
import { heatmapQuerySchema, pagesQuerySchema } from "../schemas/event.schema.js";
import { asyncHandler } from "../utils/async-handler.js";

export const heatmapRouter = Router();

heatmapRouter.get("/pages", validate(pagesQuerySchema), asyncHandler(pages));
heatmapRouter.get("/", validate(heatmapQuerySchema), asyncHandler(heatmap));
