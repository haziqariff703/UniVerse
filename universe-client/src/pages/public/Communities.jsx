import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Shield } from "lucide-react";
import GradientText from "@/components/ui/GradientText";
import { EnhancedHoverEffect } from "@/components/ui/enhanced-card-hover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchBar from "@/components/common/SearchBar";
import ClubDetailModal from "@/components/common/ClubDetailModal";
import { clubDatabase } from "@/data/clubsData";

const Communities = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClub, setSelectedClub] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <h1 className="text-4xl md:text-6xl font-clash font-bold text-foreground mb-4">
            Student Organizations &{" "}
            <GradientText
              colors={["#7c3aed", "#a78bfa", "#7c3aed", "#a78bfa", "#7c3aed"]}
              animationSpeed={3}
              showBorder={false}
              className="px-0"
            >
              Communities
            </GradientText>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-slate-400">
            A centralized directory for UiTM Puncak Perdana registered units.
          </p>
        </motion.div>

        {/* Search Bar */}
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search organizations by name, tagline, or tags..."
        />

        {/* Tabs Section */}
        <Tabs defaultValue="academic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-950/40 backdrop-blur-xl border border-white/5 p-1 rounded-xl">
            <TabsTrigger
              value="academic"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 transition-all flex items-center gap-2 font-clash"
            >
              <BookOpen className="w-4 h-4" />
              Academic ({filteredAcademic.length})
            </TabsTrigger>
            <TabsTrigger
              value="leadership"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 transition-all flex items-center gap-2 font-clash"
            >
              <Users className="w-4 h-4" />
              Leadership ({filteredLeadership.length})
            </TabsTrigger>
            <TabsTrigger
              value="uniformed"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 transition-all flex items-center gap-2 font-clash"
            >
              <Shield className="w-4 h-4" />
              Uniformed ({filteredUniformed.length})
            </TabsTrigger>
          </TabsList>

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
      <p className="text-muted-foreground text-sm">
        {searchTerm
          ? `No results for "${searchTerm}". Try a different search term.`
          : "No organizations available in this category."}
      </p>
    </div>
  </motion.div>
);

export default Communities;
