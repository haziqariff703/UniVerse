import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Upload, FileText, X, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CertificateUpload = ({ onUploadSuccess, compact = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showTitleForm, setShowTitleForm] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    // Validate PDF
    if (selectedFile.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    // Validate size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    setFile(selectedFile);
    setShowTitleForm(true);
  };

  const handleUpload = async () => {
    if (!title.trim() || title.trim().length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("file", file);

      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:5000/api/users/profile/assets",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Certificate uploaded successfully!");
        setFile(null);
        setTitle("");
        setShowTitleForm(false);
        if (onUploadSuccess) onUploadSuccess(data.assets);
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setTitle("");
    setShowTitleForm(false);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!showTitleForm ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer group flex items-center justify-center", // Added flex centering
              isDragging
                ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                : "border-white/10 hover:border-emerald-500/50 hover:bg-white/5",
              compact ? "h-20 p-4" : "p-12", // Dynamic height and padding
            )}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" // Added z-10
            />

            <div
              className={cn(
                "flex items-center gap-4 pointer-events-none",
                compact ? "flex-row" : "flex-col",
              )}
            >
              {" "}
              {/* Dynamic direction */}
              <motion.div
                animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                className={cn(
                  "rounded-xl transition-colors",
                  isDragging
                    ? "text-emerald-400"
                    : "text-white/40 group-hover:text-emerald-400",
                  compact ? "p-0 bg-transparent" : "p-4 bg-white/5", // conditional styling
                )}
              >
                <Upload className={cn(compact ? "w-5 h-5" : "w-8 h-8")} />
              </motion.div>
              <div
                className={cn(
                  "text-center",
                  compact && "text-left flex items-center gap-2",
                )}
              >
                <h3
                  className={cn(
                    "font-clash font-bold text-white mb-0",
                    compact ? "text-sm" : "text-lg mb-1",
                  )}
                >
                  {isDragging
                    ? "Acquiring Signal..."
                    : compact
                      ? "Upload New Asset"
                      : "Drag encrypted files here"}
                </h3>
                {!compact && ( // Hide extra text in compact mode
                  <>
                    <p className="text-sm text-white/40 font-geist">
                      or click to browse
                    </p>
                    <p className="text-xs text-white/30 mt-2 font-mono">
                      PDF only • Max 5MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="titleform"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border border-white/10 rounded-2xl p-6 bg-white/5"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-fuchsia-500 animate-spin" />
                  <div className="absolute inset-0 blur-xl bg-fuchsia-500/30 animate-pulse" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-mono font-bold text-emerald-400 mb-1 animate-pulse">
                    DECRYPTING...
                  </h3>
                  <p className="text-xs text-white/40 font-mono">
                    Uploading to Secure Vault
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
                  <FileText className="w-5 h-5 text-fuchsia-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white truncate">
                      {file?.name}
                    </p>
                    <p className="text-xs text-white/40">
                      {(file?.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={handleCancel}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-white/40 hover:text-white" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-fuchsia-400 uppercase tracking-widest mb-2">
                      Identify this asset
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., AWS Certified Developer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={50}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-fuchsia-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                    />
                    <p className="text-xs text-white/30 mt-1">
                      {title.length}/50 characters
                    </p>
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={!title.trim() || title.trim().length < 3}
                    className="w-full py-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-fuchsia-600"
                  >
                    Upload Certificate
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CertificateUpload;
