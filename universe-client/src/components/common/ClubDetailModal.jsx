import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Instagram, Mail, Calendar, Users } from "lucide-react";
import { getTagColor } from "@/data/clubsData";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const ClubDetailModal = ({ club, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!club) return null;

  const handleExploreEvents = () => {
    navigate(`/events?club=${club.id}`);
    onClose();
  };

  const handleContactAdmin = () => {
    // TODO: Implement contact admin functionality
    window.location.href = `mailto:${club.social.email}?subject=Inquiry about ${club.title}`;
  };

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
        <div className="relative w-full h-64 -mx-6 -mt-6 overflow-hidden">
          <img
            src={club.image}
            alt={club.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950/95" />
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
                  {club.members}
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
                href={`mailto:${club.social.email}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 transition-all group"
              >
                <Mail className="w-5 h-5 text-cyan-500 group-hover:text-cyan-400" />
                <span className="text-sm text-foreground group-hover:text-cyan-200">
                  {club.social.email}
                </span>
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
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
      </DialogContent>
    </Dialog>
  );
};

export default ClubDetailModal;
