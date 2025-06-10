import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function MatchingDashboard() {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  
  const candidates = useQuery(api.candidates.list, {}) || [];
  const jobs = useQuery(api.jobs.list, {}) || [];
  
  const candidateMatches = useQuery(
    api.matches.findMatches,
    selectedCandidateId ? { candidate_id: selectedCandidateId as any } : "skip"
  ) || [];
  
  const jobMatches = useQuery(
    api.matches.findMatches,
    selectedJobId ? { job_id: selectedJobId as any } : "skip"
  ) || [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Matching Dashboard</h2>
        <p className="text-gray-600">Find the perfect matches between candidates and job opportunities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Candidates</p>
              <p className="text-3xl font-bold">{candidates.length}</p>
            </div>
            <div className="text-4xl opacity-80">👥</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Open Jobs</p>
              <p className="text-3xl font-bold">{jobs.length}</p>
            </div>
            <div className="text-4xl opacity-80">💼</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Potential Matches</p>
              <p className="text-3xl font-bold">{candidateMatches.length + jobMatches.length}</p>
            </div>
            <div className="text-4xl opacity-80">🎯</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Find Matches for Candidate */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Find Jobs for Candidate</h3>
          <select
            value={selectedCandidateId || ""}
            onChange={(e) => setSelectedCandidateId(e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a candidate...</option>
            {candidates.map((candidate) => (
              <option key={candidate._id} value={candidate._id}>
                {candidate.name} - {candidate.title}
              </option>
            ))}
          </select>
          
          {candidateMatches.length > 0 && (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {candidateMatches.map((match, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{match.job.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        match.match_score >= 80 ? "bg-green-100 text-green-800" :
                        match.match_score >= 60 ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {match.match_score}% match
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{match.job.company} • {match.job.location}</p>
                  <div className="flex flex-wrap gap-1">
                    {match.skill_matches.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Find Matches for Job */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Find Candidates for Job</h3>
          <select
            value={selectedJobId || ""}
            onChange={(e) => setSelectedJobId(e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a job...</option>
            {jobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title} at {job.company}
              </option>
            ))}
          </select>
          
          {jobMatches.length > 0 && (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {jobMatches.map((match, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{match.candidate.name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        match.match_score >= 80 ? "bg-green-100 text-green-800" :
                        match.match_score >= 60 ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {match.match_score}% match
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{match.candidate.title} • {match.candidate.location}</p>
                  <div className="flex flex-wrap gap-1">
                    {match.skill_matches.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
