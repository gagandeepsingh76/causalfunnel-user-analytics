import { Router } from "express";
import {
  exportSession,
  exportSessions,
  listSessions,
  sessionJourney
} from "../controllers/sessions.controller.js";
import { validate } from "../middleware/validate.js";
import { sessionParamsSchema, sessionsQuerySchema } from "../schemas/event.schema.js";
import { asyncHandler } from "../utils/async-handler.js";

export const sessionsRouter = Router();

sessionsRouter.get("/export", validate(sessionsQuerySchema), asyncHandler(exportSessions));
sessionsRouter.get("/", validate(sessionsQuerySchema), asyncHandler(listSessions));
sessionsRouter.get("/:id", validate(sessionParamsSchema), asyncHandler(sessionJourney));
sessionsRouter.get("/:id/export", validate(sessionParamsSchema), asyncHandler(exportSession));
