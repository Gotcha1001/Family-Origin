// import { v } from "convex/values";
// import { internalMutation } from "./_generated/server";

// export const saveReport = internalMutation({
//   args: {
//     searchId: v.id("surnameSearches"),
//     surname: v.string(),
//     origin: v.optional(v.string()),
//     meaning: v.optional(v.string()),
//     geographicDistribution: v.optional(v.string()),
//     notableBearers: v.array(v.string()),
//     summary: v.string(),
//     sources: v.array(v.object({ title: v.string(), url: v.string() })),
//   },
//   handler: async (ctx, args) => {
//     await ctx.db.insert("surnameReports", { ...args, createdAt: Date.now() });
//     await ctx.db.patch(args.searchId, { status: "complete" });
//   },
// });

// export const markFailed = internalMutation({
//   args: { searchId: v.id("surnameSearches") },
//   handler: async (ctx, { searchId }) => {
//     await ctx.db.patch(searchId, { status: "failed" });
//   },
// });

import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const saveReport = internalMutation({
  args: {
    searchId: v.id("surnameSearches"),
    surname: v.string(),
    origin: v.optional(v.string()),
    meaning: v.optional(v.string()),
    geographicDistribution: v.optional(v.string()),
    notableBearers: v.array(v.string()),
    summary: v.string(),
    sources: v.array(v.object({ title: v.string(), url: v.string() })),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("surnameReports", { ...args, createdAt: Date.now() });
    await ctx.db.patch(args.searchId, { status: "complete" });
  },
});

export const markFailed = internalMutation({
  args: { searchId: v.id("surnameSearches") },
  handler: async (ctx, { searchId }) => {
    await ctx.db.patch(searchId, { status: "failed" });
  },
});

// Used by surnameActions.research's race-guard: copies an already-completed
// report onto a different searchId instead of re-running Tavily + OpenRouter.
export const copyReport = internalMutation({
  args: {
    fromSearchId: v.id("surnameSearches"),
    toSearchId: v.id("surnameSearches"),
    surname: v.string(),
  },
  handler: async (ctx, { fromSearchId, toSearchId, surname }) => {
    const sourceReport = await ctx.db
      .query("surnameReports")
      .withIndex("by_search", (q) => q.eq("searchId", fromSearchId))
      .first();

    if (!sourceReport) {
      await ctx.db.patch(toSearchId, { status: "failed" });
      return;
    }

    await ctx.db.insert("surnameReports", {
      searchId: toSearchId,
      surname,
      origin: sourceReport.origin,
      meaning: sourceReport.meaning,
      geographicDistribution: sourceReport.geographicDistribution,
      notableBearers: sourceReport.notableBearers,
      summary: sourceReport.summary,
      sources: sourceReport.sources,
      createdAt: Date.now(),
    });
    await ctx.db.patch(toSearchId, { status: "complete" });
  },
});
