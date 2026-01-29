import React, { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const OrganizerSpeakers = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const speakers = [
    {
      id: 1,
      name: "Dr. Aris Junaidi",
      role: "AI Ethics Specialist",
      expertise: "Artificial Intelligence",
      bio: "Former lead researcher at TechCorp, focusing on ethical AI development.",
      events: 4,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aris",
      links: { linkedin: "#", twitter: "#" },
    },
    {
      id: 2,
      name: "Nurul Izzah",
      role: "Sustainability Advocate",
      expertise: "Green Tech",
      bio: "Passionate about implementing sustainable practices in modern industries.",
      events: 2,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nurul",
      links: { linkedin: "#", twitter: "#" },
    },
    {
      id: 3,
      name: "Kevin Anderson",
      role: "Cloud Architect",
      expertise: "AWS/Azure",
      bio: "Helping startups scale their infrastructure with serverless architectures.",
      events: 7,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin",
      links: { linkedin: "#", twitter: "#" },
    },
    {
      id: 4,
      name: "Siti Aminah",
      role: "Digital Marketer",
      expertise: "Growth Hacking",
      bio: "Expert in performance marketing and community-led growth strategies.",
      events: 3,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
      links: { linkedin: "#", twitter: "#" },
    },
  ];

  const filteredSpeakers = speakers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.expertise.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-neuemontreal font-bold text-white mb-1">
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
          <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2 h-10">
            <Plus size={18} />
            <span className="hidden sm:inline">Add Speaker</span>
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSpeakers.length > 0 ? (
          filteredSpeakers.map((speaker) => (
            <div
              key={speaker.id}
              className="group bg-[#050505] border border-white/10 rounded-3xl p-6 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-white/10 text-white"
                    >
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-[#0f0f0f] border-white/10 text-white"
                  >
                    <DropdownMenuItem className="cursor-pointer">
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      Assign to Event
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-400 focus:text-red-400 cursor-pointer">
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-white/5 group-hover:border-violet-500/50 transition-colors">
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-[#050505]">
                    <Award size={12} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {speaker.name}
                </h3>
                <p className="text-xs text-violet-400 font-bold uppercase tracking-widest">
                  {speaker.role}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-white/40">
                  <BookOpen size={14} />
                  <span className="text-xs font-medium">
                    {speaker.expertise}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-white/40">
                  <Calendar size={14} />
                  <span className="text-xs font-medium">
                    {speaker.events} Events Hosted
                  </span>
                </div>
                <p className="text-xs text-white/30 leading-relaxed line-clamp-2">
                  {speaker.bio}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex gap-2">
                  <a
                    href={speaker.links.linkedin}
                    className="p-2 bg-white/5 rounded-lg hover:bg-blue-600/20 hover:text-blue-400 transition-colors text-white/40"
                  >
                    <Linkedin size={14} />
                  </a>
                  <a
                    href={speaker.links.twitter}
                    className="p-2 bg-white/5 rounded-lg hover:bg-sky-500/20 hover:text-sky-400 transition-colors text-white/40"
                  >
                    <Twitter size={14} />
                  </a>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 gap-2"
                >
                  Profile
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
    </div>
  );
};

export default OrganizerSpeakers;
