function normalizePublicUrl(name: string, value: string | undefined) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    throw new Error(`${name} is required`);
  }

  return trimmedValue.replace(/\/+$/, "");
}

export const API_BASE_URL = normalizePublicUrl("NEXT_PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL);
export const SOCKET_URL = normalizePublicUrl("NEXT_PUBLIC_SOCKET_URL", process.env.NEXT_PUBLIC_SOCKET_URL);
export const TRACKER_SCRIPT_URL = new URL("/tracker.js", API_BASE_URL).toString();
