"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, Flame, Gauge, Menu, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sessionsExportUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAnalyticsStore } from "@/store/analytics-store";

const mobileNav = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Gauge
  },
  {
    href: "/dashboard/heatmap",
    label: "Heatmap",
    icon: Flame
  }
];

export function Topbar() {
  const pathname = usePathname();
  const filters = useAnalyticsStore((state) => state.filters);
  const liveVisitors = useAnalyticsStore((state) => state.liveVisitors);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#060914]/75 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 w-full max-w-[1500px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 md:hidden">
          <Button variant="ghost" size="icon" title="Menu">
            <Menu className="size-5" />
          </Button>
          <span className="text-sm font-semibold">TrackFlow AI</span>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <div className="flex size-8 items-center justify-center rounded-md border border-emerald-300/30 bg-emerald-300/10">
            <Radio className="size-4 text-emerald-200" />
          </div>
          <div>
            <p className="text-sm font-medium">{liveVisitors} live visitors</p>
            <p className="text-xs text-muted-foreground">Last 5 minutes</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <nav className="flex md:hidden">
            {mobileNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Button key={item.href} asChild variant="ghost" size="icon" title={item.label}>
                  <Link href={item.href} className={cn(isActive && "bg-white/10")}>
                    <Icon className="size-4" />
                  </Link>
                </Button>
              );
            })}
          </nav>
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <a href={sessionsExportUrl(filters)}>
              <Download className="size-4" />
              Export CSV
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
