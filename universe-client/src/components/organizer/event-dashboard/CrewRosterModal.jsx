import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  UserPlus,
  UserMinus,
  Briefcase,
  ShieldCheck,
  Search,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const CrewRosterModal = ({ isOpen, onClose, eventId, canEdit }) => {
  const [crew, setCrew] = useState([]);
  const [eligible, setEligible] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [processing, setProcessing] = useState(null);

  const fetchRoster = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/crew/${eventId}`);
      const data = await res.json();
      if (res.ok) setCrew(data || []);
    } catch (err) {
      console.error("Fetch crew error:", err);
    }
  }, [eventId]);

  const fetchEligible = useCallback(async () => {
    if (!canEdit) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/crew/eligible/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (res.ok) setEligible(data || []);
    } catch (err) {
      console.error("Fetch eligible error:", err);
    }
  }, [canEdit, eventId]);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      Promise.all([fetchRoster(), fetchEligible()]).finally(() =>
        setLoading(false),
      );
    }
  }, [isOpen, fetchRoster, fetchEligible]);

  const handleAssign = async (userId) => {
    setProcessing(userId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/crew`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          event_id: eventId,
          user_id: userId,
          role: "Member", // Default role
          type: "crew",
          department: "General",
        }),
      });

      if (res.ok) {
        await Promise.all([fetchRoster(), fetchEligible()]);
      } else {
        const error = await res.json();
        alert(error.message || "Failed to assign member");
      }
    } catch (err) {
      console.error("Assign error:", err);
    } finally {
      setProcessing(null);
    }
  };

  const handleRemove = async (crewId) => {
    if (!window.confirm("Remove this member from the crew?")) return;
    setProcessing(crewId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/crew/${crewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        await Promise.all([fetchRoster(), fetchEligible()]);
      }
    } catch (err) {
      console.error("Remove error:", err);
    } finally {
      setProcessing(null);
    }
  };

  if (!isOpen) return null;

  const filteredEligible = eligible.filter(
    (m) =>
      m.user_id?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.user_id?.student_id?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#050505] border border-white/10 w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/10 rounded-xl">
              <ShieldCheck className="text-violet-400" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">
                Event Workforce
              </h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Team Roster & Crew Assignments
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-8 scrollbar-hide">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-gray-500">
              <Loader2 size={32} className="animate-spin text-violet-500" />
              <p className="text-sm font-medium">Loading Roster...</p>
            </div>
          ) : (
            <>
              {/* Current Crew */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Active Crew ({crew.length})
                  </h3>
                </div>

                {crew.length === 0 ? (
                  <div className="p-10 border border-dashed border-white/5 rounded-2xl text-center text-gray-500">
                    <Briefcase size={32} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No crew members assigned yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {crew.map((member) => (
                      <div
                        key={member._id}
                        className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg">
                            {member.user_id?.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">
                              {member.user_id?.name || "Unknown"}
                            </p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                              {member.role} • {member.department}
                            </p>
                          </div>
                        </div>
                        {canEdit && (
                          <button
                            onClick={() => handleRemove(member._id)}
                            disabled={processing === member._id}
                            className={`p-2 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white disabled:opacity-50`}
                          >
                            {processing === member._id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <UserMinus size={16} />
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Assign New (Admin Only) */}
              {canEdit && (
                <section className="pt-4 border-t border-white/5">
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-white mb-3">
                      Assign Approved Members
                    </h3>
                    <div className="relative">
                      <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                      <input
                        type="text"
                        placeholder="Search Approved Organization Members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
                    {filteredEligible.length === 0 ? (
                      <p className="text-xs text-gray-600 text-center py-4 italic">
                        {searchQuery
                          ? "No matching members found."
                          : "No eligible members available."}
                      </p>
                    ) : (
                      filteredEligible.map((item) => (
                        <div
                          key={item._id}
                          className="p-3 rounded-lg bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">
                              {item.user_id?.name?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">
                                {item.user_id?.name}
                              </p>
                              <p className="text-[9px] text-gray-500">
                                {item.user_id?.student_id}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAssign(item.user_id?._id)}
                            disabled={processing === item.user_id?._id}
                            className="px-3 py-1.5 rounded-lg bg-violet-600/10 text-violet-400 text-[10px] font-black uppercase hover:bg-violet-600 hover:text-white transition-all disabled:opacity-50 flex items-center gap-2"
                          >
                            {processing === item.user_id?._id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <>
                                <UserPlus size={12} />
                                Assign
                              </>
                            )}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center gap-3">
          <CheckCircle2 size={14} className="text-emerald-500/60" />
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">
            Authorized Workforce Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default CrewRosterModal;
