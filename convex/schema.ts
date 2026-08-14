// import { defineSchema, defineTable } from "convex/server";
// import { v } from "convex/values";

// export default defineSchema({
//   users: defineTable({
//     clerkId: v.string(),
//     email: v.string(),
//     name: v.string(),
//     imageUrl: v.optional(v.string()),
//     role: v.union(v.literal("admin"), v.literal("user")),
//     createdAt: v.number(),
//   }).index("by_clerk_id", ["clerkId"]),

//   surnameSearches: defineTable({
//     userId: v.id("users"),
//     surname: v.string(),
//     status: v.union(
//       v.literal("pending"),
//       v.literal("complete"),
//       v.literal("failed"),
//     ),
//     createdAt: v.number(),
//   })
//     .index("by_user", ["userId"])
//     .index("by_surname", ["surname"]),

//   // NEW: the generated report + raw sources for a search
//   surnameReports: defineTable({
//     searchId: v.id("surnameSearches"),
//     surname: v.string(),
//     origin: v.optional(v.string()),
//     meaning: v.optional(v.string()),
//     geographicDistribution: v.optional(v.string()),
//     notableBearers: v.optional(v.array(v.string())),
//     summary: v.string(),
//     sources: v.array(
//       v.object({
//         title: v.string(),
//         url: v.string(),
//       }),
//     ),
//     createdAt: v.number(),
//   }).index("by_search", ["searchId"]),
// });

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("user")),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  surnameSearches: defineTable({
    userId: v.id("users"),
    surname: v.string(),
    // Lowercased/trimmed copy of `surname`, used purely for cache lookups
    // so "Smith", "smith ", and "SMITH" all share one cached report.
    normalizedSurname: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("complete"),
      v.literal("failed"),
    ),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_surname", ["surname"])
    // Powers the caching lookup in surnameSearches.start and the
    // race-guard re-check in surnameActions.research.
    .index("by_normalized_surname", ["normalizedSurname"]),

  // The generated report + raw sources for a search
  surnameReports: defineTable({
    searchId: v.id("surnameSearches"),
    surname: v.string(),
    origin: v.optional(v.string()),
    meaning: v.optional(v.string()),
    geographicDistribution: v.optional(v.string()),
    notableBearers: v.optional(v.array(v.string())),
    summary: v.string(),
    sources: v.array(
      v.object({
        title: v.string(),
        url: v.string(),
      }),
    ),
    createdAt: v.number(),
  }).index("by_search", ["searchId"]),
});
