import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  X,
  Instagram,
  Mail,
  Calendar,
  Users,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { getTagColor } from "@/data/clubsData";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

const ClubDetailModal = ({ club, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [contactEmail, setContactEmail] = useState("");

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      if (!club?.slug || !isOpen) return;
      setLoadingMembers(true);
      try {
        const res = await fetch(`${API_BASE}/api/communities/${club.slug}`);
        if (res.ok) {
          const data = await res.json();
          setMembers(data.members || []);
          const ownerEmail = data?.community?.owner_id?.email;
          if (ownerEmail) setContactEmail(ownerEmail);
        }
      } catch (err) {
        console.error("Fetch members error:", err);
      } finally {
        setLoadingMembers(false);
      }
    };

    setContactEmail(club?.social?.email || "");
    fetchCommunityDetails();
  }, [club?.slug, isOpen]);

  const handleExploreEvents = () => {
    navigate(`/events?club=${club.id}`);
    onClose();
  };

  const handleContactAdmin = () => {
    const email = contactEmail || club?.social?.email || "";
    if (!email) return;
    window.location.href = `mailto:${email}?subject=Inquiry about ${club.title}`;
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/communities/${club.id}/apply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setApplied(true);
      } else {
        const data = await res.json();
        alert(data.message || "Failed to apply.");
      }
    } catch (err) {
      console.error("Apply error:", err);
      alert("Server error. Please try again later.");
    } finally {
      setApplying(false);
    }
  };

  if (!club) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-950/95 backdrop-blur-xl border-white/10 text-foreground max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Image Header */}
        <div className="relative w-full h-80 -mx-6 -mt-6 bg-slate-900 flex items-center justify-center overflow-hidden">
          <img
            src={club.banner || club.logo || club.image}
            alt={club.title}
            className="w-full h-full object-contain relative z-10"
          />
          {/* Blurred background for "full image" effect */}
          <div
            className="absolute inset-0 blur-2xl opacity-40 scale-110"
            style={{
              backgroundImage: `url(${club.banner || club.logo || club.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950/95 z-20" />
        </div>

        <DialogHeader className="-mt-16 relative z-10">
          {/* Title */}
          <DialogTitle className="text-4xl font-clash font-bold text-white mb-2">
            {club.title}
          </DialogTitle>

          {/* Full Name */}
          <p className="text-muted-foreground text-sm mb-3">{club.fullName}</p>

          {/* Tagline */}
          <DialogDescription className="text-purple-300/90 text-base italic mb-4">
            "{club.tagline}"
          </DialogDescription>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {club.tags.map((tag, index) => (
              <span
                key={index}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border",
                  getTagColor(tag),
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        </DialogHeader>

        {/* Full Description */}
        <div className="space-y-4">
          <p className="text-zinc-300 leading-relaxed text-base">
            {club.description}
          </p>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-500" />
              <div>
                <p className="text-xs text-muted-foreground">Members</p>
                <p className="text-sm font-medium text-foreground">
                  {members.length > 0 ? members.length : club.members}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-xs text-muted-foreground">Founded</p>
                <p className="text-sm font-medium text-foreground">
                  {club.founded}
                </p>
              </div>
            </div>
          </div>

          {/* Real-time Members List */}
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Active Members
            </h4>
            {loadingMembers ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating roster...
              </div>
            ) : members.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {members.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                      {m.user_id?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">
                        {m.user_id?.name || "Unknown User"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {m.role || "Member"} • {m.department}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                Initial members roster being finalized.
              </p>
            )}
          </div>

          {/* Social Media */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Get in Touch
            </h4>
            <div className="space-y-2">
              <a
                href={`https://instagram.com/${club.social.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/30 transition-all group"
              >
                <Instagram className="w-5 h-5 text-pink-500 group-hover:text-pink-400" />
                <span className="text-sm text-foreground group-hover:text-purple-200">
                  {club.social.instagram}
                </span>
              </a>
              <a
                href={`mailto:${contactEmail || club.social.email}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 transition-all group"
              >
                <Mail className="w-5 h-5 text-cyan-500 group-hover:text-cyan-400" />
                <span className="text-sm text-foreground group-hover:text-cyan-200">
                  {contactEmail || club.social.email}
                </span>
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={handleApply}
              disabled={applying || applied}
              className={cn(
                "w-full py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2",
                applied
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-[0_0_20px_rgba(192,38,211,0.3)]",
              )}
            >
              {applying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : applied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Application Submitted
                </>
              ) : (
                "Apply for Committee (Workforce) →"
              )}
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleContactAdmin}
                className="flex-1 py-3 px-4
                  bg-white/5 hover:bg-white/10
                  border border-white/10 hover:border-white/20
                  rounded-lg
                  text-sm font-medium
                  text-foreground hover:text-white
                  transition-all duration-300"
              >
                Contact Admin
              </button>
              <button
                onClick={handleExploreEvents}
                className="flex-1 py-3 px-4
                  bg-gradient-to-r from-purple-600 to-cyan-600
                  hover:from-purple-700 hover:to-cyan-700
                  rounded-lg
                  text-sm font-medium
                  text-white
                  transition-all duration-300
                  shadow-[0_0_20px_rgba(168,85,247,0.3)]
                  hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
              >
                Explore Events →
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClubDetailModal;
