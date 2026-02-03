import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Loader2,
  Info,
  Rocket,
  ChevronDown,
} from "lucide-react";
import TalentGrid from "@/components/organizer/workforce/TalentGrid";
import TeamGrid from "@/components/organizer/workforce/TeamGrid";
import { cn } from "@/lib/utils";

const API_BASE = "http://localhost:5000";
const Workforce = () => {
  const [activeTab, setActiveTab] = useState("applicants");
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [applicants, setApplicants] = useState([]); // All members with status Applied/Interviewing
  const [team, setTeam] = useState([]); // All members with status Approved
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get current user to check ownership
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Check if current user is the owner OR has President role in the roster
  const selectedCommunityData = communities.find(
    (c) => c._id === selectedCommunity,
  );

  const currentUserId = user?._id || user?.id;
  const ownerId =
    selectedCommunityData?.owner_id?._id || selectedCommunityData?.owner_id;

  // Find current user's role in the team roster
  const currentUserMembership = team.find(
    (m) => (m.user_id?._id || m.user_id) === currentUserId,
  );
  const isPresident = currentUserMembership?.role === "President";

  const isOwner =
    !!currentUserId &&
    (ownerId === currentUserId ||
      isPresident ||
      user.role === "admin" ||
      user.roles?.includes("admin"));

  const fetchMyCommunities = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/communities/my-communities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("Communities:", data);
      if (res.ok) {
        setCommunities(data || []);
        if (data.length > 0 && !selectedCommunity) {
          setSelectedCommunity(data[0]._id);
        }
      }
    } catch (err) {
      console.error("Fetch communities error:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCommunity]);

  // Debugging
  console.log("User:", user);
  console.log("Communities State:", communities);
  console.log("Selected Community:", selectedCommunity);
  console.log("Assessment:", { isOwner, ownerId, currentUserId });

  const fetchApplicants = useCallback(async () => {
    if (!selectedCommunity) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/api/communities/${selectedCommunity}/applicants`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.status === 403) {
        setApplicants([]);
        setTeam([]);
        alert(
          "Access Denied: You are not the authorized President of this community.",
        );
        return;
      }

      const data = await res.json();
      if (res.ok) {
        // Separate applicants from approved team
        setApplicants(data.filter((m) => m.status !== "Approved"));
        setTeam(data.filter((m) => m.status === "Approved"));
      }
    } catch (err) {
      console.error("Fetch applicants error:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCommunity]);

  useEffect(() => {
    fetchMyCommunities();
  }, [fetchMyCommunities]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const handleUpdateStatus = async (memberId, status, extra = {}) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/api/communities/members/${memberId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status, ...extra }),
        },
      );

      if (res.ok) {
        fetchApplicants();
        alert(`Status updated to ${status}`);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleInvite = async (studentId) => {
    if (!selectedCommunity) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/api/communities/${selectedCommunity}/members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ student_id: studentId }),
        },
      );

      const data = await res.json();
      if (res.ok) {
        alert("Crew member added successfully!");
        fetchApplicants();
      } else {
        alert(data.message || "Failed to add member");
      }
    } catch (err) {
      console.error("Invite error:", err);
      alert("Server error");
    }
  };

  // Filter Logic
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTeam = team.filter((member) => {
    const name = member.user_id?.name?.toLowerCase() || "";
    const role = member.role?.toLowerCase() || "";
    const dept = member.department?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return (
      name.includes(search) || role.includes(search) || dept.includes(search)
    );
  });

  // Early return if no communities (moved here to avoid hook errors)
  if (!loading && communities.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 flex flex-col items-center justify-center text-center">
        <Info className="w-16 h-16 text-white/20 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">
          No Community Found
        </h2>
        <p className="text-white/40 max-w-md mb-8">
          You have the Organizer role, but no community is linked to your
          account. If you recently submitted a proposal, please wait for admin
          approval. If you were manually promoted, you may need to create a
          community first.
        </p>
        <Link
          to="/start-club"
          className="px-6 py-3 bg-violet-600 rounded-xl text-white font-bold hover:bg-violet-700 transition-all"
        >
          Start a Club Proposal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
      {/* View-Only Warning for Authorized Organizers who aren't Owners */}
      {!isOwner && user.is_organizer_approved && (
        <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="p-2 rounded-xl bg-amber-500/20">
            <Info className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-amber-200 text-sm font-bold">View-Only Access</p>
            <p className="text-amber-200/60 text-xs">
              You are an authorized Organizer, but management actions
              (Approve/Reject/Edit) are restricted to the Community President.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-white/40 text-sm">
              Manage your Talent & Team (AJKs)
            </p>
          </div>
        </div>

        {/* Invite Button - Moved to Tab Controls */}
        <div />

        <div className="flex bg-[#050505] border border-white/10 rounded-full p-1 shadow-lg overflow-x-auto no-scrollbar whitespace-nowrap">
          {[
            { id: "council", label: "Council" },
            { id: "applicants", label: "Applicants" },
            { id: "team", label: "Our Team" },
            { id: "talent", label: "Talent Hub" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-violet-600 text-white shadow-lg"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Community Selector (Dropdown) */}
      {communities.length > 1 && (
        <div className="relative mb-8 z-50">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all min-w-[280px] justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-xs font-bold text-white">
                {selectedCommunityData?.name?.charAt(0) || "C"}
              </div>
              <div className="text-left">
                <p className="text-xs text-white/40 font-bold uppercase tracking-wider">
                  Current Community
                </p>
                <p className="text-white font-bold text-sm truncate max-w-[200px]">
                  {selectedCommunityData?.name}
                </p>
              </div>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-white/40 transition-transform duration-300",
                isDropdownOpen && "rotate-180",
              )}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-full min-w-[320px] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-2 space-y-1">
                {communities.map((c) => (
                  <button
                    key={c._id}
                    onClick={() => {
                      setSelectedCommunity(c._id);
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group",
                      selectedCommunity === c._id
                        ? "bg-white/10"
                        : "hover:bg-white/5",
                    )}
                  >
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        selectedCommunity === c._id
                          ? "bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.5)]"
                          : "bg-slate-700 group-hover:bg-slate-500",
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm font-bold",
                        selectedCommunity === c._id
                          ? "text-white"
                          : "text-slate-400 group-hover:text-slate-200",
                      )}
                    >
                      {c.name}
                    </span>
                    {selectedCommunity === c._id && (
                      <CheckCircle className="w-4 h-4 text-fuchsia-500 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Area */}
      {activeTab === "team" && (
        /* Custom Controls for Team Tab matching design */
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search team members..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#050505] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 transition-all placeholder:text-slate-600"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
              <span className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-500">
                ⌘K
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2.5 bg-[#050505] border border-white/10 hover:border-white/20 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
              <Filter size={14} /> Filter
            </button>
            <button className="px-4 py-2.5 bg-[#050505] border border-white/10 hover:border-white/20 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
              Select All
            </button>
            {isOwner && (
              <button
                onClick={() => {
                  const studentId = prompt("Enter Student ID to invite:");
                  if (studentId) handleInvite(studentId);
                }}
                className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-violet-900/20"
              >
                + Add Member
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === "team" ? (
        <>
          <TeamGrid
            crew={filteredTeam.slice(0, visibleCount).map((m) => ({
              _id: m._id,
              user_id: m.user_id,
              role: m.role || "AJK",
              department: m.department || "General",
              status: m.status,
              joined_at: m.joined_at,
            }))}
            onUpdate={isOwner ? handleUpdateStatus : null}
            isOwner={isOwner}
          />
          {filteredTeam.length > visibleCount && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2"
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-[#050505] border border-white/10 rounded-3xl p-6 shadow-xl min-h-[500px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 text-fuchsia-500 animate-spin" />
              <p className="text-white/40 animate-pulse">
                Scanning the matrix...
              </p>
            </div>
          ) : activeTab === "council" ? (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Advisor Card */}
                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600/20 to-violet-600/10 border border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Users size={120} />
                  </div>
                  <div className="relative z-10">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                      Faculty Advisor
                    </span>
                    <h2 className="text-4xl font-clash font-bold text-white mb-2">
                      {
                        communities.find((c) => c._id === selectedCommunity)
                          ?.advisor?.name
                      }
                    </h2>
                    <p className="text-white/60 font-medium mb-6">
                      {
                        communities.find((c) => c._id === selectedCommunity)
                          ?.advisor?.title
                      }
                    </p>
                    <div className="flex items-center gap-4 py-4 border-t border-white/5">
                      <div className="p-3 rounded-2xl bg-white/5">
                        <Search className="w-5 h-5 text-indigo-400" />
                      </div>
                      <p className="text-sm font-bold text-white/40">
                        Registered Faculty Mentor
                      </p>
                    </div>
                  </div>
                </div>

                {/* President Card */}
                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-fuchsia-600/20 to-pink-600/10 border border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Rocket size={120} />
                  </div>
                  <div className="relative z-10">
                    <span className="px-3 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                      Community President
                    </span>
                    <h2 className="text-4xl font-clash font-bold text-white mb-2">
                      {
                        communities.find((c) => c._id === selectedCommunity)
                          ?.owner_id?.name
                      }
                    </h2>
                    <p className="text-white/60 font-medium mb-6">
                      Main Account Holder
                    </p>
                    <div className="flex items-center gap-4 py-4 border-t border-white/5">
                      <div className="p-3 rounded-2xl bg-white/5">
                        <CheckCircle className="w-5 h-5 text-fuchsia-400" />
                      </div>
                      <p className="text-sm font-bold text-white/40">
                        Verified Organization Leader
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "applicants" ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-neuemontreal font-bold text-white">
                  Application Queue ({applicants.length})
                </h2>
                <div className="flex gap-2">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-white/40">
                    <Filter className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {applicants.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Info className="w-12 h-12 text-white/5 mb-4" />
                  <p className="text-white/40">No fresh applications found.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {applicants.map((app) => (
                    <div
                      key={app._id}
                      className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row justify-between items-center gap-6"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                          {app.user_id?.name?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-white font-bold">
                            {app.user_id?.name}
                          </h3>
                          <p className="text-white/40 text-xs">
                            ID: {app.user_id?.student_id || "N/A"} • Applied{" "}
                            {new Date(app.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {app.status === "Applied" ? (
                          isOwner ? (
                            <button
                              onClick={() => {
                                const date = prompt(
                                  "Enter interview date (YYYY-MM-DD):",
                                  "2026-02-15",
                                );
                                if (date)
                                  handleUpdateStatus(app._id, "Interviewing", {
                                    interview_date: date,
                                  });
                              }}
                              className="px-4 py-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-600/30 text-xs font-bold hover:bg-violet-600 transition-all hover:text-white flex items-center gap-2"
                            >
                              <Clock className="w-4 h-4" />
                              Set Interview
                            </button>
                          ) : (
                            <span className="px-3 py-1.5 rounded-lg bg-white/5 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                              Pending Review
                            </span>
                          )
                        ) : (
                          <div className="px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            Interview:{" "}
                            {new Date(app.interview_date).toLocaleDateString()}
                          </div>
                        )}

                        {isOwner && (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateStatus(app._id, "Approved", {
                                  role: "AJK",
                                })
                              }
                              className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 hover:bg-emerald-600 hover:text-white transition-all"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(app._id, "Rejected")
                              }
                              className="p-2 rounded-lg bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600 hover:text-white transition-all"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <TalentGrid talent={[]} />
          )}
        </div>
      )}
    </div>
  );
};

export default Workforce;
