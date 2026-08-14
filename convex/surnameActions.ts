// // convex/surnameActions.ts
// "use node";
// import { v } from "convex/values";
// import { internalAction } from "./_generated/server";
// import { internal } from "./_generated/api";

// interface TavilyResult {
//   title: string;
//   url: string;
//   content: string;
// }
// interface TavilyResponse {
//   results: TavilyResult[];
// }
// interface SurnameWriteup {
//   origin?: string | null;
//   meaning?: string | null;
//   geographicDistribution?: string | null;
//   notableBearers: string[];
//   summary: string;
// }

// export const research = internalAction({
//   args: { searchId: v.id("surnameSearches"), surname: v.string() },
//   handler: async (ctx, { searchId, surname }) => {
//     try {
//       const tavilyKey = process.env.TAVILY_API_KEY;
//       if (!tavilyKey) {
//         console.error("[surnameActions] TAVILY_API_KEY missing");
//         await ctx.runMutation(internal.surnameMutations.markFailed, {
//           searchId,
//         });
//         return;
//       }

//       const tavilyRes = await fetch("https://api.tavily.com/search", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           api_key: tavilyKey,
//           query: `${surname} surname origin meaning family history notable people`,
//           search_depth: "advanced",
//           max_results: 6,
//           include_answer: false,
//         }),
//       });

//       if (!tavilyRes.ok) {
//         console.error(
//           "[surnameActions] Tavily error",
//           tavilyRes.status,
//           await tavilyRes.text(),
//         );
//         await ctx.runMutation(internal.surnameMutations.markFailed, {
//           searchId,
//         });
//         return;
//       }

//       const { results = [] } = (await tavilyRes.json()) as TavilyResponse;
//       if (results.length === 0) {
//         await ctx.runMutation(internal.surnameMutations.markFailed, {
//           searchId,
//         });
//         return;
//       }

//       const sourcesText = results
//         .map(
//           (r, i) =>
//             `[${i + 1}] ${r.title}\n${r.url}\n${r.content.slice(0, 1500)}`,
//         )
//         .join("\n\n");

//       const openRouterKey = process.env.OPENROUTER_API_KEY;
//       if (!openRouterKey) {
//         console.error("[surnameActions] OPENROUTER_API_KEY missing");
//         await ctx.runMutation(internal.surnameMutations.markFailed, {
//           searchId,
//         });
//         return;
//       }

//       const prompt = `You are a genealogy researcher. Using ONLY the source material below about the surname "${surname}", write a concise, factual writeup.

// SOURCES:
// ${sourcesText}

// Respond with ONLY valid JSON (no markdown fences, no commentary) matching this shape exactly:
// {
//   "origin": string | null,
//   "meaning": string | null,
//   "geographicDistribution": string | null,
//   "notableBearers": string[],
//   "summary": string
// }

// Rules:
// - "summary": 3-5 sentences, plain prose, no inline citations.
// - "notableBearers": up to 6 real historically notable people with this surname found in the sources, else [].
// - If a field isn't supported by the sources, use null — don't guess.
// - Do not fabricate facts not present in the sources.`;

//       const aiRes = await fetch(
//         "https://openrouter.ai/api/v1/chat/completions",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${openRouterKey}`,
//           },
//           body: JSON.stringify({
//             model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
//             messages: [{ role: "user", content: prompt }],
//           }),
//         },
//       );

//       if (!aiRes.ok) {
//         console.error(
//           "[surnameActions] OpenRouter error",
//           aiRes.status,
//           await aiRes.text(),
//         );
//         await ctx.runMutation(internal.surnameMutations.markFailed, {
//           searchId,
//         });
//         return;
//       }

//       const aiData = await aiRes.json();
//       const raw: string = aiData?.choices?.[0]?.message?.content ?? "";
//       const cleaned = raw
//         .trim()
//         .replace(/^```json\s*/i, "")
//         .replace(/```$/, "");

//       let parsed: SurnameWriteup;
//       try {
//         parsed = JSON.parse(cleaned);
//       } catch {
//         console.error("[surnameActions] Failed to parse AI JSON:", raw);
//         await ctx.runMutation(internal.surnameMutations.markFailed, {
//           searchId,
//         });
//         return;
//       }

//       await ctx.runMutation(internal.surnameMutations.saveReport, {
//         searchId,
//         surname,
//         origin: parsed.origin ?? undefined,
//         meaning: parsed.meaning ?? undefined,
//         geographicDistribution: parsed.geographicDistribution ?? undefined,
//         notableBearers: parsed.notableBearers ?? [],
//         summary: parsed.summary ?? "No summary available.",
//         sources: results
//           .slice(0, 6)
//           .map((r) => ({ title: r.title, url: r.url })),
//       });
//     } catch (e) {
//       console.error("[surnameActions] Unhandled error", e);
//       await ctx.runMutation(internal.surnameMutations.markFailed, { searchId });
//     }
//   },
// });
// convex/surnameActions.ts
// convex/surnameActions.ts
"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { normalizeSurname } from "./lib";

