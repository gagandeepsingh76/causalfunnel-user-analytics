"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TopPage } from "@/lib/types";

interface TopPagesProps {
  data: TopPage[];
}

function shortenPage(pageUrl: string) {
  try {
    const url = new URL(pageUrl);
    return `${url.pathname}${url.search}` || "/";
  } catch {
    return pageUrl.length > 38 ? `${pageUrl.slice(0, 38)}...` : pageUrl;
  }
}

export function TopPages({ data }: TopPagesProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: shortenPage(item.pageUrl)
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Pages</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState title="No pages tracked" description="Page URLs appear after page view events arrive." />
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 16, right: 20, top: 10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={140}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 8
                  }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Bar dataKey="events" fill="#34d399" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
