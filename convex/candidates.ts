import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    search: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    location: v.optional(v.string()),
    availability: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let candidates = await ctx.db.query("candidates").collect();

    // Filter by search term
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      candidates = candidates.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(searchLower) ||
          candidate.title.toLowerCase().includes(searchLower) ||
          candidate.bio.toLowerCase().includes(searchLower)
      );
    }

    // Filter by skills
    if (args.skills && args.skills.length > 0) {
      candidates = candidates.filter((candidate) =>
        args.skills!.some((skill) =>
          candidate.skills.some((candidateSkill) =>
            candidateSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    // Filter by location
    if (args.location) {
      candidates = candidates.filter((candidate) =>
        candidate.location.toLowerCase().includes(args.location!.toLowerCase())
      );
    }

    // Filter by availability
    if (args.availability) {
      candidates = candidates.filter(
        (candidate) => candidate.availability === args.availability
      );
    }

    return candidates;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    title: v.string(),
    location: v.string(),
    experience: v.number(),
    skills: v.array(v.string()),
    bio: v.string(),
    availability: v.union(v.literal("available"), v.literal("open"), v.literal("not-available")),
    salary_expectation: v.optional(v.number()),
    portfolio_url: v.optional(v.string()),
    linkedin_url: v.optional(v.string()),
    github_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to create a candidate profile");
    }

    return await ctx.db.insert("candidates", {
      ...args,
      created_by: userId,
    });
  },
});

export const get = query({
  args: { id: v.id("candidates") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("candidates"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    title: v.optional(v.string()),
    location: v.optional(v.string()),
    experience: v.optional(v.number()),
    skills: v.optional(v.array(v.string())),
    bio: v.optional(v.string()),
    availability: v.optional(v.union(v.literal("available"), v.literal("open"), v.literal("not-available"))),
    salary_expectation: v.optional(v.number()),
    portfolio_url: v.optional(v.string()),
    linkedin_url: v.optional(v.string()),
    github_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to update a candidate profile");
    }

    const { id, ...updates } = args;
    const candidate = await ctx.db.get(id);
    
    if (!candidate) {
      throw new Error("Candidate not found");
    }

    if (candidate.created_by !== userId) {
      throw new Error("You can only update your own candidate profile");
    }

    return await ctx.db.patch(id, updates);
  },
});
