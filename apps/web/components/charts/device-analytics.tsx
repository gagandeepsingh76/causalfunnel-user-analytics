"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Smartphone } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DimensionPoint } from "@/lib/types";

interface DeviceAnalyticsProps {
  data: DimensionPoint[];
}

const colors = ["#22d3ee", "#fb923c", "#34d399", "#a78bfa", "#f43f5e"];

export function DeviceAnalytics({ data }: DeviceAnalyticsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState title="No device data" description="Device splits appear with tracked sessions." icon={Smartphone} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-[1fr_0.9fr]">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} dataKey="value" nameKey="name" innerRadius={54} outerRadius={84} paddingAngle={3}>
                    {data.map((entry, index) => (
                      <Cell key={entry.name} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 8
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center gap-3">
              {data.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="size-2.5 shrink-0 rounded-full" style={{ background: colors[index % colors.length] }} />
                    <span className="truncate capitalize">{item.name}</span>
                  </div>
                  <span className="text-muted-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
