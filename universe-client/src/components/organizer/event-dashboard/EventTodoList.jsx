import React, { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

const EventTodoList = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Send final reminders to speakers", completed: false },
    { id: 2, text: "Check AV equipment", completed: true },
    { id: 3, text: "Print badges for VIPs", completed: false },
    { id: 4, text: "Order catering", completed: true },
  ]);

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-sm uppercase tracking-wide text-gray-400">
          Notes & Tasks
        </h3>
        <span className="text-[10px] font-bold bg-white/5 px-2 py-1 rounded text-white/60 border border-white/5">
          {tasks.filter((t) => t.completed).length}/{tasks.length}
        </span>
      </div>

      <div className="space-y-2 flex-grow">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="group flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div
              className={`mt-0.5 ${task.completed ? "text-emerald-400" : "text-gray-600 group-hover:text-violet-400"} transition-colors`}
            >
              {task.completed ? (
                <CheckCircle2 size={16} />
              ) : (
                <Circle size={16} />
              )}
            </div>
            <div>
              <p
                className={`text-sm font-medium transition-all ${task.completed ? "text-gray-500 line-through" : "text-gray-200"}`}
              >
                {task.text}
              </p>
              {!task.completed && (
                <p className="text-[10px] text-gray-500 mt-0.5 font-mono">
                  Due Today
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-white/10">
        <input
          type="text"
          placeholder="+ Add a new task..."
          className="w-full bg-transparent text-xs font-medium text-white placeholder:text-gray-600 focus:outline-none focus:placeholder:text-gray-500"
        />
      </div>
    </div>
  );
};

export default EventTodoList;
