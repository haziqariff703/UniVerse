import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Linkedin, Twitter, Globe, Sparkles } from "lucide-react";
import Typewriter from "typewriter-effect";
import { cn } from "@/lib/utils";
import BlurText from "@/components/ui/BlurText";
import { API_URL } from '@/config/api';
// import { MOCK_SPEAKERS } from "@/data/mockSpeakers";

const FILTERS = ["All", "Science", "Tech", "Arts", "Leadership"];

const Speakers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const fetchSpeakers = async () => {
    try {
      const response = await fetch(`${API_URL}/speakers`);
      const data = await response.json();
      setSpeakers(data.speakers || []);
    } catch (error) {
      console.error("Failed to fetch speakers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSpeakers = speakers.filter((speaker) => {
    const matchesSearch =
      speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speaker.expertise?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "All" || speaker.category === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen pt-12 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {loading && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      )}
      {/* I. LAYOUT RESTRUCTURE (THE SPOTLIGHT HERO) */}
      <div className="flex flex-col items-center text-center mb-16 space-y-6">
        <div className="space-y-3 max-w-3xl flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-clash font-bold tracking-tight bg-gradient-to-r from-white via-fuchsia-400 to-purple-500 text-transparent bg-clip-text animate-in fade-in slide-in-from-bottom-4 duration-700">
            Speakers
          </h1>
          <p className="text-white/60 text-lg font-sans leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Meet the visionaries, experts, and artists shaping the UniVerse.
          </p>
        </div>

        {/* The Command Line Search */}
        <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-700 delay-200">
          <div className="relative group">
            <div className="absolute inset-0 bg-violet-600/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4 group-focus-within:text-cyan-400 group-focus-within:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all z-20" />

            <div className="w-full h-12 bg-white/5 border border-white/10 backdrop-blur-xl px-12 flex items-center text-white rounded-full hover:bg-white/10 relative overflow-hidden transition-all focus-within:bg-white/10 focus-within:border-white/20 shadow-2xl">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="absolute inset-0 w-full h-full bg-transparent px-12 text-white text-sm focus:outline-none z-10"
              />

              {searchTerm === "" && (
                <div className="opacity-40 text-sm pointer-events-none flex items-center gap-1 font-geist">
                  <Typewriter
                    options={{
                      strings: [
                        "Search for Industry Experts...",
                        "Search for Quantum Computing...",
                        "Search for Dr. Elena Void...",
                      ],
                      autoStart: true,
                      loop: true,
                      delay: 50,
                      deleteSpeed: 30,
                      cursor: "|",
                      wrapperClassName: "typewriter-wrapper",
                      cursorClassName:
                        "typewriter-cursor text-cyan-400 font-bold",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Smart Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-geist uppercase tracking-widest transition-all duration-300 border backdrop-blur-md relative overflow-hidden group",
                activeFilter === filter
                  ? "bg-white/10 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white",
              )}
            >
              <span className="relative z-10">{filter}</span>
              {activeFilter === filter && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shine" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredSpeakers.map((speaker, idx) => (
          <AgentCard key={speaker._id} speaker={speaker} idx={idx} />
        ))}
        {filteredSpeakers.length === 0 && (
          <div className="col-span-full text-center py-32 text-white/30 font-geist tracking-widest uppercase flex flex-col items-center gap-4">
            <Sparkles className="w-8 h-8 opacity-20" />
            <p>No agents found in this sector.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// II. VISUAL POLISH: Spotlight Border Effect (2D High-Performance)
const AgentCard = ({ speaker, idx }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group relative transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-[5px]"
      style={{
        animationDelay: `${idx * 100}ms`,
      }}
    >
      {/* Spotlight Border Effect - Mouse Tracking Glow */}
      <div
        className="absolute -inset-[1px] rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.15), transparent 40%)`,
        }}
      />

      <div className="relative h-full rounded-[2rem] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-300 ease-out group-hover:border-white/30 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
        {/* Cinematic Grain Texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.07] z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <Link
          to={`/speakers/${speaker._id}`}
          className="block h-full relative z-10"
        >
          <div className="relative aspect-[4/5] overflow-hidden">
            {/* Enhanced Gradient for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />

            {/* Scanner Line (Identity Element) */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent -translate-y-full group-hover:translate-y-[500px] transition-transform duration-[1.5s] ease-in-out z-20 opacity-0 group-hover:opacity-100 delay-100" />

            {/* Image with Grayscale â†’ Color (Target Lock Effect) */}
            <img
              src={speaker.image}
              alt={speaker.name}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 ease-out"
            />

            {/* Social Buttons - Always Visible (Dimmed) */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
              <SocialBtn
                icon={Linkedin}
                href={speaker.social_links?.linkedin}
              />
              <SocialBtn icon={Twitter} href={speaker.social_links?.twitter} />
              <SocialBtn icon={Globe} href={speaker.social_links?.website} />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end h-full pointer-events-none">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out">
              <div className="flex justify-between items-end mb-2">
                <p className="text-[10px] font-geist text-white/50 uppercase tracking-[0.2em] group-hover:text-cyan-400 transition-colors duration-300">
                  {speaker.expertise}
                </p>
                {/* Category Badge */}
                <span className="text-[9px] font-geist text-white/30 border border-white/10 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {speaker.category}
                </span>
              </div>

              {/* Speaker Name - Simplified (No Excessive Glow) */}
              <h3 className="text-2xl font-clash font-bold text-white mb-3 leading-none transition-all duration-300">
                {speaker.name}
              </h3>

              {/* Stats Strip */}
              <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300 border-t border-white/10 pt-3 mt-1">
                <StatItem label="TALKS" value={speaker.stats?.talks || 0} />
                <StatItem
                  label="MERIT"
                  value={`+${speaker.stats?.merit || 0}`}
                />
                <StatItem label="RATING" value={speaker.stats?.rating || 0} />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

const StatItem = ({ label, value }) => (
  <div className="flex items-center gap-1.5 font-geist text-[9px] tracking-wider text-white">
    <span className="text-white/40">{label}:</span>
    <span className="font-bold">{value}</span>
  </div>
);

const SocialBtn = ({ icon: Icon, href }) => {
  if (!href) return null;
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        window.open(href, "_blank");
      }}
      className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white hover:text-black text-white transition-all cursor-pointer pointer-events-auto"
    >
      <Icon className="w-3 h-3" />
    </div>
  );
};

export default Speakers;
