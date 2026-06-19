import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";

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
        <Script src="http://localhost:4000/tracker.js" strategy="afterInteractive" />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
