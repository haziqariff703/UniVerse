import React from "react";
import { Users, Filter } from "lucide-react";

const TeamRosterTable = ({ crew }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="text-violet-400" size={20} />
          Committee (AJK) Roster
        </h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2">
            <Filter size={14} /> Filter
          </button>
          <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold transition-all">
            + Recruit AJK
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <th className="py-4 pl-4">Member</th>
              <th className="py-4">Role</th>
              <th className="py-4">Department</th>
              <th className="py-4">Status</th>
              <th className="py-4 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium">
            {crew.map((member) => (
              <tr
                key={member._id}
                className="group border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-3 pl-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-xs text-white border border-white/10">
                      {member.user_id.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white">{member.user_id.name}</div>
                      <div className="text-[10px] text-gray-500">
                        {member.user_id.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-gray-300">{member.role}</td>
                <td className="py-3">
                  <span className="px-2 py-1 rounded-md bg-white/5 text-xs text-gray-400 border border-white/5">
                    {member.department}
                  </span>
                </td>
                <td className="py-3">
                  <div
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      member.status === "accepted"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : member.status === "applied"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {member.status}
                  </div>
                </td>
                <td className="py-3 pr-4 text-right">
                  <button className="text-gray-500 hover:text-white transition-colors text-xs font-bold">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamRosterTable;
