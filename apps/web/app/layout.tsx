import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { TRACKER_SCRIPT_URL } from "@/lib/runtime-config";

export const metadata: Metadata = {
  title: "TrackFlow AI",
  description: "Realtime user analytics, session journeys, and heatmaps."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <Script src={TRACKER_SCRIPT_URL} strategy="afterInteractive" />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
