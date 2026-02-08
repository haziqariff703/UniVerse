import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Users,
  Search,
  ArrowRight,
  Loader,
  Box,
  CheckCircle2,
  Activity,
  ChevronRight,
} from "lucide-react";
import DecryptedText from "@/components/ui/DecryptedText";
import { resolveUrl } from "@/utils/urlHelper";

const OrganizerVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("All");

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/admin/venues", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setVenues(data.venues || []);
        } else {
          console.error("Failed to fetch venues");
        }
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location_code.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesCapacity = true;
    if (capacityFilter === "Large") matchesCapacity = venue.max_capacity >= 500;
    if (capacityFilter === "Medium")
      matchesCapacity = venue.max_capacity >= 100 && venue.max_capacity < 500;
    if (capacityFilter === "Small") matchesCapacity = venue.max_capacity < 100;

    return matchesSearch && matchesCapacity;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent text-white">
        <Loader className="animate-spin text-violet-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white pt-6 px-8 max-w-[1600px] mx-auto pb-20">
      {/* Header - Professional & High Contrast */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-white/10 pb-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-violet-500/10 text-violet-400 border-violet-500/20 text-[10px] tracking-widest uppercase py-0.5"
            >
              Asset Registry
            </Badge>
          </div>
          <h1 className="text-3xl font-clash font-bold tracking-tight text-white">
            <DecryptedText
              text="Campus Venues"
              speed={50}
              sequential={true}
              animateOn="view"
            />
          </h1>
          <p className="text-slate-400 text-sm">
            Monitor and manage all campus physical assets and schedules.
          </p>
        </div>

        {/* Technical Filter Bar using shadcn components */}
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={14}
            />
            <Input
              placeholder="Filter by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-zinc-950 border-white/10 text-xs h-10"
            />
          </div>
          <Select value={capacityFilter} onValueChange={setCapacityFilter}>
            <SelectTrigger className="w-[180px] bg-zinc-950 border-white/10 text-xs h-10">
              <SelectValue placeholder="All Capacities" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-white/10 text-white">
              <SelectItem value="All">All Scales</SelectItem>
              <SelectItem value="Small">Small (&lt;100)</SelectItem>
              <SelectItem value="Medium">Medium (100-500)</SelectItem>
              <SelectItem value="Large">Large (500+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* List - Solid High Contrast Horizontal Cards */}
      <div className="flex flex-col gap-4">
        {filteredVenues.map((venue) => (
          <Card
            key={venue._id}
            className="bg-zinc-950 border-white/10 hover:border-white/20 transition-all group overflow-hidden"
          >
            <Link
              to={`/organizer/venues/${venue._id}/events`}
              className="flex flex-col md:flex-row items-stretch"
            >
              {/* Image Section - High Contrast Clipping */}
              <div className="w-full md:w-72 h-48 md:h-auto flex-shrink-0 relative overflow-hidden">
                <img
                  src={resolveUrl(venue.image || venue.images?.[0] || "")}
                  alt={venue.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-950/80" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black/80 backdrop-blur-md text-white border-white/20 text-[10px] px-2 py-1">
                    {venue.location_code}
                  </Badge>
                </div>
              </div>

              {/* Data Section */}
              <CardContent className="flex-1 p-4 md:p-6 md:pr-8 flex flex-col md:flex-row items-center gap-4 md:gap-8 lg:gap-12">
                {/* Identity */}
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <h3 className="text-2xl font-bold text-white group-hover:text-violet-400 transition-colors truncate">
                    {venue.name}
                  </h3>
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <MapPin size={14} className="text-violet-500" />
                    <span className="text-xs font-bold tracking-widest uppercase">
                      LOC: {venue.location_code}
                    </span>
                  </div>
                </div>

                {/* Technical Specs */}
                <div className="flex items-center gap-12 border-x border-white/10 px-12 h-14">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">
                      Capacity
                    </span>
                    <div className="flex items-center gap-2.5 text-white">
                      <Users size={16} className="text-violet-500" />
                      <span className="text-xl font-bold">
                        {venue.max_capacity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Facilities */}
                <div className="hidden lg:flex flex-col gap-3 min-w-[180px]">
                  <span className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">
                    Facilities
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {venue.facilities?.slice(0, 3).map((facility, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="bg-white/10 text-[10px] font-bold border-none text-white px-3 py-1 shadow-sm"
                      >
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action */}
                <div className="ml-auto flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/5 group-hover:bg-violet-500 group-hover:border-violet-400 transition-all shadow-sm">
                  <ChevronRight
                    size={16}
                    className="text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5"
                  />
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}

        {filteredVenues.length === 0 && (
          <div className="py-24 text-center border border-dashed border-white/10 rounded-2xl bg-zinc-950/50">
            <Search size={32} className="mx-auto text-slate-700 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-1">
              No Venues Found
            </h3>
            <p className="text-slate-500 text-sm">
              Try adjusting your filters or search criteria.
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-16 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600 border-t border-white/5 pt-8">
        <p>© 2026 UniVerse Infrastructure Management</p>
        <div className="flex gap-8">
          <span className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Service Online
          </span>
          <span>Total Nodes: {venues.length}</span>
        </div>
      </div>
    </div>
  );
};

export default OrganizerVenues;
