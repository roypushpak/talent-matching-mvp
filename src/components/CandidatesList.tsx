import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function CandidatesList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");

  const candidates = useQuery(api.candidates.list, {
    search: searchTerm || undefined,
    skills: selectedSkills.length > 0 ? selectedSkills : undefined,
    location: locationFilter || undefined,
    availability: availabilityFilter || undefined,
  }) || [];

  const allSkills = Array.from(
    new Set(candidates.flatMap(candidate => candidate.skills))
  ).sort();

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available": return "bg-green-100 text-green-800";
      case "open": return "bg-yellow-100 text-yellow-800";
      case "not-available": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Candidates</h2>
        <p className="text-gray-600">Browse and filter through our talent pool</p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search candidates..."
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
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All availability</option>
            <option value="available">Available</option>
            <option value="open">Open to opportunities</option>
            <option value="not-available">Not available</option>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
          <div key={candidate._id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                <p className="text-blue-600 font-medium">{candidate.title}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(candidate.availability)}`}>
                {candidate.availability.replace("-", " ")}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">📍 {candidate.location}</p>
              <p className="text-sm text-gray-600">💼 {candidate.experience} years experience</p>
              {candidate.salary_expectation && (
                <p className="text-sm text-gray-600">💰 ${candidate.salary_expectation.toLocaleString()}</p>
              )}
            </div>
            
            <p className="text-sm text-gray-700 mb-4 line-clamp-3">{candidate.bio}</p>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">SKILLS</p>
                <div className="flex flex-wrap gap-1">
                  {candidate.skills.slice(0, 6).map((skill) => (
                    <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                  {candidate.skills.length > 6 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{candidate.skills.length - 6} more
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                {candidate.linkedin_url && (
                  <a href={candidate.linkedin_url} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-800 text-sm">LinkedIn</a>
                )}
                {candidate.github_url && (
                  <a href={candidate.github_url} target="_blank" rel="noopener noreferrer" 
                     className="text-gray-600 hover:text-gray-800 text-sm">GitHub</a>
                )}
                {candidate.portfolio_url && (
                  <a href={candidate.portfolio_url} target="_blank" rel="noopener noreferrer" 
                     className="text-purple-600 hover:text-purple-800 text-sm">Portfolio</a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {candidates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or add some candidates to get started.</p>
        </div>
      )}
    </div>
  );
}
