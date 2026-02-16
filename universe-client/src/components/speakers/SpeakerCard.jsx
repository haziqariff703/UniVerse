import React from "react";
import { Link } from "react-router-dom";
import { Linkedin, Twitter, Globe, ArrowUpRight } from "lucide-react";

const SpeakerCard = ({ speaker, index }) => {
  const { id, name, expertise, image, social_links } = speaker;

  return (
    <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
      <Link
        to={`/speakers/${id}`}
        className="block relative aspect-square overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opactiy-60 group-hover:opacity-40 transition-opacity" />
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
        />

        {/* Hover Reveal Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-violet-600/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <div className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
            View Profile <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </Link>

      <div className="p-5 relative z-30 bg-[#0F0F1A]">
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-violet-400 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-gray-400 mb-4 font-medium uppercase tracking-wider text-xs">
          {expertise}
        </p>

        {/* Social Icons */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          {social_links?.linkedin && (
            <a
              href={social_links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#0077b5] transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {social_links?.twitter && (
            <a
              href={social_links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#1DA1F2] transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}
          {social_links?.website && (
            <a
              href={social_links.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeakerCard;
