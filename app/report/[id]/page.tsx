// "use client";

// import { use } from "react";
// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import type { Id } from "@/convex/_generated/dataModel";
// import { motion } from "framer-motion";
// import {
//   ExternalLink,
//   ScrollText,
//   Share2,
//   Check,
//   ArrowLeft,
// } from "lucide-react";
// import Link from "next/link";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";

// export default function PublicReportPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = use(params);
//   const report = useQuery(api.surnameSearches.getPublicReport, {
//     searchId: id as Id<"surnameSearches">,
//   });
//   const [copied, setCopied] = useState(false);

//   async function copyLink() {
//     await navigator.clipboard.writeText(window.location.href);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   }

//   if (report === undefined) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950">
//         <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
//       </div>
//     );
//   }

//   if (report === null) {
//     return (
//       <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 px-6 text-center">
//         <p className="text-lg text-indigo-100">
//           Report not found or still processing.
//         </p>
//         <Link href="/">
//           <Button
//             variant="outline"
//             className="border-indigo-400/40 text-indigo-200"
//           >
//             <ArrowLeft className="mr-2 h-4 w-4" /> Home
//           </Button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950">
//       {/* Decorative orbs */}
//       <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
//       <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

//       <div className="relative mx-auto max-w-2xl px-6 py-12 md:py-20">
//         <div className="mb-8 flex items-center justify-between">
//           <Link
//             href="/"
//             className="flex items-center gap-1.5 text-sm text-indigo-300/70 transition hover:text-indigo-200"
//           >
//             <ArrowLeft className="h-4 w-4" /> Family Roots
//           </Link>
//           <Button
//             size="sm"
//             variant="outline"
//             onClick={copyLink}
//             className="border-indigo-400/30 bg-white/5 text-indigo-100 hover:bg-white/10"
//           >
//             {copied ? (
//               <>
//                 <Check className="mr-1.5 h-3.5 w-3.5" /> Copied
//               </>
//             ) : (
//               <>
//                 <Share2 className="mr-1.5 h-3.5 w-3.5" /> Share
//               </>
//             )}
//           </Button>
//         </div>

//         <motion.article
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.45 }}
//           className="rounded-2xl border border-indigo-500/20 bg-white/5 p-6 shadow-2xl shadow-indigo-900/40 backdrop-blur-md md:p-10"
//         >
//           <p className="text-xs font-medium uppercase tracking-widest text-indigo-300/60">
//             Family history report
//           </p>
//           <h1 className="mt-2 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-100 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
//             {report.surname}
//           </h1>

//           <p className="mt-6 text-base leading-relaxed text-indigo-100/90">
//             {report.summary}
//           </p>

//           <div className="mt-8 grid gap-5 sm:grid-cols-2">
//             <Fact label="Origin" value={report.origin} />
//             <Fact label="Meaning" value={report.meaning} />
//             <Fact
//               label="Where it’s common"
//               value={report.geographicDistribution}
//               className="sm:col-span-2"
//             />
//           </div>

//           {report.notableBearers.length > 0 && (
//             <div className="mt-8">
//               <p className="mb-3 text-xs font-medium uppercase tracking-widest text-indigo-300/60">
//                 Notable people
//               </p>
//               <div className="flex flex-wrap gap-2">
//                 {report.notableBearers.map((name) => (
//                   <Badge
//                     key={name}
//                     className="border-purple-400/20 bg-purple-500/15 text-purple-100 hover:bg-purple-500/25"
//                   >
//                     {name}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           )}

//           {report.sources.length > 0 && (
//             <div className="mt-8 border-t border-indigo-500/15 pt-6">
//               <p className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-indigo-300/60">
//                 <ScrollText className="h-3.5 w-3.5" /> Sources
//               </p>
//               <ul className="space-y-2">
//                 {report.sources.map((s) => (
//                   <li key={s.url}>
//                     <a
//                       href={s.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center gap-1.5 text-sm text-indigo-300/70 underline-offset-4 transition hover:text-indigo-200 hover:underline"
//                     >
//                       <ExternalLink className="h-3 w-3 shrink-0" />
//                       {s.title}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </motion.article>

