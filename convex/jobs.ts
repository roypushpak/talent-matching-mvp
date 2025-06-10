import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    search: v.optional(v.string()),
    location: v.optional(v.string()),
    type: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    let jobs = await ctx.db
      .query("jobs")
      .withIndex("by_status", (q) => q.eq("status", "open"))
      .collect();

    // Filter by search term
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by location
    if (args.location) {
      jobs = jobs.filter((job) =>
        job.location.toLowerCase().includes(args.location!.toLowerCase())
      );
    }

    // Filter by type
    if (args.type) {
      jobs = jobs.filter((job) => job.type === args.type);
    }

    // Filter by skills
    if (args.skills && args.skills.length > 0) {
      jobs = jobs.filter((job) =>
        args.skills!.some((skill) =>
          [...job.required_skills, ...job.preferred_skills].some((jobSkill) =>
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    return jobs;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    company: v.string(),
    location: v.string(),
    type: v.union(v.literal("full-time"), v.literal("part-time"), v.literal("contract"), v.literal("remote")),
    description: v.string(),
    required_skills: v.array(v.string()),
    preferred_skills: v.array(v.string()),
    experience_level: v.union(v.literal("entry"), v.literal("mid"), v.literal("senior"), v.literal("lead")),
    salary_range: v.object({
      min: v.number(),
      max: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to create a job posting");
    }

    return await ctx.db.insert("jobs", {
      ...args,
      posted_by: userId,
      status: "open",
    });
  },
});

export const get = query({
  args: { id: v.id("jobs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
