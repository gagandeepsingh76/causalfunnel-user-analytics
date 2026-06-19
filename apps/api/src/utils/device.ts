import { UAParser } from "ua-parser-js";
import type { Request } from "express";

export function parseDevice(userAgent: string | undefined) {
  const parser = new UAParser(userAgent ?? "");
  const result = parser.getResult();
  const rawType = result.device.type;

  return {
    deviceType: rawType ?? "desktop",
    browser: result.browser.name ?? "Unknown"
  };
}

export function getCountry(req: Request) {
  const country =
    req.header("x-vercel-ip-country") ??
    req.header("cf-ipcountry") ??
    req.header("x-country-code") ??
    req.header("cloudfront-viewer-country");

  if (!country || country.toLowerCase() === "xx") {
    return "Unknown";
  }

  return country.toUpperCase();
}
