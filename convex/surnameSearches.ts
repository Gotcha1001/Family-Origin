import { v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { getCurrentUser, normalizeSurname, SEARCH_CACHE_TTL_MS } from "./lib";

export const start = mutation({
  args: { surname: v.string() },
  returns: v.id("surnameSearches"),
  handler: async (ctx, { surname }) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const trimmedSurname = surname.trim();
    const normalizedSurname = normalizeSurname(trimmedSurname);

    // --- Cache check -----------------------------------------------------
    // Reuse the most recent completed report for this surname instead of
    // paying for a fresh Tavily search + OpenRouter call. This is the
    // single biggest cost lever on this feature since both calls are
    // per-request and surname content barely changes.
    const cachedSearch = await ctx.db
      .query("surnameSearches")
      .withIndex("by_normalized_surname", (q) =>
        q.eq("normalizedSurname", normalizedSurname),
      )
      .filter((q) => q.eq(q.field("status"), "complete"))
      .order("desc")
      .first();

    if (
      cachedSearch &&
      Date.now() - cachedSearch.createdAt < SEARCH_CACHE_TTL_MS
    ) {
      const cachedReport = await ctx.db
        .query("surnameReports")
        .withIndex("by_search", (q) => q.eq("searchId", cachedSearch._id))
        .first();

      if (cachedReport) {
        // New history row for *this* user/search, but no external calls --
        // just a copy of the cached report attached to the new searchId.
        const searchId = await ctx.db.insert("surnameSearches", {
          userId: user._id,
          surname: trimmedSurname,
          normalizedSurname,
          status: "complete",
          createdAt: Date.now(),
        });

        await ctx.db.insert("surnameReports", {
          searchId,
          surname: trimmedSurname,
          origin: cachedReport.origin,
          meaning: cachedReport.meaning,
          geographicDistribution: cachedReport.geographicDistribution,
          notableBearers: cachedReport.notableBearers,
          summary: cachedReport.summary,
          sources: cachedReport.sources,
          createdAt: Date.now(),
        });

        return searchId;
      }
    }

    // --- No usable cache entry: run the real pipeline ---------------------
    const searchId = await ctx.db.insert("surnameSearches", {
      userId: user._id,
      surname: trimmedSurname,
      normalizedSurname,
      status: "pending",
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, internal.surnameActions.research, {
      searchId,
      surname: trimmedSurname,
    });

    return searchId;
  },
});

export const getMine = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("surnameSearches"),
      _creationTime: v.float64(),
      surname: v.string(),
      normalizedSurname: v.string(),
      status: v.union(
        v.literal("pending"),
        v.literal("complete"),
        v.literal("failed"),
      ),
      createdAt: v.float64(),
    }),
  ),

  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user) return [];

    const searches = await ctx.db
      .query("surnameSearches")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(20);

    return searches.map((search) => ({
      _id: search._id,
      _creationTime: search._creationTime,
      surname: search.surname,
      normalizedSurname: search.normalizedSurname,
      status: search.status,
      createdAt: search.createdAt,
    }));
  },
});

export const getReport = query({
  args: { searchId: v.id("surnameSearches") },
  handler: async (ctx, { searchId }) => {
    return await ctx.db
      .query("surnameReports")
      .withIndex("by_search", (q) => q.eq("searchId", searchId))
      .first();
  },
});

// convex/surnameSearches.ts --- add this export alongside start/getMine/getReport
export const getAll = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("surnameSearches"),
      _creationTime: v.float64(),
      surname: v.string(),
      normalizedSurname: v.string(),
      status: v.union(
        v.literal("pending"),
        v.literal("complete"),
        v.literal("failed"),
      ),
      createdAt: v.float64(),
    }),
  ),

  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user) return [];

    const searches = await ctx.db
      .query("surnameSearches")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(200);

    return searches.map((search) => ({
      _id: search._id,
      _creationTime: search._creationTime,
      surname: search.surname,
      normalizedSurname: search.normalizedSurname,
      status: search.status,
      createdAt: search.createdAt,
    }));
  },
});

// Internal-only helper used by surnameActions.research as a race guard:
// if another request for the same normalized surname completed while this
// one was queued, reuse it instead of hitting Tavily + OpenRouter again.
export const findCompletedForNormalizedSurname = internalQuery({
  args: {
    normalizedSurname: v.string(),
    excludeSearchId: v.id("surnameSearches"),
  },
  handler: async (ctx, { normalizedSurname, excludeSearchId }) => {
    const candidate = await ctx.db
      .query("surnameSearches")
      .withIndex("by_normalized_surname", (q) =>
        q.eq("normalizedSurname", normalizedSurname),
      )
      .filter((q) => q.eq(q.field("status"), "complete"))
      .order("desc")
      .first();

    if (!candidate || candidate._id === excludeSearchId) return null;
    return candidate;
  },
});
export const getPublicReport = query({
  args: { searchId: v.id("surnameSearches") },
  handler: async (ctx, { searchId }) => {
    const search = await ctx.db.get(searchId);
    if (!search || search.status !== "complete") return null;

    const report = await ctx.db
      .query("surnameReports")
      .withIndex("by_search", (q) => q.eq("searchId", searchId))
      .first();

    if (!report) return null;

    return {
      surname: report.surname,
      origin: report.origin,
      meaning: report.meaning,
      geographicDistribution: report.geographicDistribution,
      notableBearers: report.notableBearers ?? [],
      summary: report.summary,
      sources: report.sources,
      createdAt: report.createdAt,
    };
  },
});
