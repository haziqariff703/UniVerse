import React, { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Search,
  Grid,
  Hash,
  Palette,
  Layout,
  RefreshCw,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Layers,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadCSV } from "@/lib/exportUtils";
import { FileText } from "lucide-react";

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

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [usageFilter, setUsageFilter] = useState("all"); // Extra filter: High Usage, Low Usage, Unused
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#8b5cf6",
    icon: "Tag",
    is_active: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/admin/categories",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      setCategories(data.categories || []);
      setStats(data.stats || { total: 0, active: 0, inactive: 0 });
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "#8b5cf6",
      icon: "Tag",
      is_active: true,
    });
    setCurrentCategory(null);
  };

  const openEdit = (cat) => {
    setCurrentCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || "",
      color: cat.color,
      icon: cat.icon,
      is_active: cat.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = currentCategory
        ? `http://localhost:5000/api/admin/categories/${currentCategory._id}`
        : "http://localhost:5000/api/admin/categories";

      const response = await fetch(url, {
        method: currentCategory ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          currentCategory
            ? "Category updated successfully"
            : "Category created successfully",
        );
        fetchCategories();
        setIsDialogOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to save category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        "Are you sure? This will permanently de-register this sector from the taxonomy.",
      )
    )
      return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/categories/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        toast.success("Category deleted successfully");
        fetchCategories();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("An error occurred while deleting the category");
    }
  };

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      (cat.description &&
        cat.description.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && cat.is_active) ||
      (statusFilter === "inactive" && !cat.is_active);

    const matchesUsage =
      usageFilter === "all" ||
      (usageFilter === "high" && cat.usageCount >= 10) ||
      (usageFilter === "low" && cat.usageCount > 0 && cat.usageCount < 10) ||
      (usageFilter === "unused" && cat.usageCount === 0);

    return matchesSearch && matchesStatus && matchesUsage;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-jakarta">
      {/* 1. Forensics Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-starlight to-starlight/60">
            Category Command Center
          </h1>
          <p className="text-starlight/40 text-sm font-medium">
            Define and pulse the taxonomy for campus events and intelligence
            sectors.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 border-dashed border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-100 h-10"
            onClick={() => {
              const exportData = categories.map((cat) => ({
                Name: cat.name,
                Type: cat.type || "General",
                Usage: cat.usageCount || 0,
                Status: cat.is_active ? "Active" : "Inactive",
              }));
              downloadCSV(exportData, "categories_report");
            }}
          >
            <FileText className="h-4 w-4" />
            Export CSV
          </Button>
          <button
            onClick={fetchCategories}
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
            <Plus size={18} /> <span>New Sector</span>
          </button>
        </div>
      </div>

      {/* 2. Intelligence Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Taxonomy Depth"
          value={stats.total}
          icon={Layers}
          color="text-violet-400"
          subValue="Total distinct categories"
          description="Total count of all high-level categories currently defined in the system registry."
        />
        <KpiCard
          title="Active Sectors"
          value={stats.active}
          icon={CheckCircle}
          color="text-emerald-400"
          subValue="Currently visible in UI"
          description="Categories that are live and available for organizers to select for new events."
        />
        <KpiCard
          title="Dormant Sectors"
          value={stats.inactive}
          icon={AlertCircle}
          color="text-amber-400"
          subValue="Requires reactivation"
          description="Archived categories that are hidden from the frontend but preserved for historical logs."
        />
        <KpiCard
          title="Usage Velocity"
          value={categories.reduce((acc, c) => acc + (c.usageCount || 0), 0)}
          icon={TrendingUp}
          color="text-cyan-400"
          subValue="Total system associations"
          trend={true}
          description="Aggregate number of events and activities linked to all registered categories."
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
              placeholder="Search sectors, descriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl pl-12 pr-4 py-2.5 text-sm text-starlight focus:outline-none focus:border-violet-500/50 transition-all"
            />
          </div>

          {/* Expanded Filtering Cluster */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 bg-black/40 border border-white/5 rounded-xl h-10">
              <Filter size={14} className="text-starlight/60" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs text-starlight/60 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-[#0A0A0A]">
                  All Status
                </option>
                <option value="active" className="bg-[#0A0A0A]">
                  Active Only
                </option>
                <option value="inactive" className="bg-[#0A0A0A]">
                  Inactive Only
                </option>
              </select>
            </div>

            <div className="flex items-center gap-2 px-3 bg-black/40 border border-white/5 rounded-xl h-10">
              <BarChart3 size={14} className="text-starlight/60" />
              <select
                value={usageFilter}
                onChange={(e) => setUsageFilter(e.target.value)}
                className="bg-transparent text-xs text-starlight/60 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-[#0A0A0A]">
                  All Usage
                </option>
                <option value="high" className="bg-[#0A0A0A]">
                  High Demand (10+)
                </option>
                <option value="low" className="bg-[#0A0A0A]">
                  Low Demand
                </option>
                <option value="unused" className="bg-[#0A0A0A]">
                  Unused Sectors
                </option>
              </select>
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
                className="bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-starlight focus:outline-none focus:border-violet-500/50 cursor-pointer font-bold text-xs"
              >
                <option value={10}>10 Entries</option>
                <option value={25}>25 Entries</option>
                <option value={50}>50 Entries</option>
                <option value={100}>100 Entries</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Sector Grid (Compactful) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-20 text-center glass-panel rounded-2xl border border-white/5">
            <RefreshCw
              size={32}
              className="mx-auto text-violet-500/20 animate-spin mb-4"
            />
            <p className="text-starlight/40 font-bold uppercase tracking-widest text-[10px]">
              Synchronizing Taxonomy Database...
            </p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="col-span-full py-20 text-center glass-panel rounded-2xl border border-white/5">
            <AlertCircle size={32} className="mx-auto text-starlight/10 mb-4" />
            <p className="text-starlight/40 font-bold uppercase tracking-widest text-[10px]">
              No sectors match your current filters
            </p>
          </div>
        ) : (
          filteredCategories
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((cat) => (
              <div
                key={cat._id}
                className={`glass-panel p-5 rounded-2xl group border ${cat.is_active ? "border-white/5" : "border-rose-500/10 opacity-60"} hover:border-violet-500/30 transition-all relative overflow-hidden`}
              >
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                    style={{
                      backgroundColor: `${cat.color}15`,
                      color: cat.color,
                      border: `1px solid ${cat.color}30`,
                    }}
                  >
                    <Tag size={20} />
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
                          Sector Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem
                          onClick={() => openEdit(cat)}
                          className="flex items-center gap-2 p-2.5 text-starlight hover:bg-white/5 cursor-pointer rounded-lg transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-violet-600/10 flex items-center justify-center text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-all">
                            <Edit2 size={14} />
                          </div>
                          <span className="font-bold text-xs">
                            Refine Logic
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(cat._id)}
                          className="flex items-center gap-2 p-2.5 text-rose-400 hover:bg-rose-600/10 cursor-pointer rounded-lg transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-rose-600/10 flex items-center justify-center text-rose-400 group-hover:bg-rose-600 group-hover:text-white transition-all">
                            <Trash2 size={14} />
                          </div>
                          <span className="font-bold text-xs">
                            Terminate Sector
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-starlight tracking-tight">
                      {cat.name}
                    </h3>
                    {!cat.is_active && (
                      <span className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20">
                        Dormant
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-starlight/40 line-clamp-1 mb-4 h-4">
                    {cat.description || "No sector brief available."}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-[10px] font-mono text-starlight/60 uppercase tracking-tighter">
                        {cat.color}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <BarChart3 size={10} className="text-violet-400" />
                        <span className="text-[10px] text-starlight/60 font-bold">
                          {cat.eventUsage || 0} Events
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={10} className="text-cyan-400" />
                        <span className="text-[10px] text-starlight/60 font-bold">
                          {cat.communityUsage || 0} Clubs
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtle background glow */}
                <div
                  className="absolute -bottom-4 -right-4 w-16 h-16 blur-2xl opacity-10 transition-opacity group-hover:opacity-20 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
              </div>
            ))
        )}
      </div>

      {/* Pagination Controls */}
      {filteredCategories.length > 0 && (
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
            {Math.ceil(filteredCategories.length / itemsPerPage)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(
                  Math.ceil(filteredCategories.length / itemsPerPage),
                  p + 1,
                ),
              )
            }
            disabled={
              currentPage ===
              Math.ceil(filteredCategories.length / itemsPerPage)
            }
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-starlight/60 hover:text-starlight hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Forensic Sector Editor */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#0b0b0f] border-white/10 text-starlight max-w-md rounded-2xl overflow-hidden p-0">
          <div className="h-24 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 px-6 flex items-center justify-between border-b border-white/5">
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight uppercase">
                {currentCategory ? "Refine Sector" : "Register New Sector"}
              </DialogTitle>
              <DialogDescription className="text-[10px] font-medium text-starlight/40 opacity-80 uppercase tracking-widest mt-1">
                Forensic Logic Configuration
              </DialogDescription>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <Layers size={20} className="text-violet-400" />
            </div>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-5">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-starlight/30">
                Sector Identity
              </Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Virtual Reality Workshop"
                className="bg-white/5 border-white/5 focus:border-violet-500/50 rounded-xl h-11 text-sm transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-starlight/30">
                Sector Brief (Optional)
              </Label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of this sector's focus..."
                className="bg-white/5 border-white/5 focus:border-violet-500/50 rounded-xl h-11 text-sm transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-starlight/30">
                  Theme Origin
                </Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 cursor-pointer p-1"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="bg-white/5 border-white/5 font-mono text-xs rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-starlight/30">
                  Operational Status
                </Label>
                <div className="flex items-center gap-3 h-11">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        is_active: !formData.is_active,
                      })
                    }
                    className={`flex-1 h-full rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${formData.is_active ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"}`}
                  >
                    {formData.is_active ? "Active" : "Dormant"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="px-6 py-2 rounded-xl hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest text-starlight/40 transition-colors"
              >
                Abort
              </button>
              <button
                type="submit"
                className="px-8 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-500/20 border border-violet-500/30"
              >
                {currentCategory ? "Update Logic" : "Finalize Sector"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManager;
