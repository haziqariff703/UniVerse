import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Users, ArrowRight } from "lucide-react";

const VenueCard = ({ venue, index }) => {
  const { id, name, location_code, max_capacity, image, facilities } = venue;

  return (
    <Link
      to={`/venues/${id}`}
      className="group relative block h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-accent border border-white/10">
          {location_code}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
          {name}
        </h3>

        <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-violet-400" />
            <span>{max_capacity} Cap</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-violet-400" />
            <span>Campus Main</span>
          </div>
        </div>

        {/* Facilities Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {facilities.slice(0, 3).map((facility, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5"
            >
              {facility}
            </span>
          ))}
          {facilities.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-400 border border-white/5">
              +{facilities.length - 3}
            </span>
          )}
        </div>

        {/* Action */}
        <div className="flex items-center text-accent text-sm font-medium group-hover:translate-x-1 transition-transform">
          View Venue Details <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </Link>
  );
};

export default VenueCard;
