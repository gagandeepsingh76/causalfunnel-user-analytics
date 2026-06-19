"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Gauge, LineChart, Radio } from "lucide-react";
import { TRACKER_SCRIPT_URL } from "@/lib/runtime-config";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Gauge
  },
  {
    label: "Heatmap",
    href: "/dashboard/heatmap",
    icon: Flame
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 bg-black/20 backdrop-blur-2xl md:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-3 px-5">
          <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-glow">
            <LineChart className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">TrackFlow AI</p>
            <p className="text-xs text-muted-foreground">Realtime analytics</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground",
                  isActive && "bg-white/10 text-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="m-3 min-w-0 rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <Radio className="size-4 text-primary" />
            Tracker
          </div>
          <code className="block max-w-full overflow-hidden rounded-md bg-black/30 p-3 text-[11px] leading-5 text-muted-foreground">
            <span className="block">&lt;script</span>
            <span className="block break-all pl-2">
              src=&quot;{TRACKER_SCRIPT_URL}&quot;&gt;
            </span>
            <span className="block">&lt;/script&gt;</span>
          </code>
        </div>
      </div>
    </aside>
  );
}