//         <p className="mt-8 text-center text-xs text-indigo-400/50">
//           Generated by Family Roots ·{" "}
//           {new Date(report.createdAt).toLocaleDateString(undefined, {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           })}
//         </p>
//       </div>
//     </div>
//   );
// }

// function Fact({
//   label,
//   value,
//   className,
// }: {
//   label: string;
//   value?: string;
//   className?: string;
// }) {
//   return (
//     <div className={className}>
//       <p className="text-xs font-medium uppercase tracking-widest text-indigo-300/60">
//         {label}
//       </p>
//       <p className="mt-1 text-sm text-indigo-50">
//         {value || "Not found in sources"}
//       </p>
//     </div>
//   );
// }

"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { motion } from "framer-motion";
import {
  ExternalLink,
  ScrollText,
  Share2,
  Check,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PublicReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const report = useQuery(api.surnameSearches.getPublicReport, {
    searchId: id as Id<"surnameSearches">,
  });
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (report === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
      </div>
    );
  }

  if (report === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 px-6 text-center">
        <p className="text-lg text-indigo-100">
          Report not found or still processing.
        </p>
        <Link href="/">
          <Button
            variant="outline"
            className="border-indigo-400/40 text-indigo-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

      <div className="relative mx-auto max-w-2xl px-6 py-12 md:py-20">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-indigo-300/70 transition hover:text-indigo-200"
          >
            <ArrowLeft className="h-4 w-4" /> Family Roots
          </Link>
          <Button
            size="sm"
            variant="outline"
            onClick={copyLink}
            className="border-indigo-400/30 bg-white/5 text-indigo-100 hover:bg-white/10"
          >
            {copied ? (
              <>
                <Check className="mr-1.5 h-3.5 w-3.5" /> Copied
              </>
            ) : (
              <>
                <Share2 className="mr-1.5 h-3.5 w-3.5" /> Share
              </>
            )}
          </Button>
        </div>

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl border border-indigo-500/20 bg-white/5 p-6 shadow-2xl shadow-indigo-900/40 backdrop-blur-md md:p-10"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-indigo-300/60">
            Family history report
          </p>
          <h1 className="mt-2 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-100 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
            {report.surname}
          </h1>

          <p className="mt-6 text-base leading-relaxed text-indigo-100/90">
            {report.summary}
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <Fact label="Origin" value={report.origin} />
            <Fact label="Meaning" value={report.meaning} />
            <Fact
              label="Where it’s common"
              value={report.geographicDistribution}
              className="sm:col-span-2"
            />
          </div>

          {report.notableBearers.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-indigo-300/60">
                Notable people
              </p>
              <div className="flex flex-wrap gap-2">
                {report.notableBearers.map((name) => (
                  <Badge
                    key={name}
                    className="border-purple-400/20 bg-purple-500/15 text-purple-100 hover:bg-purple-500/25"
                  >
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {report.sources.length > 0 && (
            <div className="mt-8 border-t border-indigo-500/15 pt-6">
              <p className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-indigo-300/60">
                <ScrollText className="h-3.5 w-3.5" /> Sources
              </p>
              <ul className="space-y-2">
                {report.sources.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-indigo-300/70 underline-offset-4 transition hover:text-indigo-200 hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 shrink-0" />
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.article>

        <p className="mt-8 text-center text-xs text-indigo-400/50">
          Generated by Family Roots ·{" "}
          {new Date(report.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
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
      className={`rounded-xl border border-indigo-500/15 bg-white/5 px-4 py-3 ${className ?? ""}`}
    >
      <p className="text-xs font-medium uppercase tracking-widest text-indigo-300/60">
        {label}
      </p>
      <p className="mt-1 text-sm text-indigo-50">
        {value || "Not found in sources"}
      </p>
    </div>
  );
}
