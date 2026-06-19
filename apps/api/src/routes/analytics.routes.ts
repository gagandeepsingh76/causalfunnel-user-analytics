import { Router } from "express";
import { liveVisitors, overview } from "../controllers/analytics.controller.js";
import { validate } from "../middleware/validate.js";
import { analyticsQuerySchema } from "../schemas/event.schema.js";
import { asyncHandler } from "../utils/async-handler.js";

export const analyticsRouter = Router();

analyticsRouter.get("/overview", validate(analyticsQuerySchema), asyncHandler(overview));
analyticsRouter.get("/live", asyncHandler(liveVisitors));
