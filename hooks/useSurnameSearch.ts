// hooks/useSurnameSearch.ts
"use client";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export function useSurnameSearch() {
  const start = useMutation(api.surnameSearches.start);
  const history = useQuery(api.surnameSearches.getMine);
  return { start, history };
}

export function useSurnameReport(searchId: Id<"surnameSearches"> | undefined) {
  return useQuery(
    api.surnameSearches.getReport,
    searchId ? { searchId } : "skip",
  );
}

// hooks/useSurnameSearch.ts — add this export
export function useSurnameHistory() {
  return useQuery(api.surnameSearches.getAll);
}

// hooks/useSurnameSearch.ts — add this export
export function useDeleteSurnameSearch() {
  return useMutation(api.surnameSearches.remove);
}
