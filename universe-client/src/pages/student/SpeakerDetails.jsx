import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Linkedin,
  Twitter,
  Globe,
  Award,
  Calendar,
} from "lucide-react";
import EventCard from "@/components/common/EventCard";

// Mock Data
const getSpeakerData = (id) => {
  return {
    id: id,
    name: "Dr. Elena Void",
    expertise: "Astrophysics",
    role: "Senior Researcher, Deep Space Institute",
    bio: "Dr. Elena Void is a renowned astrophysicist specializing in dark matter and cosmic inflation. She has led multiple deep-space observation missions and is a vocal advocate for space exploration funding. Her work has fundamentally shifted our understanding of the early universe.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200",
    social_links: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      website: "https://example.com",
    },
    speakingAt: [
      {
        id: 201,
        title: "Keynote: The Edge of the Universe",
        date: "2026-06-15",
        time: "9:00 AM",
        category: "Science",
        image:
          "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=400",
        location: "Grand Aurora Hall",
      },
      {
        id: 202,
        title: "Panel: Future of Interstellar Travel",
        date: "2026-06-16",
        time: "2:00 PM",
        category: "Tech",
        image:
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400",
        location: "Nebula Lab 1",
      },
    ],
  };
};

const SpeakerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [speaker, setSpeaker] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setSpeaker(getSpeakerData(id));
    }, 100);
  }, [id]);

  if (!speaker)
    return (
      <div className="min-h-screen pt-28 flex justify-center text-foreground text-xl">
        Loading Profile...
      </div>
    );

  return (
    <div className="min-h-screen pt-6 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/speakers")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Speakers
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Col: Profile */}
          <div className="lg:col-span-4 space-y-6">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700 w-full max-w-md mx-auto lg:mx-0">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <img
                src={speaker.image}
                alt={speaker.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              <div className="flex gap-4 justify-center lg:justify-start">
                {speaker.social_links.linkedin && (
                  <a
                    href={speaker.social_links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-white/5 rounded-full hover:bg-[#0077b5] hover:text-white text-gray-400 transition-all"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {speaker.social_links.twitter && (
                  <a
                    href={speaker.social_links.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-white/5 rounded-full hover:bg-[#1DA1F2] hover:text-white text-gray-400 transition-all"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {speaker.social_links.website && (
                  <a
                    href={speaker.social_links.website}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-muted rounded-full hover:bg-white hover:text-black text-muted-foreground transition-all"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Col: Bio & Sessions */}
          <div className="lg:col-span-8 space-y-12">
            <div className="animate-in fade-in slide-in-from-right-6 duration-700 delay-200">
              <h1 className="text-5xl md:text-7xl font-neuemontreal font-bold text-foreground mb-2">
                {speaker.name}
              </h1>
              <p className="text-xl text-violet-400 font-medium mb-6">
                {speaker.role}
              </p>

              <div className="glass-panel p-8 rounded-2xl relative overflow-hidden bg-card border border-border">
                <div className="absolute top-0 right-0 p-32 bg-violet-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <h3 className="text-2xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-accent" /> About
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {speaker.bio}
                </p>
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-right-6 duration-700 delay-300">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-accent" /> Speaking Activity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {speaker.speakingAt.map((event, idx) => (
                  <EventCard key={idx} event={event} index={idx} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakerDetails;
