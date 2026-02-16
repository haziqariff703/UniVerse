import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  ShieldCheck,
  ArrowRight,
  Loader2,
  MoreHorizontal,
  Edit2,
  X,
  Check,
} from "lucide-react";
import CrewRosterModal from "./CrewRosterModal";
import { API_URL } from '@/config/api';

const CrewRosterCard = ({
  eventId,
  canEdit,
  refreshTrigger,
  onManageClick,
}) => {
  const [crew, setCrew] = useState([]);
  const [loading, setLoading] = useState(true);
  // No internal modal control for the main roster anymore - triggered by parent
  // But we might need a small modal/edit state for "Edit Member"
  const [editingMember, setEditingMember] = useState(null);
  const [editForm, setEditForm] = useState({ role: "", department: "" });
  const [saving, setSaving] = useState(false);

  const fetchCrew = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/crew/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setCrew(data || []);
    } catch (err) {
      console.error("Fetch crew error:", err);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchCrew();
  }, [fetchCrew, refreshTrigger]);

  const handleEditClick = (member) => {
    setEditingMember(member._id);
    setEditForm({ role: member.role, department: member.department || "" });
  };

  const handleSaveEdit = async () => {
    if (!editingMember) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/crew/${editingMember}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        },
      );

      if (res.ok) {
        setEditingMember(null);
        fetchCrew();
      }
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#050505] border border-white/5 rounded-2xl overflow-hidden shadow-xl min-h-[350px] flex flex-col">
      {/* Removed internal Header - now handled by Parent Dashboard */}

      <div className="flex-1 flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 p-3 text-[10px] font-bold text-gray-500 uppercase border-b border-white/5 tracking-wider">
          <div className="col-span-5">Member</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-3">Department</div>
          <div className="col-span-1"></div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-violet-500 animate-spin" />
          </div>
        ) : crew.length > 0 ? (
          <div className="divide-y divide-white/5 overflow-y-auto max-h-[300px] scrollbar-hide">
            {crew.map((member) => (
              <div
                key={member._id}
                className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-white/5 transition-colors group"
              >
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-lg">
                    {member.user_id?.name?.charAt(0) || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {member.user_id?.name || "Unknown"}
                    </p>
                    <p className="text-[9px] text-gray-500 font-mono truncate">
                      {member.user_id?.student_id}
                    </p>
                  </div>
                </div>

                {editingMember === member._id ? (
                  <>
                    <div className="col-span-3">
                      <select
                        value={editForm.role}
                        onChange={(e) =>
                          setEditForm({ ...editForm, role: e.target.value })
                        }
                        className="w-full bg-black border border-white/10 rounded px-1 py-0.5 text-[10px] text-white focus:outline-none focus:border-violet-500"
                      >
                        <option value="Member">Member</option>
                        <option value="Leader">Leader</option>
                        <option value="Head">Head</option>
                      </select>
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={editForm.department}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            department: e.target.value,
                          })
                        }
                        className="w-full bg-black border border-white/10 rounded px-1 py-0.5 text-[10px] text-white focus:outline-none focus:border-violet-500"
                        placeholder="Dept"
                      />
                    </div>
                    <div className="col-span-1 flex items-center gap-1">
                      <button
                        onClick={handleSaveEdit}
                        disabled={saving}
                        className="text-emerald-400 hover:text-emerald-300"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setEditingMember(null)}
                        className="text-rose-400 hover:text-rose-300"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-span-3">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/5 text-white/70 border border-white/5 truncate block w-fit max-w-full">
                        {member.role}
                      </span>
                    </div>
                    <div className="col-span-3 text-[10px] font-medium text-gray-400 truncate">
                      {member.department || "-"}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      {canEdit && (
                        <button
                          onClick={() => handleEditClick(member)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-white transition-all"
                        >
                          <Edit2 size={12} />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <ShieldCheck className="w-8 h-8 text-white/5 mx-auto mb-2" />
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-loose">
              No Crew Assigned
            </p>
          </div>
        )}
      </div>

      {/* Footer of card */}
      <div className="p-2 bg-white/[0.02] border-t border-white/5 text-center mt-auto">
        <button
          onClick={onManageClick}
          className="text-[10px] font-bold text-gray-500 hover:text-white uppercase transition-colors flex items-center justify-center gap-1 w-full text-center py-1"
        >
          View Team Roster <ArrowRight size={10} />
        </button>
      </div>
    </div>
  );
};

export default CrewRosterCard;
