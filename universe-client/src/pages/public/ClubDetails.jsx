import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ArrowLeft } from "lucide-react";
import ClubHero from "@/components/communities/ClubHero";
import ClubEvents from "@/components/communities/ClubEvents";
import JoinClubModal from "@/components/communities/JoinClubModal";

// Dummy Data (In real app, fetch based on ID)
const getClubData = (id) => {
  // Return mock data for any ID for now
  return {
    id: id,
    name: "Tech Innovators Club",
    category: "Technology",
    members: "1.2k",
    isOpen: true, // Simulate Open status
    description:
      "A community for tech enthusiasts to collaborate on projects, hackathons, and innovative solutions. We aim to bridge the gap between academic learning and industry standards.",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200",
    perks: [
      "Access to exclusive hackathons",
      "Free detailed workshops",
      "Networking with industry leaders",
    ],
    events: [
      {
        title: "Introduction to AI Workshop",
        date: "March 20, 2026",
        time: "2:00 PM",
        location: "Lab B01",
        image:
          "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400",
      },
      {
        title: "Annual Hackathon Kickoff",
        date: "April 05, 2026",
        time: "9:00 AM",
        location: "Grand Hall",
        image:
          "https://images.unsplash.com/photo-1504384308090-c54be3852f33?auto=format&fit=crop&q=80&w=400",
      },
    ],
  };
};

const ClubDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Simulate API fetch delay
    setTimeout(() => {
      const data = getClubData(id);
      setClub(data);
    }, 100);
  }, [id]);

  if (!club)
    return (
      <div className="min-h-screen pt-28 flex justify-center text-foreground text-xl">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen pt-6 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/communities")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Communities
        </button>

        {/* Hero Section */}
        <ClubHero club={club} onJoinClick={() => setIsModalOpen(true)} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details & Perks */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                About Us
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {club.description}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Member Perks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {club.perks.map((perk, idx) => (
                  <div
                    key={idx}
                    className="bg-card border border-border p-4 rounded-xl flex items-center gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-violet-500" />
                    <span className="text-muted-foreground">{perk}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Vibe Check Gallery (Placeholder) */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Vibe Check
              </h2>
              <div className="grid grid-cols-3 gap-4 h-48">
                <div className="bg-muted rounded-xl border border-border flex items-center justify-center text-muted-foreground">
                  Gallery Img 1
                </div>
                <div className="bg-muted rounded-xl border border-border flex items-center justify-center text-muted-foreground">
                  Gallery Img 2
                </div>
                <div className="bg-muted rounded-xl border border-border flex items-center justify-center text-muted-foreground">
                  Gallery Img 3
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Events & Sidebar */}
          <div className="space-y-8">
            <ClubEvents events={club.events} />

            {/* Additional Sidebar Info could go here (e.g., Executive Board) */}
          </div>
        </div>
      </div>

      {/* Join Modal */}
      <JoinClubModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clubName={club.name}
      />
    </div>
  );
};

export default ClubDetails;
