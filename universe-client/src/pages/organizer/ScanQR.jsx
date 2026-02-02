import React, { useState } from "react";
import { QrCode, CheckCircle, XCircle, Search, Camera } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { Scanner } from "@yudiel/react-qr-scanner";
import { motion, AnimatePresence } from "framer-motion";

const ScanQR = () => {
  const [manualCode, setManualCode] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useCamera, setUseCamera] = useState(false);

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

      if (response.ok) {
        setScanResult({
          success: true,
          message: data.message,
          user: data.user,
        });
        // Briefly disable camera to show result
        setUseCamera(false);
      } else {
        setScanResult({
          success: false,
          message: data.message,
        });
      }
    } catch (err) {
      console.error("Check-in error:", err);
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheckIn = async (e) => {
    e.preventDefault();
    if (!manualCode) return;

    setLoading(true);
    setError(null);
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

      if (response.ok) {
        setScanResult({
          success: true,
          message: data.message,
          user: data.user,
        });
        setManualCode("");
      } else {
        setScanResult({
          success: false,
          message: data.message,
        });
      }
    } catch (error) {
      console.error("Check-in error:", error);
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-2xl mx-auto flex flex-col items-center">
      <div className="w-full text-center space-y-4 mb-10">
        <h1 className="text-3xl font-bold font-neuemontreal text-white">
          Event Check-in
        </h1>
        <p className="text-gray-400">
          Scan attendee QR codes or manually enter the code below.
        </p>
      </div>

      {error && (
        <div className="w-full mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-3">
          <XCircle size={18} />
          {error}
        </div>
      )}

      <SpotlightCard className="w-full p-8 rounded-[2rem] border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-white/10 rounded-2xl bg-white/5 mb-8 overflow-hidden relative">
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
                    console.error(err);
                    setError(
                      "Could not access camera. Please check permissions.",
                    );
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
                <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
                  <div className="w-full h-full border-2 border-violet-500/50 rounded-xl relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-violet-500 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-violet-500 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-violet-500 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-violet-500 rounded-br-lg" />
                    <motion.div
                      initial={{ top: "10%" }}
                      animate={{ top: "90%" }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute left-0 right-0 h-0.5 bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.8)]"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center p-8"
              >
                <div className="p-6 bg-violet-500/10 rounded-full mb-6 text-violet-400">
                  <Camera size={48} />
                </div>
                <p className="text-white font-bold mb-2">Live Scanner Ready</p>
                <p className="text-gray-500 text-sm text-center max-w-[250px] mb-8">
                  Point your camera at a student's digital pass to check them in
                  automatically.
                </p>
                <button
                  onClick={() => setUseCamera(true)}
                  className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-violet-600/20"
                >
                  Launch Camera
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <form onSubmit={handleManualCheckIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Manual Entry
            </label>
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Enter QR Code string..."
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !manualCode}
            className="w-full py-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-violet-600/20"
          >
            {loading ? "Checking in..." : "Check In"}
          </button>
        </form>
      </SpotlightCard>

      {/* Result Feedback */}
      {scanResult && (
        <div
          className={`mt-8 w-full p-6 rounded-2xl border ${scanResult.success ? "bg-emerald-500/10 border-emerald-500/30" : "bg-rose-500/10 border-rose-500/30"} flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4`}
        >
          <div
            className={`p-2 rounded-full ${scanResult.success ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}
          >
            {scanResult.success ? (
              <CheckCircle size={24} />
            ) : (
              <XCircle size={24} />
            )}
          </div>
          <div>
            <h3
              className={`text-lg font-bold ${scanResult.success ? "text-emerald-400" : "text-rose-400"}`}
            >
              {scanResult.success ? "Check-in Successful" : "Check-in Failed"}
            </h3>
            <p className="text-gray-300 mt-1">{scanResult.message}</p>
            {scanResult.user && (
              <div className="mt-4 p-4 bg-black/20 rounded-xl">
                <p className="text-sm text-gray-400">Attendee</p>
                <p className="text-white font-medium">{scanResult.user.name}</p>
                <p className="text-white/60 text-sm">
                  {scanResult.user.student_id}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanQR;
