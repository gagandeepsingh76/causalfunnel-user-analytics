"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  accent: "teal" | "orange" | "emerald" | "violet";
  suffix?: string;
}

const accents = {
  teal: "from-cyan-300/20 text-cyan-200 border-cyan-300/25",
  orange: "from-orange-300/20 text-orange-200 border-orange-300/25",
  emerald: "from-emerald-300/20 text-emerald-200 border-emerald-300/25",
  violet: "from-violet-300/20 text-violet-200 border-violet-300/25"
};

export function MetricCard({ label, value, icon: Icon, accent, suffix }: MetricCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-normal">
                {formatNumber(value)}
                {suffix}
              </p>
            </div>
            <div className={`rounded-md border bg-gradient-to-br to-transparent p-2.5 ${accents[accent]}`}>
              <Icon className="size-5" />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowUpRight className="size-3.5 text-emerald-300" />
            Streaming from live event ingestion
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
