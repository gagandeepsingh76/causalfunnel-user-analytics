"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Download, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sessionExportUrl } from "@/lib/api";
import type { SessionsResponse } from "@/lib/types";
import { formatDateTime, shortId } from "@/lib/utils";
import { useAnalyticsStore } from "@/store/analytics-store";
import { EmptyState } from "./empty-state";

interface RecentSessionsTableProps {
  data: SessionsResponse;
}

export function RecentSessionsTable({ data }: RecentSessionsTableProps) {
  const setFilter = useAnalyticsStore((state) => state.setFilter);
  const page = data.pagination.page;
  const canGoBack = page > 1;
  const canGoForward = page < data.pagination.totalPages;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardTitle>Recent Sessions</CardTitle>
        <div className="text-sm text-muted-foreground">{data.pagination.total} sessions</div>
      </CardHeader>
      <CardContent>
        {data.sessions.length === 0 ? (
          <EmptyState title="No sessions match" description="Change filters or send traffic through the tracker script." />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>Events</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>First Visit</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.sessions.map((session) => (
                  <TableRow key={session.sessionId}>
                    <TableCell>
                      <div className="font-medium">{shortId(session.sessionId, 14)}</div>
                      <div className="mt-1 max-w-[260px] truncate text-xs text-muted-foreground">
                        {session.pages[0] ?? "Unknown page"}
                      </div>
                    </TableCell>
                    <TableCell>{session.eventCount}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{session.deviceType}</Badge>
                      <div className="mt-1 text-xs text-muted-foreground">{session.browser}</div>
                    </TableCell>
                    <TableCell>{session.country}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDateTime(session.firstVisit)}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDateTime(session.lastVisit)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="ghost" size="icon" title="Export session CSV">
                          <a href={sessionExportUrl(session.sessionId)}>
                            <Download className="size-4" />
                          </a>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/session/${encodeURIComponent(session.sessionId)}`}>
                            Open
                            <ExternalLink className="size-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Page {data.pagination.page} of {data.pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  title="Previous page"
                  disabled={!canGoBack}
                  onClick={() => setFilter("page", page - 1)}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  title="Next page"
                  disabled={!canGoForward}
                  onClick={() => setFilter("page", page + 1)}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
