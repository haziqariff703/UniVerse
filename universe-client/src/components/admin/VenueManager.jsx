import React, { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Plus,
  Edit2,
  Users,
  Clock,
  Search,
  Trash2,
  AlertCircle,
  FileText,
  Save,
  Activity,
  Zap,
  Cpu,
  ArrowLeft,
  RefreshCw,
  X,
  Check,
  ImageIcon,
  MoreVertical,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { downloadCSV } from "@/lib/exportUtils";

/**
 * Common facilities usually available on campus.
 */
const DEFAULT_FACILITIES = [
  "Projector",
  "High-Speed WiFi",
  "Air Conditioning",
  "Sound System",
  "Whiteboard",
  "Charging Ports",
  "Smart Board",
  "Video Conferencing",
  "Catering Space",
];

const VenueManager = ({ onBack }) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFacility, setFilterFacility] = useState("all");
  const [customFacility, setCustomFacility] = useState("");
  const [availableFacilities, setAvailableFacilities] =
    useState(DEFAULT_FACILITIES);

  const [formData, setFormData] = useState({
    name: "",
    location_code: "",
    max_capacity: "",
    type: "Other",
    description: "",
    bestFor: [],
    accessHours: "08:00 - 22:00",
    accessLevel: "Student ID",
    managedBy: "HEP Office",
    occupancyStatus: "Available",
    facilities: [], // Changed to array
  });
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [customBestFor, setCustomBestFor] = useState(""); // State for "Best For" tag input

  const fetchVenues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...(searchQuery && { search: searchQuery }),
        ...(filterFacility !== "all" && { facility: filterFacility }),
      });

      const response = await fetch(
        `http://localhost:5000/api/admin/venues?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch venues");

      const data = await response.json();
      const venuesData = data.venues || [];
      setVenues(venuesData);
      if (data.pagination) setTotalPages(data.pagination.totalPages);

      // Extract all unique facilities to populate the selectable list
      const allFacilities = [
        ...new Set([
          ...DEFAULT_FACILITIES,
          ...venuesData.flatMap((v) => v.facilities || []),
        ]),
      ];
      setAvailableFacilities(allFacilities.sort());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchQuery, filterFacility]);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  const openCreateModal = () => {
    setEditingVenue(null);
    setFormData({
      name: "",
      location_code: "",
      max_capacity: "",
      type: "Other",
      description: "",
      bestFor: [],
      accessHours: "08:00 - 22:00",
      accessLevel: "Student ID",
      managedBy: "HEP Office",
      occupancyStatus: "Available",
      facilities: [],
    });
    setShowModal(true);
    setImageFile(null);
    setImagePreview("");
  };

  const openEditModal = (venue) => {
    setEditingVenue(venue);
    setFormData({
      name: venue.name,
      location_code: venue.location_code,
      max_capacity: venue.max_capacity.toString(),
      type: venue.type || "Other",
      description: venue.description || "",
      bestFor: venue.bestFor || [],
      accessHours: venue.accessHours || "08:00 - 22:00",
      accessLevel: venue.accessLevel || "Student ID",
      managedBy: venue.managedBy || "HEP Office",
      occupancyStatus: venue.occupancyStatus || "Available",
      facilities: venue.facilities || [],
    });

    // Ensure all facilities of the editing venue are in the available list
    if (venue.facilities) {
      setAvailableFacilities((prev) => {
        const newList = [...new Set([...prev, ...venue.facilities])];
        return newList.sort();
      });
    }
    setShowModal(true);
    setImageFile(null);
    setImagePreview(venue.images?.[0] || "");
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVenue(null);
    setFormData({
      name: "",
      location_code: "",
      max_capacity: "",
      type: "Other",
      description: "",
      bestFor: [],
      accessHours: "08:00 - 22:00",
      accessLevel: "Student ID",
      managedBy: "HEP Office",
      occupancyStatus: "Available",
      facilities: [],
    });
    setCustomFacility("");
    setImageFile(null);
    setImagePreview("");
  };

  const toggleFacility = (facility) => {
    setFormData((prev) => {
      const isSelected = prev.facilities.includes(facility);
      if (isSelected) {
        return {
          ...prev,
          facilities: prev.facilities.filter((f) => f !== facility),
        };
      } else {
        return {
          ...prev,
          facilities: [...prev.facilities, facility],
        };
      }
    });
  };

  const handleAddCustomFacility = (e) => {
    e.preventDefault();
    if (!customFacility.trim()) return;

    const formatted = customFacility.trim();
    if (!availableFacilities.includes(formatted)) {
      setAvailableFacilities((prev) => [...prev, formatted].sort());
    }

    if (!formData.facilities.includes(formatted)) {
      setFormData((prev) => ({
        ...prev,
        facilities: [...prev.facilities, formatted],
      }));
    }

    setCustomFacility("");
  };

  const handleAddBestFor = (e) => {
    e.preventDefault();
    if (!customBestFor.trim()) return;
    if (!formData.bestFor.includes(customBestFor.trim())) {
      setFormData((prev) => ({
        ...prev,
        bestFor: [...prev.bestFor, customBestFor.trim()],
      }));
    }
    setCustomBestFor("");
  };

  const handleRemoveBestFor = (tag) => {
    setFormData((prev) => ({
      ...prev,
      bestFor: prev.bestFor.filter((t) => t !== tag),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      const data = new FormData();
      data.append("name", formData.name);
      data.append("location_code", formData.location_code);
      data.append("max_capacity", formData.max_capacity);
      data.append("type", formData.type);
      data.append("description", formData.description);
      data.append("accessHours", formData.accessHours);
      data.append("accessLevel", formData.accessLevel);
      data.append("managedBy", formData.managedBy);
      data.append("occupancyStatus", formData.occupancyStatus);
      data.append("facilities", JSON.stringify(formData.facilities));
      data.append("bestFor", JSON.stringify(formData.bestFor));

      if (imageFile) {
        data.append("image", imageFile);
      }

      const url = editingVenue
        ? `http://localhost:5000/api/admin/venues/${editingVenue._id}`
        : "http://localhost:5000/api/admin/venues";

      const response = await fetch(url, {
        method: editingVenue ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to save venue");
      }

      closeModal();
      fetchVenues();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this venue?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/venues/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete venue");
      }

      setVenues(venues.filter((v) => v._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Filtering ---
  // Filtering is now handled by API
  const filteredVenues = venues;

  const uniqueFacilitiesList = [
    ...new Set(venues.flatMap((v) => v.facilities || [])),
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-starlight/60 hover:text-starlight hover:bg-white/5 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-starlight to-starlight/60">
              Venue Command Center
            </h1>
            <p className="text-starlight/40 text-sm">
              Manage and oversee all campus infrastructure and capacities.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2 border-dashed border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-100 h-10"
            onClick={() => {
              const exportData = venues.map((venue) => ({
                Name: venue.name,
                Location: venue.location_code,
                Capacity: venue.max_capacity,
                Type: venue.type,
                Status: venue.occupancyStatus,
              }));
              downloadCSV(exportData, "venues_report");
            }}
          >
            <FileText className="h-4 w-4" />
            Export CSV
          </Button>
          <button
            onClick={fetchVenues}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-sm text-starlight/70 hover:text-white transition-colors"
          >
            <RefreshCw size={14} /> <span>Refresh</span>
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-500 shadow-lg shadow-violet-600/20 transition-all"
          >
            <Plus size={16} /> <span>Add Venue</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Venues"
          value={venues.length}
          icon={MapPin}
          color="text-violet-400"
          subValue="Asset registry"
          description="Total count of all campus facilities currently registered in the system."
        />
        <KpiCard
          title="Total Capacity"
          value={venues.reduce((acc, v) => acc + (v.max_capacity || 0), 0)}
          icon={Users}
          color="text-cyan-400"
          subValue="Aggregate logistics"
          description="Aggregate seating and standing capacity across all active platform venues."
        />
        <KpiCard
          title="Premium Venues"
          value={venues.filter((v) => (v.max_capacity || 0) > 500).length}
          icon={Zap}
          color="text-amber-400"
          subValue="High capacity index"
          description="High-tier facilities with specialized equipment and large-scale capacity."
        />
        <KpiCard
          title="Unique Facilities"
          value={new Set(venues.flatMap((v) => v.facilities || [])).size}
          icon={Cpu}
          color="text-emerald-400"
          subValue="Facility velocity"
          description="Total number of distinct equipment and service types across all venues."
        />
      </div>

      {/* 3. Control Toolbar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center flex-1 w-full">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-starlight/40"
              size={16}
            />
            <input
              type="text"
              placeholder="Search venue name, location code..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-black/20 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-starlight focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder:text-starlight/60 font-bold text-xs"
            />
          </div>

          <div className="flex items-center gap-2 border-l border-white/5 pl-4">
            <span className="text-xs font-bold text-starlight/40 uppercase tracking-widest whitespace-nowrap">
              Facility:
            </span>
            <select
              value={filterFacility}
              onChange={(e) => {
                setFilterFacility(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-sm text-starlight focus:outline-none focus:border-violet-500/50 cursor-pointer font-bold text-xs"
            >
              <option value="all">All Facilities</option>
              {uniqueFacilitiesList.sort().map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
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
              className="bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-sm text-starlight focus:outline-none focus:border-violet-500/50 cursor-pointer font-bold text-xs"
            >
              <option value={10}>10 Entries</option>
              <option value={25}>25 Entries</option>
              <option value={50}>50 Entries</option>
              <option value={100}>100 Entries</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Main Data Grid (Data Table) */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 shadow-xl">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw
              size={32}
              className="mx-auto text-violet-400 animate-spin mb-4"
            />
            <p className="text-starlight/60">
              Syncing with infrastructure data...
            </p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <div className="text-rose-400 mb-4">{error}</div>
            <button
              onClick={fetchVenues}
              className="px-6 py-2 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <MapPin size={32} className="text-starlight/60" />
            </div>
            <h3 className="text-xl font-bold text-starlight mb-2">
              No results found
            </h3>
            <p className="text-starlight/40 max-w-sm mx-auto">
              We couldn't find any venues matching your criteria. Try adjusting
              your search or filters.
            </p>
          </div>
        ) : (
          <>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="p-4 text-xs font-bold text-starlight/40 uppercase tracking-wider pl-6">
                      Venue Details
                    </th>
                    <th className="p-4 text-xs font-bold text-starlight/40 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="p-4 text-xs font-bold text-starlight/40 uppercase tracking-wider">
                      Infrastructure
                    </th>
                    <th className="p-4 text-xs font-bold text-starlight/40 uppercase tracking-wider border-none">
                      Status
                    </th>
                    <th className="p-4 text-xs font-bold text-starlight/40 uppercase tracking-wider text-right pr-12">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {venues.map((venue) => (
                    <tr
                      key={venue._id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Venue Identity */}
                      <td className="p-4 pl-6 align-top">
                        <div className="flex gap-4">
                          <div className="shrink-0 w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                            <MapPin size={24} className="text-violet-400" />
                          </div>
                          <div>
                            <h3 className="text-starlight font-bold text-sm mb-1 group-hover:text-violet-300 transition-colors">
                              {venue.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-starlight/40">
                              <Users size={12} />
                              <span>Max Pax: {venue.max_capacity}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="p-4 align-top">
                        <div className="inline-flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg text-xs font-medium text-starlight/70 border border-white/5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          {venue.location_code}
                        </div>
                      </td>

                      {/* Facilities */}
                      <td className="p-4 align-top">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {venue.facilities?.length > 0 ? (
                            venue.facilities.map((facility, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/5 text-starlight/60 border border-white/5"
                              >
                                {facility}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-starlight/60 italic">
                              No facilities listed
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4 align-top">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full ${
                            venue.max_capacity >= 1000
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          }`}
                        >
                          <Activity size={10} />
                          {venue.max_capacity >= 1000 ? "Premium" : "Standard"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-10 align-middle text-right">
                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-2 rounded-xl bg-white/5 text-starlight/60 hover:text-white hover:bg-white/10 transition-all">
                                <MoreVertical size={18} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-48 glass-panel border-white/10"
                            >
                              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-starlight/40">
                                Operational Actions
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-white/5" />
                              <DropdownMenuItem
                                onClick={() => openEditModal(venue)}
                                className="flex items-center gap-2 p-3 text-starlight hover:bg-white/5 cursor-pointer rounded-lg transition-colors group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-violet-600/10 flex items-center justify-center text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-all">
                                  <Edit2 size={16} />
                                </div>
                                <span className="font-bold text-xs font-jakarta">
                                  Edit Details
                                </span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(venue._id)}
                                className="flex items-center gap-2 p-3 text-rose-400 hover:bg-rose-600/10 cursor-pointer rounded-lg transition-colors group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-rose-600/10 flex items-center justify-center text-rose-400 group-hover:bg-rose-600 group-hover:text-white transition-all">
                                  <Trash2 size={16} />
                                </div>
                                <span className="font-bold text-xs font-jakarta">
                                  Decommission
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
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-starlight/60 hover:text-starlight hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-jakarta uppercase tracking-widest"
              >
                Previous
              </button>
              <span className="text-xs font-medium text-starlight/40 font-jakarta uppercase tracking-widest">
                Page{" "}
                <span className="text-starlight font-bold">{currentPage}</span>{" "}
                of{" "}
                <span className="text-starlight font-bold">{totalPages}</span>
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-starlight/60 hover:text-starlight hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-jakarta uppercase tracking-widest"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={closeModal}
          ></div>
          <div className="relative glass-panel rounded-3xl w-full max-w-4xl max-h-[90vh] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
            {/* Image Header with Fade */}
            <div className="relative h-64 w-full overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505] z-10" />
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-violet-600/20 to-cyan-600/20 flex items-center justify-center">
                  <ImageIcon size={64} className="text-white/10" />
                </div>
              )}

              {/* Overlay Upload Button */}
              <label className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                <div className="flex flex-col items-center gap-2 text-white">
                  <div className="w-12 h-12 rounded-full bg-violet-600 flex items-center justify-center shadow-lg">
                    <Plus size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {imagePreview ? "Change Image" : "Upload Image"}
                  </span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-lg flex items-center justify-center bg-black/40 text-starlight/60 hover:text-starlight hover:bg-black/60 backdrop-blur-md transition-colors border border-white/5"
            >
              <X size={18} />
            </button>

            <div className="p-10 pt-4 overflow-y-auto custom-scrollbar flex-1">
              <h3 className="text-3xl font-bold text-starlight mb-1">
                {editingVenue ? "Edit Venue Identity" : "Provision New Venue"}
              </h3>
              <p className="text-starlight/40 text-sm mb-10">
                Configure primary metadata and operational assets for this
                facility.
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Core Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-starlight/40 uppercase tracking-[0.2em] pl-1">
                      Venue Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-starlight placeholder-starlight/20 focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="e.g., Grand Ballroom"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-starlight/40 uppercase tracking-[0.2em] pl-1">
                      Location Code
                    </label>
                    <input
                      type="text"
                      value={formData.location_code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location_code: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-starlight placeholder-starlight/20 focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="e.g., BLK-A-102"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-starlight/40 uppercase tracking-[0.2em] pl-1">
                      Maximum Capacity (Pax)
                    </label>
                    <div className="relative">
                      <Users
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-starlight/60"
                        size={18}
                      />
                      <input
                        type="number"
                        value={formData.max_capacity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            max_capacity: e.target.value,
                          })
                        }
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-starlight placeholder-starlight/20 focus:outline-none focus:border-violet-500 transition-colors"
                        placeholder="e.g., 500"
                        required
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Type & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-starlight/40 uppercase tracking-[0.2em] pl-1">
                      Venue Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-starlight placeholder-starlight/20 focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
                    >
                      <option value="Academic">Academic</option>
                      <option value="Residential">Residential</option>
                      <option value="Social">Social</option>
                      <option value="Outdoor">Outdoor</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-starlight/40 uppercase tracking-[0.2em] pl-1">
                      Current Occupancy Status
                    </label>
                    <select
                      value={formData.occupancyStatus}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          occupancyStatus: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-starlight placeholder-starlight/20 focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
                    >
                      <option value="Available">Available</option>
                      <option value="Busy">Busy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                {/* Section 3: Description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-starlight/40 uppercase tracking-[0.2em] pl-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-starlight placeholder-starlight/20 focus:outline-none focus:border-violet-500 transition-colors min-h-[100px]"
                    placeholder="Describe the venue's features and atmosphere..."
                  />
                </div>

                {/* Section 4: Operations */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-starlight/40 uppercase tracking-[0.2em] pl-1">
                      Access Hours
                    </label>
                    <div className="relative">
                      <Clock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-starlight/60"
                        size={18}
                      />
                      <input
                        type="text"
                        value={formData.accessHours}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            accessHours: e.target.value,
                          })
                        }
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-starlight placeholder-starlight/20 focus:outline-none focus:border-violet-500 transition-colors"
                        placeholder="e.g., 08:00 - 22:00"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-starlight/40 uppercase tracking-[0.2em] pl-1">
                      Access Level
                    </label>
                    <input
                      type="text"
                      value={formData.accessLevel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          accessLevel: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-starlight placeholder-starlight/20 focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="e.g., Student ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-starlight/40 uppercase tracking-[0.2em] pl-1">
                      Managed By
                    </label>
                    <input
                      type="text"
                      value={formData.managedBy}
                      onChange={(e) =>
                        setFormData({ ...formData, managedBy: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-starlight placeholder-starlight/20 focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="e.g., HEP Office"
                    />
                  </div>
                </div>

                {/* Section 5: Best For */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <label className="text-[10px] font-black text-starlight/40 uppercase tracking-[0.2em] pl-1">
                      Best For (Usage Scenarios)
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={customBestFor}
                        onChange={(e) => setCustomBestFor(e.target.value)}
                        placeholder="Add Scenario..."
                        className="bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-starlight placeholder:text-starlight/60 focus:outline-none focus:border-violet-500/50 min-w-[150px]"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddBestFor(e);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddBestFor}
                        className="w-8 h-8 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center hover:bg-violet-600 hover:text-white transition-all border border-violet-500/20"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.bestFor.map((tag, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-starlight/80"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveBestFor(tag)}
                          className="hover:text-rose-400"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {formData.bestFor.length === 0 && (
                      <span className="text-xs text-starlight/30 italic">
                        No usage scenarios added
                      </span>
                    )}
                  </div>
                </div>

                {/* Section 6: Assets & Facilities */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <label className="text-[10px] font-black text-starlight/40 uppercase tracking-[0.2em] pl-1">
                      Operational Assets & Facilities
                    </label>

                    {/* Add Custom Facility Form */}
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={customFacility}
                        onChange={(e) => setCustomFacility(e.target.value)}
                        placeholder="Add manual facility..."
                        className="bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-starlight placeholder:text-starlight/60 focus:outline-none focus:border-violet-500/50 min-w-[200px]"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomFacility}
                        className="w-8 h-8 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center hover:bg-violet-600 hover:text-white transition-all border border-violet-500/20"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Checkbox Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {availableFacilities.map((facility) => {
                      const isChecked = formData.facilities.includes(facility);
                      return (
                        <button
                          key={facility}
                          type="button"
                          onClick={() => toggleFacility(facility)}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                            isChecked
                              ? "bg-violet-600/10 border-violet-500/30 text-starlight"
                              : "bg-white/5 border-white/5 text-starlight/30 hover:bg-white/[0.08] hover:text-starlight/60"
                          }`}
                        >
                          <div
                            className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                              isChecked
                                ? "bg-violet-500 border-violet-500"
                                : "border-white/10"
                            }`}
                          >
                            {isChecked && (
                              <Check size={12} className="text-white" />
                            )}
                          </div>
                          <span className="text-xs font-bold truncate">
                            {facility}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-4 pt-6 border-t border-white/5">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-8 py-4 rounded-2xl border border-white/10 text-starlight/40 font-black uppercase tracking-widest hover:bg-white/5 hover:text-starlight transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-[2] flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-violet-600/20 transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <RefreshCw size={20} className="animate-spin" />
                    ) : (
                      <Save size={20} />
                    )}
                    {editingVenue
                      ? "Update Infrastructure"
                      : "Confirm Provisioning"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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

const FilterIcon = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

export default VenueManager;
