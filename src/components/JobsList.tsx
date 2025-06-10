import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function JobsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const jobs = useQuery(api.jobs.list, {
    search: searchTerm || undefined,
    location: locationFilter || undefined,
    type: typeFilter || undefined,
    skills: selectedSkills.length > 0 ? selectedSkills : undefined,
  }) || [];

  const allSkills = Array.from(
    new Set(jobs.flatMap(job => [...job.required_skills, ...job.preferred_skills]))
  ).sort();

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time": return "bg-green-100 text-green-800";
      case "part-time": return "bg-blue-100 text-blue-800";
      case "contract": return "bg-purple-100 text-purple-800";
      case "remote": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getExperienceColor = (level: string) => {
    switch (level) {
      case "entry": return "bg-green-100 text-green-800";
      case "mid": return "bg-blue-100 text-blue-800";
      case "senior": return "bg-purple-100 text-purple-800";
      case "lead": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Opportunities</h2>
        <p className="text-gray-600">Discover amazing career opportunities</p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input
            type="text"
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All job types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="remote">Remote</option>
          </select>
        </div>

        {/* Skills Filter */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Filter by skills:</p>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {allSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedSkills.includes(skill)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {jobs.map((job) => (
          <div key={job._id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                <p className="text-lg text-blue-600 font-medium">{job.company}</p>
              </div>
              <div className="flex space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(job.type)}`}>
                  {job.type.replace("-", " ")}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getExperienceColor(job.experience_level)}`}>
                  {job.experience_level}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">📍 {job.location}</p>
                <p className="text-sm text-gray-600">
                  💰 ${job.salary_range.min.toLocaleString()} - ${job.salary_range.max.toLocaleString()}
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">REQUIRED SKILLS</p>
                <div className="flex flex-wrap gap-1">
                  {job.required_skills.map((skill) => (
                    <span key={skill} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {job.preferred_skills.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">PREFERRED SKILLS</p>
                  <div className="flex flex-wrap gap-1">
                    {job.preferred_skills.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">💼</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or post some jobs to get started.</p>
        </div>
      )}
    </div>
  );
}
