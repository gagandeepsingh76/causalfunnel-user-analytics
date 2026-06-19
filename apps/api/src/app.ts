import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error.js";
import { notFound } from "./middleware/not-found.js";
import { analyticsRouter } from "./routes/analytics.routes.js";
import { eventsRouter } from "./routes/events.routes.js";
import { heatmapRouter } from "./routes/heatmap.routes.js";
import { sessionsRouter } from "./routes/sessions.routes.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(currentDir, "../public");

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(
    helmet({
      crossOriginResourcePolicy: false
    })
  );
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || env.corsOrigins.includes("*") || env.corsOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`Origin ${origin} is not allowed by CORS`));
      },
      credentials: true
    })
  );
  app.use(express.json({ limit: "64kb" }));
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

  app.get("/health", (_req, res) => {
    res.json({
      success: true,
      service: "trackflow-api",
      timestamp: new Date().toISOString()
    });
  });

  app.get("/tracker.js", (_req, res) => {
    res.header("Content-Type", "application/javascript; charset=utf-8");
    res.header("Cache-Control", "public, max-age=300");
    res.header("Access-Control-Allow-Origin", "*");
    res.sendFile(resolve(publicDir, "tracker.js"));
  });

  app.use("/api/events", eventsRouter);
  app.use("/api/sessions", sessionsRouter);
  app.use("/api/heatmap", heatmapRouter);
  app.use("/api/analytics", analyticsRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
