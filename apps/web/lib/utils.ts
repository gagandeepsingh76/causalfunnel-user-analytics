import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en", {
    notation: value >= 100000 ? "compact" : "standard",
    maximumFractionDigits: 1
  }).format(value);
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function shortId(value: string, length = 8) {
  if (value.length <= length) {
    return value;
  }

  return `${value.slice(0, length)}...`;
}
