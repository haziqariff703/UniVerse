import React, { useState, useEffect } from "react";
import {
  XCircle,
  Search,
  Camera,
  CheckCircle,
  Users,
  Clock,
  History,
  UserCheck,
} from "lucide-react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ScanQR = () => {
  const [manualCode, setManualCode] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const [history, setHistory] = useState([]);

  // Mock initial history for aesthetic, would be empty in production
  useEffect(() => {
    // Optionally fetch existing check-ins for the event if we had the event ID
  }, []);

  const addToHistory = (userData) => {
    setHistory((prev) =>
      [
        {
          id: Date.now(),
          name: userData.name,
          studentId: userData.student_id,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...prev,
      ].slice(0, 10),
    ); // Keep last 10
  };

  const handleCheckInResponse = (response, data) => {
    if (response.ok) {
      setScanResult({
        success: true,
        message: data.message,
        user: data.user,
      });
      toast.success("Check-in Successful");
      if (data.user) addToHistory(data.user);
      setUseCamera(false);
    } else {
      setScanResult({
        success: false,
        message: data.message,
      });
      toast.error("Check-in Failed", { description: data.message });
    }
  };

  const handleScan = async (result) => {
    if (!result || !result[0]?.rawValue) return;

    const code = result[0].rawValue;
    setLoading(true);
    setScanResult(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/registrations/checkin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ qr_code: code }),
        },
      );

      const data = await response.json();
      handleCheckInResponse(response, data);
    } catch (err) {
      toast.error("Network Error", {
        description: "Please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheckIn = async (e) => {
    e.preventDefault();
    if (!manualCode) return;

    setLoading(true);
    setScanResult(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/registrations/checkin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ qr_code: manualCode }),
        },
      );

      const data = await response.json();
      handleCheckInResponse(response, data);
      if (response.ok) setManualCode("");
    } catch (error) {
      toast.error("Network Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-8 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="w-full mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-violet-600/20 text-violet-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-clash font-bold text-white tracking-tight">
            Terminal Check-in
          </h1>
        </div>
        <p className="text-gray-500 font-geist">
          Professional event attendance management system. Secure and real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Scanning Section (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#050505] border border-white/10 rounded-[2rem] p-8 shadow-2xl">
            {/* Scanner Area */}
            <div className="relative group overflow-hidden rounded-2xl bg-white/5 border border-white/5 border-dashed min-h-[400px] flex items-center justify-center mb-8">
              <AnimatePresence mode="wait">
                {useCamera ? (
                  <motion.div
                    key="scanner"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full absolute inset-0"
                  >
                    <Scanner
                      onScan={handleScan}
                      onError={(err) => {
                        toast.error("Scanner Error", {
                          description: "Access denied.",
                        });
                        setUseCamera(false);
                      }}
                      styles={{
                        container: { width: "100%", height: "100%" },
                        video: {
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        },
                      }}
                    />
                    {/* Scanner Overlay UI */}
                    <div className="absolute inset-0 border-[40px] border-black/60 pointer-events-none">
                      <div className="w-full h-full border-2 border-violet-500/50 rounded-xl relative">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-violet-500 rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-violet-500 rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-violet-500 rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-violet-500 rounded-br-lg" />
                        <motion.div
                          animate={{ top: ["10%", "90%"] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute left-0 right-0 h-0.5 bg-violet-400 shadow-[0_0_15px_rgba(139,92,246,1)]"
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-12"
                  >
                    <div className="inline-flex p-6 bg-violet-600/10 rounded-full mb-6 text-violet-500 ring-1 ring-violet-500/20 capitalize">
                      <Camera size={40} />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">
                      Ready to Initialize
                    </h2>
                    <p className="text-gray-500 max-w-sm mb-8 mx-auto font-geist">
                      Grant camera permissions to start scanning digital tickets
                      and credentials automatically.
                    </p>
                    <button
                      onClick={() => setUseCamera(true)}
                      className="px-10 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-bold transition-all shadow-[0_10px_30px_rgba(124,58,237,0.3)] hover:-translate-y-1 active:scale-95"
                    >
                      Activate Scanner
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Manual Entry Form */}
            <form onSubmit={handleManualCheckIn} className="relative mt-auto">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Terminal Entry: Paste Code Here..."
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-600/40 transition-all font-mono text-sm"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !manualCode}
                  className="px-8 py-4 bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:grayscale rounded-2xl font-black uppercase text-xs tracking-widest transition-all"
                >
                  {loading ? "AUTHENTICATING..." : "VERIFY"}
                </button>
              </div>
            </form>
          </div>

          {/* Success/Error State Cards */}
          <AnimatePresence>
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  "p-6 rounded-[2rem] border-2 flex items-start gap-5",
                  scanResult.success
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                    : "bg-rose-500/5 border-rose-500/20 text-rose-400",
                )}
              >
                <div
                  className={cn(
                    "p-3 rounded-2xl",
                    scanResult.success ? "bg-emerald-500/10" : "bg-rose-500/10",
                  )}
                >
                  {scanResult.success ? (
                    <CheckCircle size={32} />
                  ) : (
                    <XCircle size={32} />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">
                    {scanResult.success
                      ? "Authentication Success"
                      : "Access Denied"}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed font-geist">
                    {scanResult.message}
                  </p>

                  {scanResult.user && (
                    <div className="bg-black/40 rounded-2xl p-4 border border-white/5 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter">
                          Verified Identity
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <p className="text-white font-bold text-lg">
                        {scanResult.user.name}
                      </p>
                      <p className="text-violet-400 font-mono text-xs">
                        {scanResult.user.student_id}
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setScanResult(null)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 opacity-40 hover:opacity-100" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Side History Section (1/3) */}
        <div className="space-y-6">
          <div className="bg-[#050505] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col h-full max-h-[700px]">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <History className="w-4 h-4 text-violet-400" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-white">
                  Live Logs
                </h2>
              </div>
              <span className="px-2 py-1 rounded bg-fuchsia-500/10 text-fuchsia-400 text-[10px] font-mono">
                {history.length} SYNCED
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {history.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-center opacity-30 grayscale p-6">
                  <Users className="w-10 h-10 mb-2" />
                  <p className="text-xs font-geist">
                    Awaiting local captures...
                  </p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {history.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 bg-[#0A0A0A] border border-white/5 rounded-2xl hover:border-violet-500/30 transition-all flex items-center gap-4 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-violet-600/10 flex items-center justify-center text-violet-400 font-bold border border-violet-500/20 group-hover:scale-110 transition-transform">
                        {item.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] font-mono text-gray-500">
                          {item.studentId}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-emerald-500 mb-1">
                          <CheckCircle className="w-3 h-3" />
                          <span className="text-[10px] font-black">OK</span>
                        </div>
                        <p className="text-[10px] text-gray-600 font-mono italic">
                          {item.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            <div className="p-4 bg-white/[0.02] border-t border-white/5">
              <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono tracking-tighter">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>
                    SESSION LIVE:{" "}
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <Users className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanQR;
