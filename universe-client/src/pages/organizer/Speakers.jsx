import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  UserSearch,
  Plus,
  Search,
  Filter,
  Mail,
  Linkedin,
  Twitter,
  MoreVertical,
  ExternalLink,
  Award,
  BookOpen,
  Calendar,
  FileText,
  Upload,
  RefreshCw,
  Clock,
  MoreHorizontal,
  Edit,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

const OrganizerSpeakers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    expertise: "",
    bio: "",
    linkedin: "",
    twitter: "",
    proposal: null,
    image: null,
  });

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const fetchSpeakers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/speakers/organizer",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      setSpeakers(data.speakers || []);
    } catch (err) {
      console.error("Failed to fetch speakers:", err);
      toast.error("Failed to load speakers");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.files[0] }));
  };

  const handleEdit = (speaker) => {
    setSelectedSpeaker(speaker);
    setFormData({
      name: speaker.name,
      expertise: speaker.expertise || "",
      bio: speaker.bio || "",
      linkedin: speaker.social_links?.linkedin || "",
      twitter: speaker.social_links?.twitter || "",
      proposal: null,
      image: null,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (speakerId) => {
    if (
      !confirm(
        "Are you sure you want to delete this speaker? This action cannot be undone.",
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/speakers/${speakerId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("Failed to delete speaker");

      toast.success("Speaker Deleted");
      fetchSpeakers(); // Refresh list
    } catch (err) {
      toast.error("Deletion Failed", { description: err.message });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("name", formData.name);
      data.append("expertise", formData.expertise);
      data.append("bio", formData.bio);
      data.append(
        "social_links",
        JSON.stringify({
          linkedin: formData.linkedin,
          twitter: formData.twitter,
        }),
      );
      if (formData.proposal) {
        data.append("proposal", formData.proposal);
      }
      if (formData.image) {
        data.append("image", formData.image);
      }

      // Determine URL and Method based on mode
      const url = selectedSpeaker
        ? `http://localhost:5000/api/speakers/${selectedSpeaker._id}`
        : "http://localhost:5000/api/speakers/propose";

      const method = selectedSpeaker ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (!response.ok)
        throw new Error(
          selectedSpeaker
            ? "Failed to update speaker"
            : "Failed to submit proposal",
        );

      toast.success(
        selectedSpeaker ? "Speaker Updated" : "Proposal Submitted",
        {
          description: selectedSpeaker
            ? "Speaker details updated successfully."
            : "Speaker proposal submitted! Awaiting verification.",
        },
      );
      setIsDialogOpen(false);
      setSelectedSpeaker(null); // Reset selection
      setFormData({
        name: "",
        expertise: "",
        bio: "",
        linkedin: "",
        twitter: "",
        proposal: null,
        image: null,
      });
      fetchSpeakers(); // Refresh list
    } catch (err) {
      toast.error("Operation Failed", {
        description: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSpeakers = (speakers || []).filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.expertise?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-clash font-bold text-white mb-1">
              Speaker Directory
            </h1>
            <p className="text-white/40 text-sm">
              Manage and discover talent for your events
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20"
              size={16}
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search speakers..."
              className="pl-10 bg-white/5 border-white/10 text-white w-full md:w-64 h-10"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setSelectedSpeaker(null); // Reset to Add Mode
                  setFormData({
                    name: "",
                    expertise: "",
                    bio: "",
                    linkedin: "",
                    twitter: "",
                    proposal: null,
                    image: null,
                  });
                }}
                className="bg-violet-600 hover:bg-violet-700 text-white gap-2 h-10"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Add Speaker</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0f0f0f] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 text-transparent">
                  {selectedSpeaker
                    ? "Edit Speaker Details"
                    : "Board New Talent"}
                </DialogTitle>
                <p className="text-white/40 text-sm">
                  {selectedSpeaker
                    ? "Update the speaker's verify profile."
                    : "Propose a new speaker for verification."}
                </p>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-white/60">
                      Full Identity
                    </Label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Dr. Jane Doe"
                      required
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-white/60">
                      Primary Expertise
                    </Label>
                    <Input
                      name="expertise"
                      value={formData.expertise}
                      onChange={handleInputChange}
                      placeholder="e.g. Quantum Computing"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-white/60">
                    Speaker Image
                  </Label>
                  <div className="relative group cursor-pointer">
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, "image")}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      accept="image/*"
                    />
                    <div className="p-4 border border-dashed border-white/10 bg-white/5 rounded-xl flex items-center justify-center gap-3 group-hover:bg-white/10 transition-all">
                      <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                        <ImageIcon size={18} />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-xs font-bold text-white">
                          {formData.image
                            ? formData.image.name
                            : selectedSpeaker && selectedSpeaker.image
                              ? "Change Photo (Current Set)"
                              : "Upload Photo"}
                        </p>
                        <p className="text-[10px] text-white/40">
                          JPG/PNG, max 2MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-white/60">
                    Professional Biography
                  </Label>
                  <Textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Briefly describe their background..."
                    className="bg-white/5 border-white/10 min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-white/60">
                      LinkedIn Profile
                    </Label>
                    <Input
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/..."
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-white/60">
                      Twitter/X Profile
                    </Label>
                    <Input
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      placeholder="https://x.com/..."
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-white/60">
                    Proposal Credentials (CV/Portfolio)
                  </Label>
                  <div className="relative group cursor-pointer">
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, "proposal")}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      accept=".pdf,.doc,.docx"
                    />
                    <div className="p-8 border-2 border-dashed border-white/5 bg-white/[0.02] rounded-2xl flex flex-col items-center justify-center gap-3 group-hover:bg-white/[0.04] group-hover:border-violet-500/30 transition-all">
                      <div className="p-4 rounded-2xl bg-violet-500/10 text-violet-400 group-hover:scale-110 transition-transform">
                        <Upload size={24} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-white">
                          {formData.proposal
                            ? formData.proposal.name
                            : selectedSpeaker && selectedSpeaker.proposal_url
                              ? "Change Document (Current Set)"
                              : "Select Document"}
                        </p>
                        <p className="text-xs text-white/40">
                          PDF or DOC (max 10MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold h-12 rounded-xl"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="animate-spin" size={18} />
                      Processing...
                    </div>
                  ) : selectedSpeaker ? (
                    "Update Speaker"
                  ) : (
                    "Submit for Verification"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full p-20 flex flex-col items-center justify-center text-center">
            <RefreshCw
              className="text-violet-500 animate-spin mb-4"
              size={32}
            />
            <p className="text-white/40 text-sm">
              Searching Global Registry...
            </p>
          </div>
        ) : filteredSpeakers.length > 0 ? (
          filteredSpeakers.map((speaker) => (
            <div
              key={speaker._id}
              className="group bg-[#050505] border border-white/10 rounded-3xl p-6 transition-all relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-4 right-4 z-20">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                    >
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-[#1a1a1a] border-white/10 text-white w-40"
                  >
                    <DropdownMenuItem
                      className="focus:bg-white/5 focus:text-white cursor-pointer gap-2"
                      onClick={() => {
                        setSelectedSpeaker(speaker);
                        setIsViewModalOpen(true);
                      }}
                    >
                      <ExternalLink size={14} />
                      <span className="text-xs font-medium">View Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="focus:bg-white/5 focus:text-white cursor-pointer gap-2"
                      onClick={() => handleEdit(speaker)}
                    >
                      <Edit size={14} />
                      <span className="text-xs font-medium">Edit Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="focus:bg-red-500/10 focus:text-red-400 text-red-400 cursor-pointer gap-2"
                      onClick={() => handleDelete(speaker._id)}
                    >
                      <Trash2 size={14} />
                      <span className="text-xs font-medium">Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-col items-center text-center mb-6 pt-2">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-white/5 group-hover:border-violet-500/50 transition-colors bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center relative">
                    {speaker.image ? (
                      <img
                        src={
                          speaker.image.startsWith("http")
                            ? speaker.image
                            : `http://localhost:5000/${speaker.image}`
                        }
                        alt={speaker.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-black text-starlight uppercase">
                        {speaker.name?.substring(0, 2) || "S"}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-[#050505]">
                    <Award size={12} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {speaker.name}
                </h3>
                <p className="text-xs text-violet-400 font-bold uppercase tracking-widest">
                  {speaker.expertise || "Specialized Guest"}
                </p>
              </div>

              <div className="space-y-2 mb-6 flex-grow">
                <p className="text-xs text-white/30 leading-relaxed line-clamp-3">
                  {speaker.bio ||
                    "High-profile guest expert contributing to UniVerse events."}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex gap-2">
                  {speaker.social_links?.linkedin && (
                    <a
                      href={speaker.social_links.linkedin}
                      target="_blank"
                      className="p-2 bg-white/5 rounded-lg hover:bg-blue-600/20 hover:text-blue-400 transition-colors text-white/40"
                    >
                      <Linkedin size={14} />
                    </a>
                  )}
                  {speaker.social_links?.twitter && (
                    <a
                      href={speaker.social_links.twitter}
                      target="_blank"
                      className="p-2 bg-white/5 rounded-lg hover:bg-sky-500/20 hover:text-sky-400 transition-colors text-white/40"
                    >
                      <Twitter size={14} />
                    </a>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedSpeaker(speaker);
                    setIsViewModalOpen(true);
                  }}
                  className="text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 gap-2"
                >
                  View Speaker
                  <ExternalLink size={12} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 mb-4">
              <UserSearch className="text-white/20" size={32} />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">
              No speakers found
            </h3>
            <p className="text-white/40 text-sm max-w-xs">
              Try adjusting your search query.
            </p>
          </div>
        )}
      </div>
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="bg-[#0f0f0f] border-white/10 text-white max-w-2xl">
          {selectedSpeaker && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/10 flex-shrink-0">
                    {selectedSpeaker.image ? (
                      <img
                        src={
                          selectedSpeaker.image.startsWith("http")
                            ? selectedSpeaker.image
                            : `http://localhost:5000/${selectedSpeaker.image}`
                        }
                        alt={selectedSpeaker.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/5 flex items-center justify-center">
                        <span className="text-2xl font-black text-white/20">
                          {selectedSpeaker.name?.substring(0, 2) || "S"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <DialogTitle className="text-3xl font-clash font-bold text-white mb-2">
                      {selectedSpeaker.name}
                    </DialogTitle>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-bold uppercase tracking-wider">
                        {selectedSpeaker.expertise}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/5 text-white/60 border border-white/10 text-xs font-bold uppercase tracking-wider">
                        {selectedSpeaker.stats?.rating || "5.0"} Rating
                      </span>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">
                    About
                  </h4>
                  <p className="text-white/80 leading-relaxed text-sm">
                    {selectedSpeaker.bio ||
                      selectedSpeaker.about ||
                      "No biography available."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">
                      Talks Delivered
                    </h4>
                    <p className="text-2xl font-bold text-white">
                      {selectedSpeaker.stats?.talks || 0}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">
                      Merit Points
                    </h4>
                    <p className="text-2xl font-bold text-white">
                      {selectedSpeaker.stats?.merit || 0}
                    </p>
                  </div>
                </div>

                {selectedSpeaker.social_links && (
                  <div className="flex gap-4 pt-4 border-t border-white/10">
                    {selectedSpeaker.social_links.linkedin && (
                      <a
                        href={selectedSpeaker.social_links.linkedin}
                        target="_blank"
                        className="flex items-center gap-2 text-sm text-white/60 hover:text-blue-400 transition-colors"
                      >
                        <Linkedin size={16} /> LinkedIn
                      </a>
                    )}
                    {selectedSpeaker.social_links.twitter && (
                      <a
                        href={selectedSpeaker.social_links.twitter}
                        target="_blank"
                        className="flex items-center gap-2 text-sm text-white/60 hover:text-sky-400 transition-colors"
                      >
                        <Twitter size={16} /> Twitter
                      </a>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizerSpeakers;
