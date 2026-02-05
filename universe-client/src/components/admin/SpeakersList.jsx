import React, { useState, useEffect, useCallback } from "react"; // Fixed imports
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
  TrendingUp,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const KpiCard = ({
  title,
  value,
  icon: Icon,
  color,
  subValue,
  trend,
  description,
}) => (
  <div className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-sm">
    <div
      className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}
    >
      {Icon && <Icon size={80} />}
    </div>
    <div className="relative z-10 flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-starlight/60 text-xs font-bold uppercase tracking-wider mb-1">
            {title}
          </h3>
          <div className="text-3xl font-bold text-starlight tracking-tight leading-none">
            {value}
          </div>
        </div>
        <div className={`p-2 rounded-xl bg-white/5 ${color} shrink-0`}>
          {Icon && <Icon size={18} />}
        </div>
      </div>
      {(subValue || trend || description) && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 mt-1">
            {trend && <TrendingUp size={10} className="text-emerald-400" />}
            <span className={`text-[10px] font-medium ${color}`}>
              {subValue}
            </span>
          </div>
          {description && (
            <p className="text-[10px] text-starlight/60 mt-2 font-medium leading-relaxed italic border-t border-white/5 pt-2">
              {description}
            </p>
          )}
        </div>
      )}
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
    role: "Guest Speaker",
    expertise: "",
    category: "Other",
    bio: "",
    about: "",
    social_links: { linkedin: "", twitter: "", website: "" },
    achievements: "", // String for input, will parse to array
    upcoming: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [proposalFile, setProposalFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const fetchSpeakers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(
        `http://localhost:5000/api/admin/speakers?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      setSpeakers(data.speakers || []);
      if (data.pagination) setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching speakers:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchQuery]);

  useEffect(() => {
    fetchSpeakers();
  }, [fetchSpeakers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = currentSpeaker
        ? `http://localhost:5000/api/admin/speakers/${currentSpeaker._id}`
        : "http://localhost:5000/api/admin/speakers";

      const method = currentSpeaker ? "PUT" : "POST";

      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "social_links" || key === "achievements") {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      if (imageFile) submitData.append("image", imageFile);
      if (proposalFile) submitData.append("proposal", proposalFile);

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      });

      if (!response.ok) throw new Error("Failed to save speaker");

      setIsDataDialogOpen(false);
      fetchSpeakers();
      resetForm();
      toast.success("Speaker saved successfully");
    } catch (error) {
      console.error("Error saving speaker:", error);
      toast.error("Failed to save speaker");
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
      role: "Guest Speaker",
      expertise: "",
      category: "Other",
      bio: "",
      about: "",
      social_links: { linkedin: "", twitter: "", website: "" },
      achievements: "",
      upcoming: "",
    });
    setImageFile(null);
    setImagePreview(null);
    setProposalFile(null);
    setCurrentSpeaker(null);
  };

  const openEdit = (speaker) => {
    setCurrentSpeaker(speaker);
    setFormData({
      name: speaker.name || "",
      role: speaker.role || "Guest Speaker",
      expertise: speaker.expertise || "",
      category: speaker.category || "Other",
      bio: speaker.bio || "",
      about: speaker.about || "",
      social_links: speaker.social_links || {
        linkedin: "",
        twitter: "",
        website: "",
      },
      achievements: speaker.achievements
        ? Array.isArray(speaker.achievements)
          ? speaker.achievements.join(", ")
          : speaker.achievements
        : "",
      upcoming: speaker.upcoming || "",
    });
    setImageFile(null);
    setImagePreview(null);
    setIsDataDialogOpen(true);
  };

  // Search is now handled by API
  const filteredSpeakers = speakers;

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
          title="Total Talent Ident"
          value={stats.total}
          icon={Users}
          color="text-violet-400"
          subValue="Industry experts"
          description="Total number of speakers and experts registered in the platform talent pool."
        />
        <KpiCard
          title="Expertise Diversity"
          value={stats.expertiseDiversity}
          icon={Zap}
          color="text-amber-400"
          subValue="Knowledge velocity"
          description="Count of unique professional expertise areas covered by current speakers."
        />
        <KpiCard
          title="Registry Integrity"
          value={`${stats.bioDensity}%`}
          icon={ShieldCheck}
          color="text-emerald-400"
          subValue="Portfolio verified"
          description="System measurement of profile completeness and biography detail density."
        />
        <KpiCard
          title="Connectivity Index"
          value={`${stats.connectivityIndex}%`}
          icon={Sparkles}
          color="text-cyan-400"
          subValue="Social reach"
          description="Percentage of talent profiles with verified social media and web presence."
        />
      </div>

      {/* 3. Control Bar Section */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-starlight/60"
          />
          <input
            type="text"
            placeholder="Search by name or expertise area..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#050505]/40 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-starlight focus:outline-none focus:border-violet-500/50 transition-all placeholder:text-starlight/10 font-bold text-xs"
          />
        </div>

        <div className="flex items-center gap-2 border-l border-white/5 pl-4">
          <span className="text-xs font-bold text-starlight/40 uppercase tracking-widest whitespace-nowrap">
            Limit:
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-sm text-starlight focus:outline-none focus:border-violet-500/50 cursor-pointer font-bold text-xs"
          >
            <option value={10}>10 Entries</option>
            <option value={25}>25 Entries</option>
            <option value={50}>50 Entries</option>
            <option value={100}>100 Entries</option>
          </select>
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
            <Mic2 size={32} className="text-starlight/60" />
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
                  <th className="px-6 py-5 text-[10px] font-black text-starlight/60 uppercase tracking-[0.2em]">
                    Name & Identity
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-starlight/60 uppercase tracking-[0.2em]">
                    Primary Expertise
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-starlight/60 uppercase tracking-[0.2em]">
                    Bio Snapshot
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-starlight/60 uppercase tracking-[0.2em]">
                    Social Pulse
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-starlight/60 uppercase tracking-[0.2em]">
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
                          <p className="text-[10px] font-mono text-starlight/60 uppercase truncate max-w-[120px]">
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
                      <div className="flex justify-start">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 rounded-xl bg-white/5 text-starlight/40 hover:text-white hover:bg-white/10 transition-all">
                              <MoreVertical size={18} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 glass-panel border-white/10"
                          >
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-starlight/40">
                              Talent Ops
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/5" />
                            <DropdownMenuItem
                              onClick={() => openEdit(speaker)}
                              className="flex items-center gap-2 p-3 text-starlight hover:bg-white/5 cursor-pointer rounded-lg transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                <Edit2 size={16} />
                              </div>
                              <span className="font-bold text-xs">
                                Sync Record
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(speaker._id)}
                              className="flex items-center gap-2 p-3 text-rose-400 hover:bg-rose-600/10 cursor-pointer rounded-lg transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-rose-600/10 flex items-center justify-center text-rose-400 group-hover:bg-rose-600 group-hover:text-white transition-all">
                                <Trash2 size={16} />
                              </div>
                              <span className="font-bold text-xs">
                                Terminate Talent
                              </span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-white/5 bg-white/[0.01]">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-starlight/60 hover:text-starlight hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-xs font-medium text-starlight/40 font-jakarta uppercase tracking-widest">
              Page <span className="text-starlight">{currentPage}</span> of{" "}
              {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-starlight/60 hover:text-starlight hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* 5. Enhanced Operational Dialog */}
      <Dialog open={isDataDialogOpen} onOpenChange={setIsDataDialogOpen}>
        <DialogContent className="max-w-3xl bg-[#050505] border-white/10 p-0 overflow-hidden shadow-2xl rounded-3xl max-h-[90vh] flex flex-col">
          {/* Header Section - Fixed at Top */}
          <div className="relative flex-shrink-0 h-32 bg-gradient-to-br from-violet-600/20 to-cyan-500/20 border-b border-white/10 flex items-end p-8">
            <div className="absolute top-4 right-4 text-violet-500/20">
              <Mic2 size={80} />
            </div>
            <div className="relative z-10 w-full">
              <DialogTitle className="text-2xl font-black tracking-tight uppercase text-starlight">
                {currentSpeaker
                  ? "Edit Talent Record"
                  : "New Talent Onboarding"}
              </DialogTitle>
              <p className="text-[10px] font-black text-starlight/40 uppercase tracking-widest mt-1">
                Registry Management & Identity Provisioning
              </p>
            </div>
          </div>

          {/* Form Container - Content Scrolls, Footer Fixed */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-starlight/60 uppercase tracking-widest">
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
                  <Label className="text-[10px] font-black text-starlight/60 uppercase tracking-widest">
                    Professional Role
                  </Label>
                  <Input
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    placeholder="Astrophysicist"
                    className="bg-white/5 border-white/5 rounded-xl h-12 text-sm focus:border-violet-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-starlight/60 uppercase tracking-widest">
                    Primary Expertise
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
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-starlight/60 uppercase tracking-widest">
                    Category
                  </Label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-white/5 border-white/5 rounded-xl h-12 px-4 text-sm text-starlight focus:outline-none focus:border-violet-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="Science">Science</option>
                    <option value="Tech">Tech</option>
                    <option value="Arts">Arts</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-starlight/60 uppercase tracking-widest">
                    Short Bio (Prompt Box)
                  </Label>
                  <Input
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder="Brief 1-liner for cards"
                    className="bg-white/5 border-white/5 rounded-xl h-12 text-sm focus:border-violet-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-starlight/60 uppercase tracking-widest">
                    Upcoming Feature
                  </Label>
                  <Input
                    value={formData.upcoming}
                    onChange={(e) =>
                      setFormData({ ...formData, upcoming: e.target.value })
                    }
                    placeholder="Title of next talk..."
                    className="bg-white/5 border-white/5 rounded-xl h-12 text-sm focus:border-violet-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-starlight/60 uppercase tracking-widest">
                  Extended Biography (Detailed)
                </Label>
                <Textarea
                  value={formData.about}
                  onChange={(e) =>
                    setFormData({ ...formData, about: e.target.value })
                  }
                  placeholder="Full professional background and story..."
                  className="bg-white/5 border-white/5 rounded-xl min-h-[100px] text-sm focus:border-violet-500/50 transition-all leading-relaxed p-4"
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-starlight/60 uppercase tracking-widest">
                    LinkedIn URL
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
                    className="bg-white/5 border-white/5 rounded-xl h-10 text-xs focus:border-violet-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-starlight/60 uppercase tracking-widest">
                    Twitter / X
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
                    className="bg-white/5 border-white/5 rounded-xl h-10 text-xs focus:border-violet-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-starlight/60 uppercase tracking-widest">
                    Website / Portfolio
                  </Label>
                  <Input
                    value={formData.social_links.website}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        social_links: {
                          ...formData.social_links,
                          website: e.target.value,
                        },
                      })
                    }
                    placeholder="https://..."
                    className="bg-white/5 border-white/5 rounded-xl h-10 text-xs focus:border-violet-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-starlight/60 uppercase tracking-widest">
                  Key Achievements (Comma separated)
                </Label>
                <Input
                  value={formData.achievements}
                  onChange={(e) =>
                    setFormData({ ...formData, achievements: e.target.value })
                  }
                  placeholder="Nobel Prize Nominee, TEDx Speaker, Published Author..."
                  className="bg-white/5 border-white/5 rounded-xl h-12 text-sm focus:border-violet-500/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-starlight/60 uppercase tracking-widest">
                    Profile Image
                  </Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setImageFile(file);
                      if (file) setImagePreview(URL.createObjectURL(file));
                      else setImagePreview(null);
                    }}
                    className="bg-white/5 border-white/5 focus:border-violet-500/50 h-10 text-xs rounded-xl file:bg-violet-600 file:text-white file:border-none file:rounded-lg file:px-2 file:py-1 file:mr-4 file:text-xs file:font-bold hover:file:bg-violet-500 cursor-pointer pt-2"
                  />
                  {imagePreview && (
                    <p className="text-[9px] text-violet-400 font-bold uppercase tracking-widest mt-1">
                      Talent Identity Preview Active
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-starlight/60 uppercase tracking-widest">
                    Proposal Document (PDF)
                  </Label>
                  <Input
                    type="file"
                    accept=".pdf, .doc, .docx"
                    onChange={(e) => setProposalFile(e.target.files[0])}
                    className="bg-white/5 border-white/5 rounded-xl h-12 text-sm focus:border-violet-500/50 transition-all file:bg-violet-600 file:text-white file:border-none file:rounded-lg file:px-2 file:py-1 file:mr-4 file:text-xs file:font-bold hover:file:bg-violet-500 cursor-pointer pt-2"
                  />
                </div>
              </div>

              {currentSpeaker && (
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-starlight/60 uppercase tracking-widest">
                    Verification Status
                  </Label>
                  <select
                    value={formData.status || "pending"}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full bg-white/5 border-white/5 rounded-xl h-12 px-4 text-sm text-starlight focus:outline-none focus:border-violet-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex-shrink-0 flex justify-end gap-3 p-6 border-t border-white/5 bg-zinc-950/80 backdrop-blur-xl">
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
