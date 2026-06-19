"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Flame, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchHeatmap, fetchTrackedPages } from "@/lib/api";
import type { HeatmapPoint, HeatmapResponse, PageOption } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { EmptyState } from "./empty-state";

function HeatPoint({
  point,
  bounds,
  active,
  onHover
}: {
  point: HeatmapPoint;
  bounds: HeatmapResponse["bounds"];
  active: boolean;
  onHover: (point: HeatmapPoint | null) => void;
}) {
  const left = Math.min(96, Math.max(0, (point.x / Math.max(bounds.width, 1)) * 100));
  const top = Math.min(94, Math.max(0, (point.y / Math.max(bounds.height, 1)) * 100));
  const size = 34 + point.intensity * 76;
  const opacity = 0.24 + point.intensity * 0.58;

  return (
    <button
      type="button"
      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(251,146,60,${opacity}) 0%, rgba(244,63,94,${opacity * 0.7}) 38%, rgba(34,211,238,0) 72%)`
      }}
      onMouseEnter={() => onHover(point)}
      onMouseLeave={() => onHover(null)}
      title={`${point.count} clicks`}
      aria-label={`${point.count} clicks at ${point.x}, ${point.y}`}
      data-active={active}
    />
  );
}

function HeatmapVisual({ heatmap }: { heatmap: HeatmapResponse }) {
  const [hoveredPoint, setHoveredPoint] = useState<HeatmapPoint | null>(null);

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="truncate text-sm">{heatmap.pageUrl}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-b border-white/10 bg-[#0c111d] px-4 py-3">
            <div className="flex gap-2">
              <span className="size-3 rounded-full bg-red-400/80" />
              <span className="size-3 rounded-full bg-amber-300/80" />
              <span className="size-3 rounded-full bg-emerald-300/80" />
            </div>
          </div>
          <div className="relative aspect-[16/9] min-h-[320px] overflow-hidden bg-[#111827]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:36px_36px]" />
            <div className="absolute left-8 top-8 h-8 w-56 rounded-md bg-white/10" />
            <div className="absolute left-8 top-24 h-24 w-[42%] rounded-md bg-white/[0.07]" />
            <div className="absolute right-8 top-24 h-48 w-[32%] rounded-md bg-white/[0.06]" />
            <div className="absolute bottom-8 left-8 right-8 h-28 rounded-md bg-white/[0.05]" />
            <div className="absolute inset-0">
              {heatmap.points.map((point) => (
                <HeatPoint
                  key={`${point.x}-${point.y}`}
                  point={point}
                  bounds={heatmap.bounds}
                  active={hoveredPoint?.x === point.x && hoveredPoint?.y === point.y}
                  onHover={setHoveredPoint}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hover Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          {hoveredPoint ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Clicks</p>
                <p className="mt-1 text-3xl font-semibold">{hoveredPoint.count}</p>
              </div>
              <div className="grid gap-3 text-sm">
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
                  Coordinates: {hoveredPoint.x}, {hoveredPoint.y}
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
                  Intensity: {Math.round(hoveredPoint.intensity * 100)}%
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
                  Latest: {formatDateTime(hoveredPoint.latest)}
                </div>
              </div>
            </div>
          ) : (
            <EmptyState title="Hover a hotspot" description="Point-level click details appear here." icon={Flame} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function HeatmapClient() {
  const [pages, setPages] = useState<PageOption[]>([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [heatmap, setHeatmap] = useState<HeatmapResponse | null>(null);
  const [loadingPages, setLoadingPages] = useState(true);
  const [loadingHeatmap, setLoadingHeatmap] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPageMeta = useMemo(
    () => pages.find((page) => page.pageUrl === selectedPage),
    [pages, selectedPage]
  );

  const loadPages = useCallback(async () => {
    setLoadingPages(true);
    setError(null);

    try {
      const data = await fetchTrackedPages();
      setPages(data);
      setSelectedPage((current) => current || data[0]?.pageUrl || "");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load pages");
    } finally {
      setLoadingPages(false);
    }
  }, []);

  useEffect(() => {
    void loadPages();
  }, [loadPages]);

  useEffect(() => {
    if (!selectedPage) {
      setHeatmap(null);
      return;
    }

    let cancelled = false;

    async function loadHeatmap() {
      setLoadingHeatmap(true);
      setError(null);

      try {
        const data = await fetchHeatmap(selectedPage);

        if (!cancelled) {
          setHeatmap(data);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError.message : "Unable to load heatmap");
        }
      } finally {
        if (!cancelled) {
          setLoadingHeatmap(false);
        }
      }
    }

    void loadHeatmap();

    return () => {
      cancelled = true;
    };
  }, [selectedPage]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-muted-foreground">
            <Flame className="size-3.5 text-orange-200" />
            Heatmap
          </div>
          <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">Click Intensity</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {selectedPageMeta ? `${selectedPageMeta.events} events tracked on selected URL` : "Tracked URLs appear after events arrive."}
          </p>
        </div>
        <div className="grid w-full gap-2 sm:grid-cols-[minmax(0,420px)_auto] lg:w-auto">
          <Select value={selectedPage || "empty"} onValueChange={(value) => setSelectedPage(value === "empty" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select URL" />
            </SelectTrigger>
            <SelectContent>
              {pages.length === 0 ? (
                <SelectItem value="empty" disabled>
                  No URLs tracked
                </SelectItem>
              ) : (
                pages.map((page) => (
                  <SelectItem key={page.pageUrl} value={page.pageUrl}>
                    {page.pageUrl}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => void loadPages()} disabled={loadingPages} title="Refresh URLs">
            <RefreshCcw className="size-4" />
            Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <EmptyState title="Heatmap unavailable" description={error} icon={Flame} />
      ) : loadingPages || loadingHeatmap ? (
        <Skeleton className="h-[560px] rounded-lg" />
      ) : heatmap && heatmap.points.length > 0 ? (
        <HeatmapVisual heatmap={heatmap} />
      ) : selectedPage ? (
        <EmptyState title="No clicks for this URL" description="Page views exist, but no click coordinates have been captured." icon={Flame} />
      ) : (
        <EmptyState title="No tracked URLs" description="Tracked pages appear here after the first page view event." icon={Flame} />
      )}
    </div>
  );
}
