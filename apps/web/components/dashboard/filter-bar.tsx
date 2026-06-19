"use client";

import { CalendarDays, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAnalyticsStore } from "@/store/analytics-store";

export function FilterBar() {
  const filters = useAnalyticsStore((state) => state.filters);
  const setFilter = useAnalyticsStore((state) => state.setFilter);
  const resetFilters = useAnalyticsStore((state) => state.resetFilters);

  return (
    <div className="glass-panel grid gap-3 rounded-lg p-3 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.9fr_0.8fr_auto]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(event) => setFilter("search", event.target.value)}
          className="pl-9"
          placeholder="Search sessions, pages, country"
        />
      </div>
      <div className="relative">
        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="date"
          value={filters.from}
          onChange={(event) => setFilter("from", event.target.value)}
          className="pl-9"
          aria-label="From date"
        />
      </div>
      <Input
        type="date"
        value={filters.to}
        onChange={(event) => setFilter("to", event.target.value)}
        aria-label="To date"
      />
      <Select
        value={filters.deviceType || "all"}
        onValueChange={(value) => setFilter("deviceType", value === "all" ? "" : value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Device" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All devices</SelectItem>
          <SelectItem value="desktop">Desktop</SelectItem>
          <SelectItem value="mobile">Mobile</SelectItem>
          <SelectItem value="tablet">Tablet</SelectItem>
        </SelectContent>
      </Select>
      <Input
        value={filters.country}
        onChange={(event) => setFilter("country", event.target.value.toUpperCase())}
        placeholder="Country code"
        maxLength={12}
      />
      <Button type="button" variant="outline" onClick={resetFilters} title="Reset filters">
        <RotateCcw className="size-4" />
        Reset
      </Button>
    </div>
  );
}
