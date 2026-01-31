import React from "react";
import {
  MoreHorizontal,
  ArrowUpRight,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

const StatusPill = ({ status, onClick }) => {
  const getStatusStyle = (s) => {
    switch (s?.toLowerCase()) {
      case "approved":
      case "completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20";
      case "rejected":
      case "cancelled":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20";
      default:
        return "bg-starlight/10 text-starlight/60 border-starlight/10 hover:bg-starlight/20";
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${getStatusStyle(
        status,
      )} cursor-pointer`}
    >
      {status}
    </button>
  );
};

const DashboardTable = ({ data, columns, onRowClick }) => {
  return (
    <div className="glass-panel w-full overflow-hidden rounded-3xl border-starlight/5">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-starlight/5 bg-starlight/[0.02]">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-6 py-4 text-left text-xs font-bold text-starlight/40 uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
              <th className="px-6 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-starlight/5">
            {data.map((item, idx) => (
              <motion.tr
                key={item.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => onRowClick && onRowClick(item)}
                className="group hover:bg-starlight/[0.02] transition-colors cursor-pointer"
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4">
                    {col.render ? (
                      col.render(item)
                    ) : (
                      <span className="text-sm text-starlight/80 font-medium">
                        {item[col.accessor]}
                      </span>
                    )}
                  </td>
                ))}
                <td className="px-6 py-4">
                  <button className="text-starlight/60 hover:text-white transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardTable;
export { StatusPill };

