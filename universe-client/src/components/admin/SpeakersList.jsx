import React, { useState, useEffect } from "react"; // Fixed imports
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Mic2,
  Linkedin,
  Twitter,
  Globe,
  MoreVertical,
  Users,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  Zap,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// eslint-disable-next-line no-unused-vars
const KpiCard = ({ label, value, icon: CardIcon, color, bg, border }) => (
  <div
    className={`glass-panel p-5 rounded-2xl border ${border} flex items-center justify-between relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-sm`}
  >
    <div
      className={`absolute -right-4 -bottom-4 opacity-[0.03] ${color} group-hover:scale-110 group-hover:opacity-10 transition-all duration-500`}
    >
      <CardIcon size={80} />
    </div>
    <div className="relative z-10">
      <p className="text-starlight/40 text-[10px] font-black uppercase tracking-widest mb-1">
        {label}
      </p>
      <h3 className="text-2xl font-black text-starlight leading-none">
        {value}
      </h3>
    </div>
    <div
      className={`relative z-10 w-12 h-12 rounded-xl ${bg} flex items-center justify-center border border-white/5 shadow-inner`}
    >
      <CardIcon size={24} className={color} />
    </div>
  </div>
);

const SpeakersList = () => {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDataDialogOpen, setIsDataDialogOpen] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState(null); // null = new, object = edit
  const [formData, setFormData] = useState({
    name: "",
    expertise: "",
    bio: "",
    social_links: { linkedin: "", twitter: "", website: "" },
  });
  const [searchQuery, setSearchQuery] = useState("");

  const stats = {
    total: speakers.length,
    expertiseDiversity: new Set(
      speakers.map((s) => s.expertise?.trim()).filter(Boolean),
    ).size,
    bioDensity: Math.round(
      (speakers.filter((s) => s.bio?.length > 20).length /
        (speakers.length || 1)) *
        100,
    ),
    connectivityIndex: Math.round(
      (speakers.filter(
        (s) => s.social_links?.linkedin || s.social_links?.twitter,
      ).length /
        (speakers.length || 1)) *
        100,
    ),
  };

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const fetchSpeakers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/speakers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setSpeakers(data.speakers);
    } catch (error) {
      console.error("Error fetching speakers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = currentSpeaker
        ? `http://localhost:5000/api/admin/speakers/${currentSpeaker._id}`
        : "http://localhost:5000/api/admin/speakers";

      const method = currentSpeaker ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save speaker");

      setIsDataDialogOpen(false);
      fetchSpeakers();
      resetForm();
    } catch (error) {
      console.error("Error saving speaker:", error);
      alert("Failed to save speaker");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this speaker?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/admin/speakers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSpeakers();
    } catch (error) {
      console.error("Error deleting speaker:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      expertise: "",
      bio: "",
      social_links: { linkedin: "", twitter: "", website: "" },
    });
    setCurrentSpeaker(null);
  };

  const openEdit = (speaker) => {
    setCurrentSpeaker(speaker);
    setFormData({
      name: speaker.name,
      expertise: speaker.expertise,
      bio: speaker.bio,
      social_links: speaker.social_links || {
        linkedin: "",
        twitter: "",
        website: "",
      },
    });
    setIsDataDialogOpen(true);
  };

  const filteredSpeakers = speakers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.expertise?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-starlight/60 hover:text-starlight hover:bg-white/5 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-starlight to-starlight/60">
              Speaker Command Center
            </h1>
            <p className="text-starlight/40 text-sm">
              Manage event speakers and specialized talent registry.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSpeakers}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-sm text-starlight/70 hover:text-white transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => {
              resetForm();
              setIsDataDialogOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-500 shadow-lg shadow-violet-600/20 transition-all"
          >
            <Plus size={18} />
            <span>Add Talent</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Talent Identity"
          value={stats.total}
          icon={Users}
          color="text-violet-400"
          bg="bg-violet-400/10"
          border="border-violet-400/20"
        />
        <KpiCard
          label="Expertise Diversity"
          value={stats.expertiseDiversity}
          icon={Zap}
          color="text-amber-400"
          bg="bg-amber-400/10"
          border="border-amber-400/20"
        />
        <KpiCard
          label="Registry Integrity"
          value={`${stats.bioDensity}%`}
          icon={ShieldCheck}
          color="text-emerald-400"
          bg="bg-emerald-400/10"
          border="border-emerald-400/20"
        />
        <KpiCard
          label="Connectivity Index"
          value={`${stats.connectivityIndex}%`}
          icon={Sparkles}
          color="text-cyan-400"
          bg="bg-cyan-400/10"
          border="border-cyan-400/20"
        />
      </div>

      {/* 3. Control Bar Section */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-starlight/20"
          />
          <input
            type="text"
            placeholder="Search by name or expertise area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#050505]/40 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-starlight focus:outline-none focus:border-violet-500/50 transition-all placeholder:text-starlight/10"
          />
        </div>
      </div>

      {/* 4. Registry Implementation */}
      {loading ? (
        <div className="h-64 flex items-center justify-center rounded-3xl border border-white/5 glass-panel">
          <RefreshCw className="text-violet-500 animate-spin mr-3" size={24} />
          <span className="text-starlight/40 font-bold uppercase tracking-widest text-xs">
            Synchronizing Registry...
          </span>
        </div>
      ) : filteredSpeakers.length === 0 ? (
        <div className="p-20 text-center flex flex-col items-center justify-center text-starlight/40 border border-white/5 rounded-3xl glass-panel bg-white/[0.01]">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
            <Mic2 size={32} className="text-starlight/20" />
          </div>
          <p className="text-xl font-bold text-starlight mb-2">
            No Talent Records Found
          </p>
          <p className="text-sm max-w-xs text-starlight/30 uppercase tracking-widest font-bold">
            Try adjusting your search filters or add a new speaker.
          </p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="px-6 py-5 text-[10px] font-black text-starlight/20 uppercase tracking-[0.2em]">
                    Name & Identity
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-starlight/20 uppercase tracking-[0.2em]">
                    Primary Expertise
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-starlight/20 uppercase tracking-[0.2em]">
                    Bio Snapshot
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-starlight/20 uppercase tracking-[0.2em]">
                    Social Pulse
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-starlight/20 uppercase tracking-[0.2em]">
                    Management
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {filteredSpeakers.map((speaker) => (
                  <tr
                    key={speaker._id}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-600/20 flex items-center justify-center text-violet-400 font-bold">
                          <Mic2 size={18} />
                        </div>
                        <div>
                          <p className="text-starlight font-bold text-sm tracking-tight">
                            {speaker.name}
                          </p>
                          <p className="text-[10px] font-mono text-starlight/20 uppercase truncate max-w-[120px]">
                            {speaker._id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 rounded-lg bg-violet-500/5 border border-violet-500/10 text-violet-300 text-[10px] font-black uppercase tracking-widest">
                        {speaker.expertise || "Generalist"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-starlight/40 text-xs line-clamp-1 max-w-[200px]">
                        {speaker.bio || "No biography provided."}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {speaker.social_links?.linkedin ? (
                          <a
                            href={speaker.social_links.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="w-8 h-8 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-all"
                          >
                            <Linkedin size={14} />
                          </a>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-starlight/10">
                            <Linkedin size={14} />
                          </div>
                        )}
                        {speaker.social_links?.twitter ? (
                          <a
                            href={speaker.social_links.twitter}
                            target="_blank"
                            rel="noreferrer"
                            className="w-8 h-8 rounded-lg bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 transition-all"
                          >
                            <Twitter size={14} />
                          </a>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-starlight/10">
                            <Twitter size={14} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(speaker)}
                          className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-starlight/40 hover:text-blue-400 hover:bg-white/5 transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(speaker._id)}
                          className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-starlight/40 hover:text-rose-400 hover:bg-white/5 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Enhanced Operational Dialog */}
      <Dialog open={isDataDialogOpen} onOpenChange={setIsDataDialogOpen}>
        <DialogContent className="bg-[#050505]/95 backdrop-blur-2xl border-white/10 text-starlight max-w-2xl rounded-3xl p-0 overflow-hidden shadow-2xl">
          <div className="relative h-32 bg-gradient-to-br from-violet-600/20 to-cyan-500/20 border-b border-white/10 flex items-end p-8">
            <div className="absolute top-4 right-4 text-violet-500/20">
              <Mic2 size={80} />
            </div>
            <div className="relative z-10">
              <DialogTitle className="text-2xl font-black tracking-tight uppercase">
                {currentSpeaker
                  ? "Edit Talent Record"
                  : "New Talent Onboarding"}
              </DialogTitle>
              <p className="text-[10px] font-black text-starlight/40 uppercase tracking-widest mt-1">
                Registry Management & Identity Provisioning
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-starlight/20 uppercase tracking-widest">
                  Full Identity Name
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Dr. John Doe"
                  className="bg-white/5 border-white/5 rounded-xl h-12 text-sm focus:border-violet-500/50 transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-starlight/20 uppercase tracking-widest">
                  Field of Expertise
                </Label>
                <Input
                  value={formData.expertise}
                  onChange={(e) =>
                    setFormData({ ...formData, expertise: e.target.value })
                  }
                  placeholder="AI Researcher / Keynote Speaker"
                  className="bg-white/5 border-white/5 rounded-xl h-12 text-sm focus:border-violet-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-starlight/20 uppercase tracking-widest">
                Professional Biography
              </Label>
              <Textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Brief professional overview for promotional use..."
                className="bg-white/5 border-white/5 rounded-xl min-h-[120px] text-sm focus:border-violet-500/50 transition-all leading-relaxed p-4"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-starlight/20 uppercase tracking-widest">
                  LinkedIn Profile URL
                </Label>
                <Input
                  value={formData.social_links.linkedin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      social_links: {
                        ...formData.social_links,
                        linkedin: e.target.value,
                      },
                    })
                  }
                  placeholder="https://linkedin.com/in/..."
                  className="bg-white/5 border-white/5 rounded-xl h-12 text-sm focus:border-violet-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-starlight/20 uppercase tracking-widest">
                  Twitter / X Handle
                </Label>
                <Input
                  value={formData.social_links.twitter}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      social_links: {
                        ...formData.social_links,
                        twitter: e.target.value,
                      },
                    })
                  }
                  placeholder="https://x.com/..."
                  className="bg-white/5 border-white/5 rounded-xl h-12 text-sm focus:border-violet-500/50 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
              <button
                type="button"
                onClick={() => setIsDataDialogOpen(false)}
                className="px-6 py-2.5 rounded-xl hover:bg-white/5 text-starlight/40 font-bold uppercase tracking-widest text-[10px] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-violet-500/20"
              >
                {currentSpeaker ? "Sync Record" : "Board Talent"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpeakersList;
