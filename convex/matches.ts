import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const findMatches = query({
  args: {
    candidate_id: v.optional(v.id("candidates")),
    job_id: v.optional(v.id("jobs")),
  },
  handler: async (ctx, args) => {
    if (args.candidate_id) {
      // Find jobs that match this candidate
      const candidate = await ctx.db.get(args.candidate_id);
      if (!candidate) return [];

      const jobs = await ctx.db.query("jobs").withIndex("by_status", (q) => q.eq("status", "open")).collect();
      
      return jobs.map((job) => {
        const skillMatches = candidate.skills.filter((skill) =>
          [...job.required_skills, ...job.preferred_skills].some((jobSkill) =>
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        
        const requiredSkillMatches = candidate.skills.filter((skill) =>
          job.required_skills.some((jobSkill) =>
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );

        // Calculate match score based on skill overlap and other factors
        const skillScore = (skillMatches.length / Math.max(job.required_skills.length, 1)) * 60;
        const requiredSkillScore = (requiredSkillMatches.length / Math.max(job.required_skills.length, 1)) * 40;
        const match_score = Math.min(100, skillScore + requiredSkillScore);

        return {
          job,
          candidate,
          match_score: Math.round(match_score),
          skill_matches: skillMatches,
        };
      }).filter((match) => match.match_score > 20).sort((a, b) => b.match_score - a.match_score);
    }

    if (args.job_id) {
      // Find candidates that match this job
      const job = await ctx.db.get(args.job_id);
      if (!job) return [];

      const candidates = await ctx.db.query("candidates").collect();
      
      return candidates.map((candidate) => {
        const skillMatches = candidate.skills.filter((skill) =>
          [...job.required_skills, ...job.preferred_skills].some((jobSkill) =>
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        
        const requiredSkillMatches = candidate.skills.filter((skill) =>
          job.required_skills.some((jobSkill) =>
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );

        // Calculate match score
        const skillScore = (skillMatches.length / Math.max(job.required_skills.length, 1)) * 60;
        const requiredSkillScore = (requiredSkillMatches.length / Math.max(job.required_skills.length, 1)) * 40;
        const match_score = Math.min(100, skillScore + requiredSkillScore);

        return {
          job,
          candidate,
          match_score: Math.round(match_score),
          skill_matches: skillMatches,
        };
      }).filter((match) => match.match_score > 20).sort((a, b) => b.match_score - a.match_score);
    }

    return [];
  },
});

export const create = mutation({
  args: {
    candidate_id: v.id("candidates"),
    job_id: v.id("jobs"),
    match_score: v.number(),
    skill_matches: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to create a match");
    }

    return await ctx.db.insert("matches", {
      ...args,
      status: "pending",
      created_by: userId,
    });
  },
});
