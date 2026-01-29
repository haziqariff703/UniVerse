import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import TalentGrid from "@/components/organizer/workforce/TalentGrid";
import TeamRosterTable from "@/components/organizer/workforce/TeamRosterTable";

const Workforce = () => {
  const [activeTab, setActiveTab] = useState("talent"); // 'talent' or 'team'
  // const [loading, setLoading] = useState(true);

  // Mock data for prototype
  const mockCrew = [
    {
      _id: "1",
      user_id: { name: "Dr. Alistair Cook", email: "ali.cook@example.com" },
      role: "Keynote Speaker",
      type: "talent",
      department: "Main Stage",
      status: "accepted",
    },
    {
      _id: "2",
      user_id: { name: "Sarah Khan", email: "sarah.k@example.com" },
      role: "Panelist",
      type: "talent",
      department: "Tech Talk",
      status: "invited",
    },
    {
      _id: "3",
      user_id: { name: "Ahmad Zaki", email: "zaki@student.uitm.edu.my" },
      role: "Head of Logistics",
      type: "crew",
      department: "Logistics",
      status: "accepted",
    },
    {
      _id: "4",
      user_id: { name: "Wei Ling", email: "ling@student.uitm.edu.my" },
      role: "Usher",
      type: "crew",
      department: "Protocol",
      status: "applied",
    },
  ];

  const talent = mockCrew.filter((c) => c.type === "talent");
  const crew = mockCrew.filter((c) => c.type === "crew");

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-neuemontreal font-bold text-white mb-1">
              Workforce Center
            </h1>
            <p className="text-white/40 text-sm">
              Manage your Talent & Team (AJKs)
            </p>
          </div>
        </div>

        <div className="flex bg-[#050505] border border-white/10 rounded-full p-1 shadow-lg">
          <button
            onClick={() => setActiveTab("talent")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              activeTab === "talent"
                ? "bg-violet-600 text-white shadow-lg"
                : "text-gray-500 hover:text-white"
            }`}
          >
            Talent
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              activeTab === "team"
                ? "bg-violet-600 text-white shadow-lg"
                : "text-gray-500 hover:text-white"
            }`}
          >
            Team (AJK)
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-[#050505] border border-white/10 rounded-3xl p-6 shadow-xl min-h-[500px]">
        {activeTab === "talent" ? (
          <TalentGrid talent={talent} />
        ) : (
          <TeamRosterTable crew={crew} />
        )}
      </div>
    </div>
  );
};

export default Workforce;
