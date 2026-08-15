// "use client";
// import { useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Search, Trash2 } from "lucide-react";
// import {
//   useSurnameHistory,
//   useDeleteSurnameSearch,
// } from "@/hooks/useSurnameSearch";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { StatusIcon } from "@/app/components/ReportCard";
// import { toast } from "sonner"; // swap for your toast lib if different
// import { Id } from "@/convex/_generated/dataModel";

// type StatusFilter = "all" | "pending" | "complete" | "failed";

// const TABS: { value: StatusFilter; label: string }[] = [
//   { value: "all", label: "All" },
//   { value: "complete", label: "Complete" },
//   { value: "pending", label: "Pending" },
//   { value: "failed", label: "Failed" },
// ];

// export default function HistoryPage() {
//   const router = useRouter();
//   const history = useSurnameHistory();
//   const deleteSearch = useDeleteSurnameSearch();
//   const [query, setQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
//   const [deletingId, setDeletingId] = useState<Id<"surnameSearches"> | null>(
//     null,
//   );

//   const filtered = useMemo(() => {
//     if (!history) return [];
//     return history.filter((h) => {
//       const matchesQuery = h.surname
//         .toLowerCase()
//         .includes(query.trim().toLowerCase());
//       const matchesStatus = statusFilter === "all" || h.status === statusFilter;
//       return matchesQuery && matchesStatus;
//     });
//   }, [history, query, statusFilter]);

//   const isLoading = history === undefined;

//   const handleDelete = async (id: Id<"surnameSearches">) => {
//     setDeletingId(id);
//     try {
//       await deleteSearch({ searchId: id });
//     } catch (err) {
//       toast.error("Couldn't delete that search. Try again.");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   return (
//     <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-6 md:p-10">
//       <div className="flex flex-col gap-2">
//         <h1 className="text-2xl font-semibold tracking-tight">My searches</h1>
//         <p className="text-muted-foreground text-sm">
//           Every surname you&apos;ve looked up, in one place.
//         </p>
//       </div>

//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="relative flex-1 sm:max-w-xs">
//           <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
//           <Input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Filter by surname..."
//             className="pl-9"
//           />
//         </div>
//         <div className="flex gap-1.5">
//           {TABS.map((tab) => (
//             <Button
//               key={tab.value}
//               size="sm"
//               variant={statusFilter === tab.value ? "default" : "outline"}
//               onClick={() => setStatusFilter(tab.value)}
//             >
//               {tab.label}
//             </Button>
//           ))}
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="text-muted-foreground text-sm">Loading...</div>
//       ) : filtered.length === 0 ? (
//         <Card>
//           <CardContent className="text-muted-foreground pt-6 text-center text-sm">
//             {history && history.length === 0
//               ? "No searches yet — try a family name from the dashboard to get your first report."
//               : "No searches match that filter."}
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="flex flex-col gap-2">
//           {filtered.map((h) => (
//             <div
//               key={h._id}
//               className="hover:bg-muted flex items-center justify-between rounded-lg border px-4 py-3 text-sm transition-colors"
//             >
//               <button
//                 onClick={() => router.push(`/dashboard/search?id=${h._id}`)}
//                 className="flex flex-1 items-center gap-2 text-left font-medium"
//               >
//                 <StatusIcon status={h.status} />
//                 {h.surname}
//               </button>
//               <div className="flex items-center gap-3">
//                 <span className="text-muted-foreground text-xs">
//                   {new Date(h.createdAt).toLocaleDateString(undefined, {
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                   })}
//                 </span>
//                 <Button
//                   size="icon"
//                   variant="ghost"
//                   className="text-muted-foreground h-8 w-8 hover:text-red-600"
//                   disabled={deletingId === h._id}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDelete(h._id);
//                   }}
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Trash2 } from "lucide-react";
import {
  useSurnameHistory,
  useDeleteSurnameSearch,
} from "@/hooks/useSurnameSearch";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusIcon } from "@/app/components/ReportCard";
import { toast } from "sonner"; // swap for your toast lib if different
import { Id } from "@/convex/_generated/dataModel";

type StatusFilter = "all" | "pending" | "complete" | "failed";

const TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "complete", label: "Complete" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

export default function HistoryPage() {
  const router = useRouter();
  const history = useSurnameHistory();
  const deleteSearch = useDeleteSurnameSearch();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [deletingId, setDeletingId] = useState<Id<"surnameSearches"> | null>(
    null,
  );

  const filtered = useMemo(() => {
    if (!history) return [];
    return history.filter((h) => {
      const matchesQuery = h.surname
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      const matchesStatus = statusFilter === "all" || h.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [history, query, statusFilter]);

  const isLoading = history === undefined;

  const handleDelete = async (id: Id<"surnameSearches">) => {
    setDeletingId(id);
    try {
      await deleteSearch({ searchId: id });
    } catch (err) {
      toast.error("Couldn't delete that search. Try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-6 md:p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
          My searches
        </h1>
        <p className="text-sm text-white/80 [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
          Every surname you&apos;ve looked up, in one place.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by surname..."
            className="border-white/30 bg-black/30 pl-9 text-white placeholder:text-white/60 backdrop-blur-sm focus-visible:ring-white/40"
          />
        </div>
        <div className="flex gap-1.5">
          {TABS.map((tab) => (
            <Button
              key={tab.value}
              size="sm"
              onClick={() => setStatusFilter(tab.value)}
              className={
                statusFilter === tab.value
                  ? "bg-black text-white hover:bg-black/90"
                  : "border border-white/30 bg-black/30 text-white backdrop-blur-sm hover:bg-black hover:text-white"
              }
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-sm text-white/80">Loading...</div>
      ) : filtered.length === 0 ? (
        <Card className="border-white/30 bg-black/30 backdrop-blur-sm">
          <CardContent className="pt-6 text-center text-sm text-white/80">
            {history && history.length === 0
              ? "No searches yet — try a family name from the dashboard to get your first report."
              : "No searches match that filter."}
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((h) => (
            <div
              key={h._id}
              className="group flex items-center justify-between rounded-lg border border-white/30 bg-black/30 px-4 py-3 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black hover:text-white"
            >
              <button
                onClick={() => router.push(`/dashboard/search?id=${h._id}`)}
                className="flex flex-1 items-center gap-2 text-left font-medium text-white"
              >
                <StatusIcon status={h.status} />
                {h.surname}
              </button>
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/70 group-hover:text-white/90">
                  {new Date(h.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white/80 hover:bg-white/10 hover:text-white"
                  disabled={deletingId === h._id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(h._id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
