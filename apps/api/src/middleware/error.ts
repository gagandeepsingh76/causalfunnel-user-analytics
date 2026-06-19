import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http-error.js";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const details = err instanceof HttpError ? err.details : undefined;

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    details,
    stack: env.NODE_ENV === "production" ? undefined : err.stack
  });
}
