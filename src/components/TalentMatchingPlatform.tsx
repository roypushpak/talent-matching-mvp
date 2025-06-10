import { useState } from "react";
import { CandidatesList } from "./CandidatesList";
import { JobsList } from "./JobsList";
import { MatchingDashboard } from "./MatchingDashboard";
import { CreateCandidateForm } from "./CreateCandidateForm";
import { CreateJobForm } from "./CreateJobForm";

type Tab = "dashboard" | "candidates" | "jobs" | "create-candidate" | "create-job";

export function TalentMatchingPlatform() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const tabs = [
    { id: "dashboard" as const, label: "Dashboard", icon: "📊" },
    { id: "candidates" as const, label: "Candidates", icon: "👥" },
    { id: "jobs" as const, label: "Jobs", icon: "💼" },
    { id: "create-candidate" as const, label: "Add Candidate", icon: "➕" },
    { id: "create-job" as const, label: "Post Job", icon: "📝" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border">
        {activeTab === "dashboard" && <MatchingDashboard />}
        {activeTab === "candidates" && <CandidatesList />}
        {activeTab === "jobs" && <JobsList />}
        {activeTab === "create-candidate" && <CreateCandidateForm />}
        {activeTab === "create-job" && <CreateJobForm />}
      </div>
    </div>
  );
}
