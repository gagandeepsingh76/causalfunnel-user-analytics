"use client";

import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DimensionPoint } from "@/lib/types";

interface DimensionListProps {
  title: string;
  data: DimensionPoint[];
  icon: LucideIcon;
}

export function DimensionList({ title, data, icon: Icon }: DimensionListProps) {
  const max = data.reduce((largest, item) => Math.max(largest, item.value), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="size-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState title="No breakdown yet" description="This segment fills in as events arrive." icon={Icon} />
        ) : (
          <div className="space-y-4">
            {data.map((item) => {
              const width = max === 0 ? 0 : (item.value / max) * 100;

              return (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate">{item.name}</span>
                    <span className="text-muted-foreground">{item.value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-orange-300"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
