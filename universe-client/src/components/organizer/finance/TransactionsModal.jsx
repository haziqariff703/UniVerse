import React, { useState, useEffect, useCallback } from "react";
import { X, Filter, DollarSign, Calendar, Download } from "lucide-react";

const TransactionsModal = ({ isOpen, onClose }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:5000/api/events/organizer/transactions",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchTransactions();
    }
  }, [isOpen, fetchTransactions]);

  const exportToCSV = () => {
    const headers = ["ID", "Event", "Amount", "Date", "Status", "Type"];
    const rows = transactions.map((t) => [
      t.id,
      t.event,
      `RM${t.amount}`,
      new Date(t.date).toLocaleDateString(),
      t.status,
      t.type,
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `UniVerse_Transactions_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-[#050505] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/10 rounded-lg">
              <DollarSign size={20} className="text-violet-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-none mb-1">
                Transaction Ledger
              </h2>
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold">
                Comprehensive financial breakdown
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white transition-all"
            >
              <Download size={14} />
              Export .CSV
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Transactions list */}
        <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-white/40 font-medium tracking-widest uppercase">
                Fetching ledger items...
              </p>
            </div>
          ) : transactions.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#0A0A0A] border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                    Event Title
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                    Date
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((tr) => (
                  <tr
                    key={tr.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white">{tr.event}</p>
                      <p className="text-[10px] text-white/20 font-mono tracking-tighter truncate max-w-[150px]">
                        {tr.id}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-white/60 text-xs font-medium">
                        <Calendar size={12} />
                        {new Date(tr.date).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded ${
                          tr.status === "confirmed" || tr.status === "checkedin"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : tr.status === "pending"
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {tr.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p
                        className={`font-bold ${tr.type === "income" ? "text-emerald-400" : "text-white"}`}
                      >
                        {tr.type === "income" ? "+" : ""}RM{tr.amount}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign size={32} className="text-white/20" />
              </div>
              <p className="text-white/40 font-medium">
                No transactions found.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TransactionsModal;
