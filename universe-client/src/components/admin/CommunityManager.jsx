import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Search,
  Grid,
  ShieldCheck,
  ShieldAlert,
  Rocket,
  RefreshCw,
  Filter,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Layers,
  AtSign,
  Briefcase,
  User as UserIcon,
  Globe,
  MoreVertical,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { downloadCSV } from "@/lib/exportUtils";
import { FileText } from "lucide-react";

const API_BASE = "http://localhost:5000";

/**
 * Intelligence Card Component
 */
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

const CommunityManager = () => {
  const [communities, setCommunities] = useState([]);
  const [users, setUsers] = useState([]); // For owner selection
  const [stats, setStats] = useState({ total: 0, verified: 0, unverified: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCommunity, setCurrentCommunity] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    category: "Community",
    advisor: { name: "", title: "Club Advisor", email: "" },
    owner_id: "",
    is_verified: true,
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  useEffect(() => {
    fetchCommunities();
    fetchUsers();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/admin/communities",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      setCommunities(data.communities || []);
      setStats(data.stats || { total: 0, verified: 0, unverified: 0 });
    } catch (error) {
      console.error("Error fetching communities:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/admin/users?limit=1000",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      tagline: "",
      description: "",
      category: "Community",
      advisor: { name: "", title: "Club Advisor", email: "" },
      owner_id: "",
      is_verified: true,
    });
    setLogoFile(null);
    setLogoPreview(null);
    setBannerFile(null);
    setBannerPreview(null);
    setCurrentCommunity(null);
  };

  const openEdit = (comm) => {
    setCurrentCommunity(comm);
    setFormData({
      name: comm.name,
      slug: comm.slug,
      tagline: comm.tagline || "",
      description: comm.description,
      category: comm.category,
      advisor: comm.advisor || { name: "", title: "Club Advisor", email: "" },
      owner_id: comm.owner_id?._id || comm.owner_id || "",
      is_verified: comm.is_verified,
    });
    setLogoFile(null);
    setLogoPreview(null);
    setBannerFile(null);
    setBannerPreview(null);
    setIsDialogOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = currentCommunity
        ? `http://localhost:5000/api/admin/communities/${currentCommunity._id}`
        : "http://localhost:5000/api/admin/communities";

      const submissionData = new FormData();

      // Append basic fields
      submissionData.append("name", formData.name);
      submissionData.append("slug", formData.slug);
      submissionData.append("tagline", formData.tagline);
      submissionData.append("description", formData.description);
      submissionData.append("category", formData.category);
      submissionData.append("owner_id", formData.owner_id);
      submissionData.append("is_verified", formData.is_verified);

      // Append complex objects as JSON strings
      submissionData.append("advisor", JSON.stringify(formData.advisor));

      // Append files
      if (logoFile) submissionData.append("logo", logoFile);
      if (bannerFile) submissionData.append("banner", bannerFile);

      const response = await fetch(url, {
        method: currentCommunity ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submissionData,
      });

      if (response.ok) {
        fetchCommunities();
        setIsDialogOpen(false);
        toast.success("Community saved successfully");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to save community");
      }
    } catch (error) {
      console.error("Error saving community:", error);
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        "Are you sure? This will permanently de-register this society from the system.",
      )
    )
      return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/communities/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        fetchCommunities();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete community");
      }
    } catch (error) {
      console.error("Error deleting community:", error);
    }
  };

  const filteredCommunities = communities.filter((comm) => {
    const matchesSearch =
      comm.name.toLowerCase().includes(search.toLowerCase()) ||
      (comm.description &&
        comm.description.toLowerCase().includes(search.toLowerCase())) ||
      comm.slug.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || comm.category === categoryFilter;

    const matchesVerification =
      verificationFilter === "all" ||
      (verificationFilter === "verified" && comm.is_verified) ||
      (verificationFilter === "unverified" && !comm.is_verified);

    return matchesSearch && matchesCategory && matchesVerification;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-jakarta">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-starlight to-starlight/60">
            Society Command Center
          </h1>
          <p className="text-starlight/40 text-sm font-medium">
            Manage campus clubs, societies, and authoritative community bodies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 border-dashed border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-100 h-10"
            onClick={() => {
              const exportData = filteredCommunities.map((comm) => ({
                Name: comm.name,
                Category: comm.category,
                Verified: comm.is_verified ? "Yes" : "No",
                Members: comm.memberCount || 0,
                Slug: comm.slug,
              }));
              downloadCSV(exportData, "communities_report");
            }}
          >
            <FileText className="h-4 w-4" />
            Export CSV
          </Button>
          <button
            onClick={fetchCommunities}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-sm text-starlight/70 hover:text-white transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-all shadow-lg shadow-violet-500/20"
          >
            <Plus size={18} /> <span>Add Society</span>
          </button>
        </div>
      </div>

      {/* 2. Intelligence Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Society Registry"
          value={stats.total}
          icon={Layers}
          color="text-violet-400"
          subValue="Total active bodies"
          description="Total count of all registered societies and clubs within the campus ecosystem."
        />
        <KpiCard
          title="Verified Status"
          value={stats.verified}
          icon={ShieldCheck}
          color="text-emerald-400"
          subValue="Authorized & Verified"
          description="Communities that have been vetted and granted official broadcasting permissions."
        />
        <KpiCard
          title="Pending Verification"
          value={stats.unverified}
          icon={ShieldAlert}
          color="text-amber-400"
          subValue="Requires review"
          description="Societies awaiting official verification from the Student Affairs department."
        />
        <KpiCard
          title="Community Reach"
          value={communities.reduce((acc, c) => acc + (c.eventCount || 0), 0)}
          icon={TrendingUp}
          color="text-cyan-400"
          subValue="Total aggregate events"
          trend={true}
          description="Cumulative number of events organized by all registered communities."
        />
      </div>

      {/* 3. Filter Matrix */}
      <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-starlight/60"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by name, slug or mission..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl pl-12 pr-4 py-2.5 text-sm text-starlight focus:outline-none focus:border-violet-500/50 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 bg-black/40 border border-white/5 rounded-xl h-10">
              <Filter size={14} className="text-starlight/60" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent text-xs text-starlight/60 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-[#0A0A0A]">
                  All Categories
                </option>
                <option value="Academic" className="bg-[#0A0A0A]">
                  Academic
                </option>
                <option value="Leadership" className="bg-[#0A0A0A]">
                  Leadership
                </option>
                <option value="Uniformed" className="bg-[#0A0A0A]">
                  Uniformed
                </option>
                <option value="Creative" className="bg-[#0A0A0A]">
                  Creative
                </option>
                <option value="Lifestyle" className="bg-[#0A0A0A]">
                  Lifestyle
                </option>
                <option value="Community" className="bg-[#0A0A0A]">
                  Community
                </option>
              </select>
            </div>

            <div className="flex items-center gap-2 px-3 bg-black/40 border border-white/5 rounded-xl h-10">
              <ShieldCheck size={14} className="text-starlight/60" />
              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                className="bg-transparent text-xs text-starlight/60 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-[#0A0A0A]">
                  All Status
                </option>
                <option value="verified" className="bg-[#0A0A0A]">
                  Verified Only
                </option>
                <option value="unverified" className="bg-[#0A0A0A]">
                  Unverified
                </option>
              </select>
            </div>

            <div className="flex items-center gap-2 border-l border-white/5 pl-4">
              <span className="text-xs font-bold text-starlight/40 uppercase tracking-widest whitespace-nowrap">
                Per Page:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-xs text-starlight focus:outline-none focus:border-violet-500/50 cursor-pointer font-bold"
              >
                <option value={10}>10 Entries</option>
                <option value={25}>25 Entries</option>
                <option value={50}>50 Entries</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-20 text-center glass-panel rounded-2xl border border-white/5">
            <RefreshCw
              size={32}
              className="mx-auto text-violet-500/20 animate-spin mb-4"
            />
            <p className="text-starlight/40 font-bold uppercase tracking-widest text-[10px]">
              Querying Society Database...
            </p>
          </div>
        ) : filteredCommunities.length === 0 ? (
          <div className="col-span-full py-20 text-center glass-panel rounded-2xl border border-white/5">
            <AlertCircle size={32} className="mx-auto text-starlight/10 mb-4" />
            <p className="text-starlight/40 font-bold uppercase tracking-widest text-[10px]">
              No communities match your tactical criteria
            </p>
          </div>
        ) : (
          filteredCommunities
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((comm) => (
              <div
                key={comm._id}
                className={`glass-panel p-5 rounded-2xl group border ${comm.is_verified ? "border-white/5" : "border-amber-500/20"} hover:border-violet-500/30 transition-all relative overflow-hidden`}
              >
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-cover bg-center border border-white/10"
                    style={{
                      backgroundImage: comm.logo
                        ? `url(${comm.logo.startsWith("http") ? comm.logo : `${API_BASE}${comm.logo}`})`
                        : "none",
                    }}
                  >
                    {!comm.logo && !logoPreview && (
                      <Rocket size={24} className="text-violet-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded-lg bg-white/5 text-starlight/40 hover:text-white hover:bg-white/10 transition-all">
                          <MoreVertical size={16} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 glass-panel border-white/10"
                      >
                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-starlight/40">
                          Society Action
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem
                          onClick={() => openEdit(comm)}
                          className="flex items-center gap-2 p-2.5 text-starlight hover:bg-white/5 cursor-pointer rounded-lg transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-violet-600/10 flex items-center justify-center text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-all">
                            <Edit2 size={14} />
                          </div>
                          <span className="font-bold text-xs">Edit Logic</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(comm._id)}
                          className="flex items-center gap-2 p-2.5 text-rose-400 hover:bg-rose-600/10 cursor-pointer rounded-lg transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-rose-600/10 flex items-center justify-center text-rose-400 group-hover:bg-rose-600 group-hover:text-white transition-all">
                            <Trash2 size={14} />
                          </div>
                          <span className="font-bold text-xs">
                            Terminate Body
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-starlight tracking-tight truncate max-w-[180px]">
                      {comm.name}
                    </h3>
                    {comm.is_verified ? (
                      <ShieldCheck size={14} className="text-emerald-400" />
                    ) : (
                      <ShieldAlert size={14} className="text-amber-400" />
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-starlight/40 mb-3 tracking-tighter uppercase">
                    /{comm.slug} • {comm.category}
                  </p>

                  <p className="text-xs text-starlight/40 line-clamp-2 h-8 mb-4">
                    {comm.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1.5">
                      <UserIcon size={12} className="text-violet-400" />
                      <div className="flex flex-col">
                        <span className="text-[9px] text-starlight/30 uppercase font-black tracking-widest">
                          President
                        </span>
                        <span className="text-[10px] text-starlight font-bold truncate max-w-[80px]">
                          {comm.owner_id?.name || "Unassigned"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BarChart3 size={12} className="text-cyan-400" />
                      <div className="flex flex-col">
                        <span className="text-[9px] text-starlight/30 uppercase font-black tracking-widest">
                          Impact
                        </span>
                        <span className="text-[10px] text-starlight font-bold">
                          {comm.eventCount} Events
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Background ID indicator */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[100px] font-black opacity-[0.02] pointer-events-none select-none">
                  {comm.slug.substring(0, 2).toUpperCase()}
                </div>
              </div>
            ))
        )}
      </div>

      {/* Pagination Controls */}
      {filteredCommunities.length > 0 && (
        <div className="flex items-center justify-between p-4 border border-white/5 rounded-3xl bg-white/[0.01] mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-starlight/60 hover:text-starlight hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-xs font-medium text-starlight/40 font-jakarta uppercase tracking-widest">
            Page <span className="text-starlight">{currentPage}</span> of{" "}
            {Math.ceil(filteredCommunities.length / itemsPerPage)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(
                  Math.ceil(filteredCommunities.length / itemsPerPage),
                  p + 1,
                ),
              )
            }
            disabled={
              currentPage ===
              Math.ceil(filteredCommunities.length / itemsPerPage)
            }
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-starlight/60 hover:text-starlight hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Editor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#0b0b0f] border-white/10 text-starlight max-w-2xl rounded-2xl overflow-hidden p-0">
          <div className="h-28 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 px-8 flex items-center justify-between border-b border-white/5">
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight uppercase">
                {currentCommunity ? "Refine Society" : "Register Society"}
              </DialogTitle>
              <p className="text-[10px] font-medium text-starlight/40 opacity-80 uppercase tracking-widest mt-1">
                Authoritative Body Configuration
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
              <Rocket size={24} className="text-violet-400" />
            </div>
          </div>

          <form
            onSubmit={handleSave}
            className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-starlight/30">
                  Official Name
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Google Developer Student Clubs"
                  className="bg-white/5 border-white/5 focus:border-violet-500/50 rounded-xl h-12 text-sm transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-starlight/30">
                  Identity Slug
                </Label>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: e.target.value.toLowerCase().replace(/ /g, "-"),
                    })
                  }
                  placeholder="e.g. gdsc-uitm"
                  className="bg-white/5 border-white/5 focus:border-violet-500/50 rounded-xl h-12 text-sm transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-starlight/30">
                Tagline / Mission Brief
              </Label>
              <Input
                value={formData.tagline}
                onChange={(e) =>
                  setFormData({ ...formData, tagline: e.target.value })
                }
                placeholder="Empowering students through technology..."
                className="bg-white/5 border-white/5 focus:border-violet-500/50 rounded-xl h-11 text-sm transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-starlight/30">
                Full Description
              </Label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-starlight focus:outline-none focus:border-violet-500/50 transition-all min-h-[100px]"
                placeholder="Provide a comprehensive mission statement..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-starlight/30">
                  Category Axis
                </Label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/5 rounded-xl h-12 px-4 text-sm text-starlight focus:outline-none focus:border-violet-500/50 transition-all font-bold"
                >
                  <option value="Academic">Academic</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Uniformed">Uniformed</option>
                  <option value="Creative">Creative</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Community">Community</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-starlight/30">
                  Society President (Owner)
                </Label>
                <select
                  value={formData.owner_id}
                  onChange={(e) =>
                    setFormData({ ...formData, owner_id: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/5 rounded-xl h-12 px-4 text-sm text-starlight focus:outline-none focus:border-violet-500/50 transition-all font-bold"
                  required
                >
                  <option value="">Select a user...</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.student_id || u.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-starlight/30">
                  Society Logo
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setLogoFile(file);
                    if (file) setLogoPreview(URL.createObjectURL(file));
                    else setLogoPreview(null);
                  }}
                  className="bg-white/5 border-white/5 focus:border-violet-500/50 rounded-xl h-12 text-sm transition-all file:bg-violet-600 file:text-white file:border-none file:rounded-lg file:px-2 file:py-1 file:mr-4 file:text-xs file:font-bold hover:file:bg-violet-500 cursor-pointer pt-2"
                />
                {(logoPreview ||
                  (currentCommunity && currentCommunity.logo)) && (
                  <div className="mt-2 relative group w-16 h-16">
                    <img
                      src={
                        logoPreview ||
                        (currentCommunity.logo.startsWith("http")
                          ? currentCommunity.logo
                          : `${API_BASE}${currentCommunity.logo}`)
                      }
                      className="w-full h-full object-cover rounded-lg border border-white/10"
                      alt="Logo Preview"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                      <CheckCircle size={16} className="text-emerald-400" />
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-starlight/30">
                  Society Banner
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setBannerFile(file);
                    if (file) setBannerPreview(URL.createObjectURL(file));
                    else setBannerPreview(null);
                  }}
                  className="bg-white/5 border-white/5 focus:border-violet-500/50 rounded-xl h-12 text-sm transition-all file:bg-violet-600 file:text-white file:border-none file:rounded-lg file:px-2 file:py-1 file:mr-4 file:text-xs file:font-bold hover:file:bg-violet-500 cursor-pointer pt-2"
                />
                {(bannerPreview ||
                  (currentCommunity && currentCommunity.banner)) && (
                  <div className="mt-2 relative group w-full h-24">
                    <img
                      src={
                        bannerPreview ||
                        (currentCommunity.banner.startsWith("http")
                          ? currentCommunity.banner
                          : `${API_BASE}${currentCommunity.banner}`)
                      }
                      className="w-full h-full object-contain bg-black/20 rounded-lg border border-white/10"
                      alt="Banner Preview"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                      <CheckCircle size={16} className="text-emerald-400" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-violet-400">
                Advisor Intelligence
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[8px] font-black uppercase tracking-widest text-starlight/30">
                    Full Name
                  </Label>
                  <Input
                    value={formData.advisor.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        advisor: { ...formData.advisor, name: e.target.value },
                      })
                    }
                    className="bg-white/5 border-white/5 h-10 text-xs rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[8px] font-black uppercase tracking-widest text-starlight/30">
                    Formal Title
                  </Label>
                  <Input
                    value={formData.advisor.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        advisor: { ...formData.advisor, title: e.target.value },
                      })
                    }
                    className="bg-white/5 border-white/5 h-10 text-xs rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-violet-600/5 border border-violet-500/10">
              <div className="flex items-center gap-3">
                <ShieldCheck
                  className={
                    formData.is_verified
                      ? "text-emerald-400"
                      : "text-starlight/20"
                  }
                />
                <div>
                  <p className="text-xs font-bold text-starlight leading-none">
                    Official Verification
                  </p>
                  <p className="text-[9px] text-starlight/40 uppercase tracking-widest mt-1">
                    Grants authority to host major events
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    is_verified: !formData.is_verified,
                  })
                }
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.is_verified ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-white/5 text-starlight/40 hover:text-white"}`}
              >
                {formData.is_verified ? "Verified" : "Verify Now"}
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="px-6 py-3 rounded-xl hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest text-starlight/40 transition-colors"
              >
                Abort Action
              </button>
              <button
                type="submit"
                className="px-10 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-500/20 border border-violet-500/30"
              >
                {currentCommunity ? "Update Body" : "Deploy Society"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunityManager;
