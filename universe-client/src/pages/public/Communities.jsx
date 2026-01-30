import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Shield, LayoutGrid } from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { EnhancedHoverEffect } from "@/components/ui/enhanced-card-hover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import ClubDetailModal from "@/components/common/ClubDetailModal";
import { clubDatabase, getAllClubs } from "@/data/clubsData";

const Communities = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClub, setSelectedClub] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const placeholders = [
    "Search for 'IMSA' or 'SMF'...",
    "Looking for 'Records Management'?",
    "Find creative clubs like 'CASA'...",
    "Search by tagline or keywords...",
    "What's happening in Academic units?",
    "Find 'Leadership' organizations...",
  ];

  // Filter function - searches across title, tagline, and tags
  const filterClubs = (clubs) => {
    if (!searchTerm.trim()) return clubs;

    const search = searchTerm.toLowerCase();
    return clubs.filter((club) => {
      const matchesTitle = club.title.toLowerCase().includes(search);
      const matchesTagline = club.tagline.toLowerCase().includes(search);
      const matchesTags = club.tags.some((tag) =>
        tag.toLowerCase().includes(search),
      );
      const matchesDescription = club.description
        .toLowerCase()
        .includes(search);

      return (
        matchesTitle || matchesTagline || matchesTags || matchesDescription
      );
    });
  };

  // Get filtered data for each category
  const filteredAll = filterClubs(getAllClubs());
  const filteredAcademic = filterClubs(clubDatabase.academic);
  const filteredLeadership = filterClubs(clubDatabase.leadership);
  const filteredUniformed = filterClubs(clubDatabase.uniformed);

  // Handle card click
  const handleCardClick = (club) => {
    setSelectedClub(club);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedClub(null), 300); // Wait for animation
  };

  return (
    <div className="min-h-screen pt-6 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <TextGenerateEffect
            words={[
              { text: "Student" },
              { text: "Organizations" },
              { text: "&" },
              {
                text: "Communities",
                className:
                  "bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent",
              },
            ]}
            staggerDelay={0.5}
            className="text-4xl md:text-6xl font-clash font-bold text-white mb-4"
          />
          <p className="text-lg text-muted-foreground max-w-2xl text-slate-400 font-clash">
            A centralized directory for UiTM Puncak Perdana registered units.
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-2xl">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSubmit={(e) => e.preventDefault()}
            />
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 bg-slate-950/40 backdrop-blur-xl border border-white/5 p-1 rounded-xl h-auto">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 transition-all flex items-center gap-2 font-clash py-2.5"
            >
              <LayoutGrid className="w-4 h-4" />
              All ({filteredAll.length})
            </TabsTrigger>
            <TabsTrigger
              value="academic"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 transition-all flex items-center gap-2 font-clash py-2.5"
            >
              <BookOpen className="w-4 h-4" />
              Academic ({filteredAcademic.length})
            </TabsTrigger>
            <TabsTrigger
              value="leadership"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 transition-all flex items-center gap-2 font-clash py-2.5"
            >
              <Users className="w-4 h-4" />
              Leadership ({filteredLeadership.length})
            </TabsTrigger>
            <TabsTrigger
              value="uniformed"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 transition-all flex items-center gap-2 font-clash py-2.5"
            >
              <Shield className="w-4 h-4" />
              Uniformed ({filteredUniformed.length})
            </TabsTrigger>
          </TabsList>

          {/* All Organizations */}
          <TabsContent value="all" className="mt-0">
            {filteredAll.length > 0 ? (
              <EnhancedHoverEffect
                items={filteredAll}
                onCardClick={handleCardClick}
              />
            ) : (
              <EmptyState searchTerm={searchTerm} />
            )}
          </TabsContent>

          {/* Academic Organizations */}
          <TabsContent value="academic" className="mt-0">
            {filteredAcademic.length > 0 ? (
              <EnhancedHoverEffect
                items={filteredAcademic}
                onCardClick={handleCardClick}
              />
            ) : (
              <EmptyState searchTerm={searchTerm} />
            )}
          </TabsContent>

          {/* Leadership Organizations */}
          <TabsContent value="leadership" className="mt-0">
            {filteredLeadership.length > 0 ? (
              <EnhancedHoverEffect
                items={filteredLeadership}
                onCardClick={handleCardClick}
              />
            ) : (
              <EmptyState searchTerm={searchTerm} />
            )}
          </TabsContent>

          {/* Uniformed Organizations */}
          <TabsContent value="uniformed" className="mt-0">
            {filteredUniformed.length > 0 ? (
              <EnhancedHoverEffect
                items={filteredUniformed}
                onCardClick={handleCardClick}
              />
            ) : (
              <EmptyState searchTerm={searchTerm} />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Club Detail Modal */}
      <ClubDetailModal
        club={selectedClub}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
};

// Empty state component
const EmptyState = ({ searchTerm }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 px-4"
  >
    <div className="text-center max-w-md">
      <div className="mb-4 text-6xl">🔍</div>
      <h3 className="text-xl font-clash font-bold text-foreground mb-2">
        No organizations found
      </h3>
      <p className="text-muted-foreground text-sm font-clash">
        {searchTerm
          ? `No results for "${searchTerm}". Try a different search term.`
          : "No organizations available in this category."}
      </p>
    </div>
  </motion.div>
);

export default Communities;