interface TavilyResult {
  title: string;
  url: string;
  content: string;
}

interface TavilyResponse {
  results: TavilyResult[];
}

interface SurnameWriteup {
  origin?: string | null;
  meaning?: string | null;
  geographicDistribution?: string | null;
  notableBearers: string[];
  summary: string;
}

export const research = internalAction({
  args: { searchId: v.id("surnameSearches"), surname: v.string() },
  handler: async (ctx, { searchId, surname }) => {
    try {
      // --- Race guard --------------------------------------------------
      // The cache check in surnameSearches.start happens at insert time.
      // If two requests for the same surname land close enough together,
      // both can miss the cache and both schedule this action. Re-check
      // right before spending money: if another in-flight/just-finished
      // search for the same normalized surname already completed, copy
      // its report instead of hitting Tavily + OpenRouter again.
      const normalizedSurname = normalizeSurname(surname);
      const existingCompleted = await ctx.runQuery(
        internal.surnameSearches.findCompletedForNormalizedSurname,
        { normalizedSurname, excludeSearchId: searchId },
      );

      if (existingCompleted) {
        await ctx.runMutation(internal.surnameMutations.copyReport, {
          fromSearchId: existingCompleted._id,
          toSearchId: searchId,
          surname,
        });
        return;
      }

      const tavilyKey = process.env.TAVILY_API_KEY;
      if (!tavilyKey) {
        console.error("[surnameActions] TAVILY_API_KEY missing");
        await ctx.runMutation(internal.surnameMutations.markFailed, {
          searchId,
        });
        return;
      }

      const tavilyRes = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: tavilyKey,
          query: `${surname} surname origin meaning family history notable people`,
          search_depth: "advanced",
          max_results: 6,
          include_answer: false,
        }),
      });

      if (!tavilyRes.ok) {
        console.error(
          "[surnameActions] Tavily error",
          tavilyRes.status,
          await tavilyRes.text(),
        );
        await ctx.runMutation(internal.surnameMutations.markFailed, {
          searchId,
        });
        return;
      }

      const { results = [] } = (await tavilyRes.json()) as TavilyResponse;
      if (results.length === 0) {
        await ctx.runMutation(internal.surnameMutations.markFailed, {
          searchId,
        });
        return;
      }

      const sourcesText = results
        .map(
          (r, i) =>
            `[${i + 1}] ${r.title}\n${r.url}\n${r.content.slice(0, 1500)}`,
        )
        .join("\n\n");

      const openRouterKey = process.env.OPENROUTER_API_KEY;
      if (!openRouterKey) {
        console.error("[surnameActions] OPENROUTER_API_KEY missing");
        await ctx.runMutation(internal.surnameMutations.markFailed, {
          searchId,
        });
        return;
      }

      const prompt = `You are a genealogy researcher. Using ONLY the source material below about the surname "${surname}", write a concise, factual writeup.

SOURCES:
${sourcesText}

Respond with ONLY valid JSON (no markdown fences, no commentary) matching this shape exactly:
{
  "origin": string | null,
  "meaning": string | null,
  "geographicDistribution": string | null,
  "notableBearers": string[],
  "summary": string
}

Rules:
- "summary": 3-5 sentences, plain prose, no inline citations.
- "notableBearers": up to 6 real historically notable people with this surname found in the sources, else [].
- If a field isn't supported by the sources, use null --- don't guess.
- Do not fabricate facts not present in the sources.`;

      const aiRes = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openRouterKey}`,
          },
          body: JSON.stringify({
            model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
            messages: [{ role: "user", content: prompt }],
          }),
        },
      );

      if (!aiRes.ok) {
        console.error(
          "[surnameActions] OpenRouter error",
          aiRes.status,
          await aiRes.text(),
        );
        await ctx.runMutation(internal.surnameMutations.markFailed, {
          searchId,
        });
        return;
      }

      const aiData = await aiRes.json();
      const raw: string = aiData?.choices?.[0]?.message?.content ?? "";
      const cleaned = raw
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/```$/, "");

      let parsed: SurnameWriteup;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        console.error("[surnameActions] Failed to parse AI JSON:", raw);
        await ctx.runMutation(internal.surnameMutations.markFailed, {
          searchId,
        });
        return;
      }

      await ctx.runMutation(internal.surnameMutations.saveReport, {
        searchId,
        surname,
        origin: parsed.origin ?? undefined,
        meaning: parsed.meaning ?? undefined,
        geographicDistribution: parsed.geographicDistribution ?? undefined,
        notableBearers: parsed.notableBearers ?? [],
        summary: parsed.summary ?? "No summary available.",
        sources: results
          .slice(0, 6)
          .map((r) => ({ title: r.title, url: r.url })),
      });
    } catch (e) {
      console.error("[surnameActions] Unhandled error", e);
      await ctx.runMutation(internal.surnameMutations.markFailed, { searchId });
    }
  },
});
