import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  candidates: defineTable({
    name: v.string(),
    email: v.string(),
    title: v.string(),
    location: v.string(),
    experience: v.number(), // years of experience
    skills: v.array(v.string()),
    bio: v.string(),
    availability: v.union(v.literal("available"), v.literal("open"), v.literal("not-available")),
    salary_expectation: v.optional(v.number()),
    portfolio_url: v.optional(v.string()),
    linkedin_url: v.optional(v.string()),
    github_url: v.optional(v.string()),
    created_by: v.id("users"),
  })
    .index("by_skills", ["skills"])
    .index("by_location", ["location"])
    .index("by_availability", ["availability"])
    .index("by_created_by", ["created_by"]),

  jobs: defineTable({
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
    posted_by: v.id("users"),
    status: v.union(v.literal("open"), v.literal("closed"), v.literal("draft")),
  })
    .index("by_company", ["company"])
    .index("by_location", ["location"])
    .index("by_type", ["type"])
    .index("by_status", ["status"])
    .index("by_posted_by", ["posted_by"]),

  matches: defineTable({
    candidate_id: v.id("candidates"),
    job_id: v.id("jobs"),
    match_score: v.number(), // 0-100
    skill_matches: v.array(v.string()),
    status: v.union(v.literal("pending"), v.literal("interested"), v.literal("not-interested"), v.literal("contacted")),
    created_by: v.id("users"),
  })
    .index("by_candidate", ["candidate_id"])
    .index("by_job", ["job_id"])
    .index("by_score", ["match_score"])
    .index("by_status", ["status"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
