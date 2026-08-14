import {
  ExternalLink,
  ScrollText,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShareReportButton } from "@/app/components/ShareReportButton";

export function StatusIcon({
  status,
}: {
  status: "pending" | "complete" | "failed";
}) {
  if (status === "pending") return <Clock className="h-3.5 w-3.5 opacity-70" />;
  if (status === "failed")
    return <XCircle className="h-3.5 w-3.5 opacity-70" />;
  return <CheckCircle2 className="h-3.5 w-3.5 opacity-70" />;
}

export function ResultsSkeleton({ surname }: { surname?: string }) {
  return (
    <Card className="border-indigo-200/60 bg-white dark:border-indigo-500/20 dark:bg-gradient-to-br dark:from-indigo-950/80 dark:via-purple-950/60 dark:to-slate-950/80">
      <CardHeader>
        <CardDescription className="flex items-center gap-2 text-indigo-600/80 dark:text-indigo-300/70">
          <Clock className="h-3.5 w-3.5 animate-pulse" />
          Researching {surname ? `"${surname}"` : "this name"}...
        </CardDescription>
        <Skeleton className="h-7 w-48 dark:bg-indigo-800/40" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Skeleton className="h-4 w-full dark:bg-indigo-800/30" />
        <Skeleton className="h-4 w-5/6 dark:bg-indigo-800/30" />
        <Skeleton className="h-4 w-2/3 dark:bg-indigo-800/30" />
      </CardContent>
    </Card>
  );
}

export function FailedCard({ surname }: { surname?: string }) {
  return (
    <Card className="border-destructive/40 dark:border-red-500/30 dark:bg-gradient-to-br dark:from-slate-950 dark:via-red-950/20 dark:to-slate-950">
      <CardContent className="flex items-center gap-3 pt-6">
        <XCircle className="text-destructive h-5 w-5 shrink-0" />
        <div>
          <p className="text-sm font-medium">
            Couldn&apos;t generate a report for &quot;{surname}&quot;
          </p>
          <p className="text-muted-foreground text-sm dark:text-indigo-200/60">
            Try searching again — this is usually a temporary issue with the
            source lookup.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReportCard({
  surname,
  origin,
  meaning,
  geographicDistribution,
  notableBearers,
  summary,
  sources,
  searchId,
}: {
  surname: string;
  origin?: string;
  meaning?: string;
  geographicDistribution?: string;
  notableBearers: string[];
  summary: string;
  sources: { title: string; url: string }[];
  searchId?: string;
}) {
  return (
    <Card className="relative overflow-hidden border-indigo-200/70 bg-white shadow-lg shadow-indigo-500/5 dark:border-indigo-500/25 dark:bg-gradient-to-br dark:from-indigo-950 dark:via-purple-950/90 dark:to-slate-950 dark:shadow-2xl dark:shadow-indigo-900/40">
      {/* Soft glow orbs — dark mode only */}
      <div className="pointer-events-none absolute -left-20 -top-20 hidden h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl dark:block" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 hidden h-48 w-48 rounded-full bg-purple-500/20 blur-3xl dark:block" />

      <CardHeader className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardDescription className="text-xs font-medium uppercase tracking-widest text-indigo-600/70 dark:text-indigo-300/60">
              Family history report
            </CardDescription>
            <CardTitle className="mt-1 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent dark:from-indigo-200 dark:via-purple-200 dark:to-indigo-100">
              {surname}
            </CardTitle>
          </div>
          {searchId && <ShareReportButton searchId={searchId} />}
        </div>
      </CardHeader>

      <CardContent className="relative flex flex-col gap-6">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-indigo-100/90">
          {summary}
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Fact label="Origin" value={origin} />
          <Fact label="Meaning" value={meaning} />
          <Fact
            label="Where it's common today"
            value={geographicDistribution}
            className="sm:col-span-2"
          />
        </div>

        {notableBearers.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-widest text-indigo-600/70 dark:text-indigo-300/60">
              Notable people with this name
            </span>
            <div className="flex flex-wrap gap-1.5">
              {notableBearers.map((name) => (
                <Badge
                  key={name}
                  className="border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 dark:border-purple-400/20 dark:bg-purple-500/15 dark:text-purple-100 dark:hover:bg-purple-500/25"
                >
                  {name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {sources.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-indigo-100 pt-4 dark:border-indigo-500/15">
            <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-indigo-600/70 dark:text-indigo-300/60">
              <ScrollText className="h-3.5 w-3.5" />
              Sources
            </span>
            <ul className="flex flex-col gap-1.5">
              {sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-indigo-700/70 underline-offset-4 transition hover:text-indigo-900 hover:underline dark:text-indigo-300/70 dark:hover:text-indigo-200"
                  >
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Fact({
  label,
  value,
  className,
}: {
  label: string;
  value?: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-indigo-100/80 bg-indigo-50/50 px-4 py-3 dark:border-indigo-500/15 dark:bg-white/5 ${className ?? ""}`}
    >
      <span className="text-xs font-medium uppercase tracking-widest text-indigo-600/70 dark:text-indigo-300/60">
        {label}
      </span>
      <p className="mt-1 text-sm text-slate-800 dark:text-indigo-50">
        {value || "Not found in sources"}
      </p>
    </div>
  );
}
