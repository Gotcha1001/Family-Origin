// "use client";

// import { Suspense, useMemo, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { Search } from "lucide-react";

// import { useSurnameSearch, useSurnameReport } from "@/hooks/useSurnameSearch";
// import type { Id } from "@/convex/_generated/dataModel";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   ReportCard,
//   FailedCard,
//   StatusIcon,
// } from "@/app/components/ReportCard";
// import { SearchingModal } from "@/app/components/SearchingModal";

// export default function SurnameSearchPage() {
//   return (
//     <Suspense fallback={null}>
//       <SurnameSearchPageInner />
//     </Suspense>
//   );
// }

// function SurnameSearchPageInner() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const idParam = searchParams.get("id");

//   const [surname, setSurname] = useState("");
//   const [activeId, setActiveId] = useState<Id<"surnameSearches"> | undefined>(
//     (idParam as Id<"surnameSearches"> | null) ?? undefined,
//   );
//   const [submitting, setSubmitting] = useState(false);

//   const { start, history } = useSurnameSearch();
//   const report = useSurnameReport(activeId);

//   const activeSearch = useMemo(
//     () => history?.find((h) => h._id === activeId),
//     [history, activeId],
//   );

//   const isPending = activeSearch?.status === "pending";
//   const isFailed = activeSearch?.status === "failed";

//   function selectSearch(id: Id<"surnameSearches">) {
//     setActiveId(id);
//     router.replace(`/dashboard/search?id=${id}`, { scroll: false });
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     const trimmed = surname.trim();
//     if (!trimmed || submitting) return;

//     setSubmitting(true);
//     try {
//       const id = await start({ surname: trimmed });
//       selectSearch(id);
//       setSurname("");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-6 md:p-10">
//       <div className="flex flex-col gap-2">
//         <h1 className="text-2xl font-semibold tracking-tight">
//           Trace a surname
//         </h1>
//         <p className="text-muted-foreground text-sm">
//           Enter a family name to pull together its origin, meaning, and notable
//           history from public sources.
//         </p>
//       </div>

//       <form onSubmit={handleSubmit} className="flex gap-3">
//         <div className="relative flex-1">
//           <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
//           <Input
//             value={surname}
//             onChange={(e) => setSurname(e.target.value)}
//             placeholder="e.g. Kavanagh, Nakamura, Okafor..."
//             className="pl-9"
//             disabled={submitting}
//           />
//         </div>
//         <Button type="submit" disabled={submitting || !surname.trim()}>
//           {submitting ? "Starting..." : "Search"}
//         </Button>
//       </form>

//       {/* Fancy searching modal while pending */}
//       <SearchingModal open={!!isPending} surname={activeSearch?.surname} />

//       <AnimatePresence mode="wait">
//         {activeId && !isPending && (
//           <motion.div
//             key={activeId}
//             initial={{ opacity: 0, y: 8 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -8 }}
//             transition={{ duration: 0.25, ease: "easeOut" }}
//           >
//             {isFailed && <FailedCard surname={activeSearch?.surname} />}
//             {report && (
//               <ReportCard
//                 surname={activeSearch?.surname ?? report.surname}
//                 origin={report.origin}
//                 meaning={report.meaning}
//                 geographicDistribution={report.geographicDistribution}
//                 notableBearers={report.notableBearers ?? []}
//                 summary={report.summary}
//                 sources={report.sources}
//                 searchId={activeId}
//               />
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {history && history.length > 0 && (
//         <div className="flex flex-col gap-3">
//           <h2 className="text-muted-foreground text-sm font-medium">
//             Recent searches
//           </h2>
//           <div className="flex flex-wrap gap-2">
//             {history.map((h) => (
//               <button
//                 key={h._id}
//                 onClick={() => selectSearch(h._id)}
//                 className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
//                   h._id === activeId
//                     ? "border-foreground bg-foreground text-background"
//                     : "border-border hover:bg-muted"
//                 }`}
//               >
//                 <StatusIcon status={h.status} />
//                 {h.surname}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

import { useSurnameSearch, useSurnameReport } from "@/hooks/useSurnameSearch";
import type { Id } from "@/convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ReportCard,
  FailedCard,
  StatusIcon,
} from "@/app/components/ReportCard";
import { SearchingModal } from "@/app/components/SearchingModal";

export default function SurnameSearchPage() {
  return (
    <Suspense fallback={null}>
      <SurnameSearchPageInner />
    </Suspense>
  );
}

function SurnameSearchPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");

  const [surname, setSurname] = useState("");
  const [activeId, setActiveId] = useState<Id<"surnameSearches"> | undefined>(
    (idParam as Id<"surnameSearches"> | null) ?? undefined,
  );
  const [submitting, setSubmitting] = useState(false);

  const { start, history } = useSurnameSearch();
  const report = useSurnameReport(activeId);

  const activeSearch = useMemo(
    () => history?.find((h) => h._id === activeId),
    [history, activeId],
  );

  const isPending = activeSearch?.status === "pending";
  const isFailed = activeSearch?.status === "failed";

  function selectSearch(id: Id<"surnameSearches">) {
    setActiveId(id);
    router.replace(`/dashboard/search?id=${id}`, { scroll: false });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = surname.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    try {
      const id = await start({ surname: trimmed });
      selectSearch(id);
      setSurname("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-6 md:p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
          Trace a surname
        </h1>
        <p className="text-sm text-white/80 [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
          Enter a family name to pull together its origin, meaning, and notable
          history from public sources.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
          <Input
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            placeholder="e.g. Kavanagh, Nakamura, Okafor..."
            className="border-white/30 bg-black/30 pl-9 text-white placeholder:text-white/60 backdrop-blur-sm focus-visible:ring-white/40"
            disabled={submitting}
          />
        </div>
        <Button
          type="submit"
          disabled={submitting || !surname.trim()}
          className="bg-black text-white hover:bg-black/90"
        >
          {submitting ? "Starting..." : "Search"}
        </Button>
      </form>

      {/* Fancy searching modal while pending */}
      <SearchingModal open={!!isPending} surname={activeSearch?.surname} />

      <AnimatePresence mode="wait">
        {activeId && !isPending && (
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {isFailed && <FailedCard surname={activeSearch?.surname} />}
            {report && (
              <ReportCard
                surname={activeSearch?.surname ?? report.surname}
                origin={report.origin}
                meaning={report.meaning}
                geographicDistribution={report.geographicDistribution}
                notableBearers={report.notableBearers ?? []}
                summary={report.summary}
                sources={report.sources}
                searchId={activeId}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {history && history.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-white/90">Recent searches</h2>
          <div className="flex flex-wrap gap-2">
            {history.map((h) => (
              <button
                key={h._id}
                onClick={() => selectSearch(h._id)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm text-white backdrop-blur-sm transition-colors ${
                  h._id === activeId
                    ? "border-white bg-black text-white"
                    : "border-white/30 bg-black/30 hover:bg-black hover:text-white"
                }`}
              >
                <StatusIcon status={h.status} />
                {h.surname}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
