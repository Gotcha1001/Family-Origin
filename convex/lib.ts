// convex/lib.ts --- small shared helpers, no queries/mutations/actions here.
// Pure/isomorphic code only (safe to import from both node and non-node
// Convex files) so this file intentionally has no "use node" directive.

import type { QueryCtx, MutationCtx } from "./_generated/server";

// How long a completed report stays eligible for cache reuse before we
// consider it stale and re-scrape. Mostly a cost lever -- raise it if
// Tavily/OpenRouter spend is the bigger concern, lower it if freshness
// matters more.
export const SEARCH_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function normalizeSurname(surname: string): string {
  return surname.trim().toLowerCase();
}

// Shared identity -> users-table lookup. Returns null if signed out or if
// the Clerk identity has no matching row yet (rather than throwing), so
// queries can early-return [] and mutations can decide how strict to be.
export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();
}
