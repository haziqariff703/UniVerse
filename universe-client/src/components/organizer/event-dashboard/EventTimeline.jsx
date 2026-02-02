import React, { useState } from "react";
import { MoreHorizontal, Trash2, Edit3, X, Check, Plus } from "lucide-react";

const EventTimeline = ({ schedule, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ time: "", title: "" });
  const [showMenu, setShowMenu] = useState(false);

  const handleAdd = () => {
    if (!newItem.time || !newItem.title) return;
    const updated = [...schedule, newItem].sort((a, b) => {
      // Very basic time string comparison for sort
      return a.time.localeCompare(b.time);
    });
    onUpdate(updated);
    setNewItem({ time: "", title: "" });
    setIsAdding(false);
  };

  const handleDelete = (index) => {
    const updated = schedule.filter((_, i) => i !== index);
    onUpdate(updated);
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear the entire schedule?")) {
      onUpdate([]);
      setShowMenu(false);
    }
  };

  return (
    <div className="bg-[#050505] border border-white/10 rounded-xl p-4 h-full shadow-xl relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-sm uppercase tracking-widest text-white/40">
          Schedule
        </h3>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-all"
          >
            <MoreHorizontal size={16} />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowMenu(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl z-30 overflow-hidden py-1">
                <button
                  onClick={clearAll}
                  className="w-full px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-400/10 flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={12} /> Clear Entire Schedule
                </button>
                <button
                  onClick={() => setShowMenu(false)}
                  className="w-full px-4 py-2.5 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
                >
                  <X size={12} /> Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-white/5 mb-6">
        {schedule.length > 0 ? (
          schedule.map((item, index) => (
            <div key={index} className="relative pl-8 group">
              <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white/10 bg-[#0A0A0A] group-hover:border-violet-500 transition-colors z-10 box-content -ml-0.5 shadow-lg shadow-violet-500/0 group-hover:shadow-violet-500/20"></div>
              <div className="flex justify-between items-start">
                <div className="min-w-0 pr-4">
                  <p className="text-[10px] text-violet-400 font-bold mb-0.5 flex items-center gap-2 uppercase tracking-tighter">
                    {item.time}
                  </p>
                  <h4 className="font-bold text-white text-sm mb-1 leading-tight group-hover:text-violet-100 transition-colors">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-widest font-bold">
                      {item.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(index)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-all flex-shrink-0"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-600">
            <p className="text-xs font-medium italic">Empty Roadmap</p>
          </div>
        )}
      </div>

      {isAdding ? (
        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="09:00 AM"
              value={newItem.time}
              onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
              className="w-24 bg-[#0A0A0A] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white placeholder:text-gray-700 focus:border-violet-500/50 outline-none transition-all"
            />
            <input
              type="text"
              placeholder="Activity / Title"
              value={newItem.title}
              onChange={(e) =>
                setNewItem({ ...newItem, title: e.target.value })
              }
              className="flex-1 bg-[#0A0A0A] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white placeholder:text-gray-700 focus:border-violet-500/50 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-bold uppercase rounded-lg transition-all"
            >
              Add Item
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-all"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-2.5 text-[10px] font-black uppercase text-gray-500 hover:text-violet-400 border border-dashed border-white/10 hover:border-violet-500/30 rounded-xl bg-white/[0.01] hover:bg-violet-500/[0.03] transition-all flex items-center justify-center gap-2 group"
        >
          <Plus
            size={10}
            className="group-hover:scale-125 transition-transform"
          />{" "}
          Add Schedule Item
        </button>
      )}
    </div>
  );
};

export default EventTimeline;
