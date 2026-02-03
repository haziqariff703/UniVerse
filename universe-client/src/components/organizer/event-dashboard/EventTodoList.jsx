import React, { useState } from "react";
import { CheckCircle2, Circle, Trash2, Plus } from "lucide-react";

const EventTodoList = ({ tasks, onUpdate, canEdit }) => {
  const [newTask, setNewTask] = useState("");

  const toggleTask = (index) => {
    const updated = tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t,
    );
    onUpdate(updated);
  };

  const addTask = (e) => {
    if (e.key === "Enter" && newTask.trim()) {
      onUpdate([...tasks, { text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const deleteTask = (index) => {
    onUpdate(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-[#050505] border border-white/10 rounded-xl p-4 h-full flex flex-col shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-sm uppercase tracking-widest text-white/40">
          Notes & Tasks
        </h3>
        <span className="text-[10px] font-bold bg-white/5 px-2 py-1 rounded text-white/60 border border-white/5 uppercase tracking-tighter">
          {tasks.filter((t) => t.completed).length}/{tasks.length} Completed
        </span>
      </div>

      <div className="space-y-2 flex-grow overflow-y-auto pr-1 custom-scrollbar">
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <div
              key={index}
              className={`group flex items-start gap-3 p-2.5 rounded-xl transition-all ${canEdit ? "hover:bg-white/[0.03] border border-transparent hover:border-white/5 cursor-pointer" : "cursor-default opacity-80"}`}
            >
              <div
                onClick={() => canEdit && toggleTask(index)}
                className={`mt-0.5 ${task.completed ? "text-emerald-400" : `text-gray-600 ${canEdit ? "group-hover:text-violet-400" : ""}`} transition-colors`}
              >
                {task.completed ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <Circle size={16} />
                )}
              </div>
              <div
                className="flex-1"
                onClick={() => canEdit && toggleTask(index)}
              >
                <p
                  className={`text-sm font-medium transition-all ${task.completed ? "text-gray-500 line-through decoration-violet-500/50" : "text-gray-200"}`}
                >
                  {task.text}
                </p>
                {!task.completed && (
                  <p className="text-[10px] text-gray-600 mt-1 font-bold uppercase tracking-wider">
                    Pending
                  </p>
                )}
              </div>
              {canEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(index);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/10 text-gray-700 hover:text-red-400 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-700 py-10 opacity-50">
            <Plus size={24} className="mb-2" />
            <p className="text-xs font-bold uppercase tracking-widest">
              No active tasks
            </p>
          </div>
        )}
      </div>

      {canEdit && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="relative group">
            <input
              type="text"
              placeholder="+ Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={addTask}
              className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-xs font-medium text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/30 focus:bg-white/[0.04] transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-700 group-focus-within:text-violet-500 transition-colors uppercase">
              Hit Enter
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventTodoList;
