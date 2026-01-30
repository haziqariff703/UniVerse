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
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-starlight to-starlight/60">
              Speaker Management
            </h1>
            <p className="text-starlight/40 text-sm">
              Manage event speakers and special guests.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsDataDialogOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition-all shadow-lg hover:shadow-violet-500/20"
        >
          <Plus size={18} /> Add Speaker
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center p-12 text-starlight/40">
          Loading speakers...
        </div>
      ) : !speakers || speakers.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center text-starlight/40 border border-white/5 rounded-3xl glass-panel">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Mic2 size={32} />
          </div>
          <p className="text-lg font-medium">No speakers found.</p>
          <p className="text-sm">Add your first speaker to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {speakers.map((speaker) => (
            <div
              key={speaker._id}
              className="glass-panel p-6 rounded-2xl group border border-white/5 hover:border-violet-500/30 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold text-lg">
                  <Mic2 size={24} />
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(speaker)}
                    className="p-2 hover:bg-white/10 rounded-lg text-starlight/60 hover:text-blue-400 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(speaker._id)}
                    className="p-2 hover:bg-white/10 rounded-lg text-starlight/60 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-starlight mb-1">
                {speaker.name}
              </h3>
              <p className="text-sm text-violet-300 mb-3">
                {speaker.expertise}
              </p>
              <p className="text-starlight/50 text-sm line-clamp-2 mb-4 h-10">
                {speaker.bio || "No biography provided."}
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                {speaker.social_links?.linkedin && (
                  <a
                    href={speaker.social_links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-starlight/40 hover:text-blue-500 transition-colors"
                  >
                    <Linkedin size={16} />
                  </a>
                )}
                {speaker.social_links?.twitter && (
                  <a
                    href={speaker.social_links.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="text-starlight/40 hover:text-cyan-400 transition-colors"
                  >
                    <Twitter size={16} />
                  </a>
                )}
                {speaker.social_links?.website && (
                  <a
                    href={speaker.social_links.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-starlight/40 hover:text-emerald-400 transition-colors"
                  >
                    <Globe size={16} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={isDataDialogOpen} onOpenChange={setIsDataDialogOpen}>
        <DialogContent className="bg-[#050505] border-white/10 text-starlight">
          <DialogHeader>
            <DialogTitle>
              {currentSpeaker ? "Edit Speaker" : "Add New Speaker"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Dr. John Doe"
                className="bg-white/5 border-white/10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Expertise / Title</Label>
              <Input
                value={formData.expertise}
                onChange={(e) =>
                  setFormData({ ...formData, expertise: e.target.value })
                }
                placeholder="AI Researcher / Keynote Speaker"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Biography</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Brief bio..."
                className="bg-white/5 border-white/10 h-24"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>LinkedIn URL</Label>
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
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Twitter URL</Label>
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
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsDataDialogOpen(false)}
                className="px-4 py-2 rounded-lg hover:bg-white/5 text-starlight/60 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-bold transition-colors"
              >
                {currentSpeaker ? "Update Speaker" : "Add Speaker"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpeakersList;
