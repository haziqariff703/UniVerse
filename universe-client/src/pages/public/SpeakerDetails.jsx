import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Linkedin,
  Twitter,
  Globe,
  ShieldCheck,
  Mail,
  Calendar,
  Award,
  Mic,
  Zap,
  TrendingUp,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MOCK_SPEAKERS } from "@/data/mockSpeakers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_URL } from '@/config/api';

const SpeakerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [speaker, setSpeaker] = useState(null);

  useEffect(() => {
    const fetchSpeaker = async () => {
      try {
        const response = await fetch(
          `${API_URL}/speakers/${id}`,
        );
        if (!response.ok) throw new Error("Speaker not found");
        const data = await response.json();
        setSpeaker(data.speaker);
      } catch (error) {
        console.error("Failed to fetch speaker:", error);
      }
    };
    if (id) {
      fetchSpeaker();
    }
  }, [id]);

  if (!speaker)
    return (
      <div className="min-h-screen flex items-center justify-center text-white/50">
        Loading Agent Profile...
      </div>
    );

  return (
    <div className="relative min-h-screen p-4 md:p-8 pt-24 max-w-7xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-xs font-geist text-white/40 hover:text-white transition-colors uppercase tracking-widest group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
        Return to Roster
      </button>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Identity Profile (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2.5rem] bg-black/40 border border-white/10 backdrop-blur-xl p-6"
          >
            {/* Profile Image */}
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 border border-white/5">
              <img
                src={speaker.image}
                alt={speaker.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-geist uppercase tracking-widest text-emerald-400">
                  Active
                </span>
              </div>
            </div>

            {/* Identity Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-clash font-bold text-white mb-1">
                  {speaker.name}
                </h1>
                <p className="text-cyan-400 font-geist text-xs uppercase tracking-[0.2em]">
                  {speaker.role}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {speaker.category && (
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-geist text-white/60">
                    {speaker.category}
                  </span>
                )}
              </div>

              {/* Social Dock */}
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <SocialBtn
                  icon={Linkedin}
                  href={speaker.social_links?.linkedin}
                />
                <SocialBtn
                  icon={Twitter}
                  href={speaker.social_links?.twitter}
                />
                <SocialBtn icon={Globe} href={speaker.social_links?.website} />
              </div>
            </div>
          </motion.div>

          {/* Quick Stats (Mobile only mostly, or stacked) */}
          <div className="grid grid-cols-3 gap-4">
            <StatBox
              label="Talks"
              value={speaker.stats?.talks || 0}
              icon={Mic}
              delay={0.1}
            />
            <StatBox
              label="Merit"
              value={speaker.stats?.merit || 0}
              icon={Zap}
              delay={0.2}
            />
            <StatBox
              label="Rating"
              value={speaker.stats?.rating || 0}
              icon={TrendingUp}
              delay={0.3}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Detailed Data (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Extended Bio & About */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Layers className="w-32 h-32 text-white" />
            </div>

            <h2 className="text-xl font-clash font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-fuchsia-500 rounded-full" />
              Agent Dossier
            </h2>

            <p className="text-lg text-white/80 font-sans leading-relaxed max-w-2xl">
              {speaker.about || speaker.bio}
            </p>

            {speaker.achievements && (
              <div className="mt-8">
                <h3 className="text-xs font-geist uppercase tracking-widest text-white/40 mb-4">
                  Key Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {speaker.achievements?.map((ach, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <Award className="w-4 h-4 text-fuchsia-400 shrink-0" />
                      <span className="text-sm text-white/70">{ach}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* 2. Timeline / Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-[2.5rem] border border-white/10 bg-black/20 overflow-hidden"
          >
            {/* Upcoming */}
            {speaker.upcoming && (
              <div className="p-8 bg-gradient-to-r from-fuchsia-900/20 to-purple-900/10 border-b border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-geist uppercase tracking-widest text-cyan-400">
                    Next Transmission
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-clash font-bold text-white mb-2">
                  {speaker.upcoming}
                </h3>
                <button className="mt-4 px-6 py-2 bg-white text-black rounded-full text-sm font-semibold hover:bg-cyan-50 transition-colors flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> RSVP Now
                </button>
              </div>
            )}

            {/* Past Events List */}
            <div className="p-8">
              <h3 className="text-xs font-geist uppercase tracking-widest text-white/40 mb-6">
                Historical Data
              </h3>
              <div className="space-y-4">
                {speaker.past_events?.map((event, i) => (
                  <div
                    key={i}
                    className="group flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                  >
                    <div className="flex flex-col">
                      <span className="text-[10px] font-geist text-white/40 mb-1">
                        {event.year}
                      </span>
                      <span className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                        {event.title}
                      </span>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-white/20 rotate-180 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: delay + 0.2 }}
    className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors"
  >
    <Icon className="w-5 h-5 text-fuchsia-400 mb-2" />
    <span className="text-2xl font-bold text-white font-clash">{value}</span>
    <span className="text-[10px] font-geist uppercase tracking-widest text-white/40">
      {label}
    </span>
  </motion.div>
);

const SocialBtn = ({ icon: Icon, href }) => {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 hover:scale-110 transition-all"
    >
      <Icon className="w-4 h-4" />
    </a>
  );
};

export default SpeakerDetails;
