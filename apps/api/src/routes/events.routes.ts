import { Router } from "express";
import { storeEvent } from "../controllers/events.controller.js";
import { validate } from "../middleware/validate.js";
import { createEventSchema } from "../schemas/event.schema.js";
import { asyncHandler } from "../utils/async-handler.js";

export const eventsRouter = Router();

eventsRouter.post("/", validate(createEventSchema), asyncHandler(storeEvent));
