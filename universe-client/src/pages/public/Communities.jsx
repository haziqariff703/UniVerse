import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, Shield, LayoutGrid, CheckCircle } from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { EnhancedHoverEffect } from "@/components/ui/enhanced-card-hover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import ClubDetailModal from "@/components/common/ClubDetailModal";
import { clubDatabase, getAllClubs } from "@/data/clubsData";

const Communities = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClub, setSelectedClub] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Real Auth Logic
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Failed to parse user", e);
      return null;
    }
  });

  // Mock Metadata Enrichment (Merit & Friends)
  const enrichedClubs = useMemo(() => {
    const all = getAllClubs();
    return all.map((club, index) => ({
      ...club,
      // Use index for deterministic mock data
      meritYield: index % 2 === 0 ? "High" : "Standard",
      friends:
        index === 1 // "casa" (index 1)
          ? [
              { id: 101, name: "Ali" },
              { id: 102, name: "Sarah" },
              { id: 103, name: "Ahmad" },
              { id: 104, name: "Tan" },
            ]
          : index === 8 // "smf" (index 8 approx)
            ? [
                { id: 105, name: "Mei" },
                { id: 106, name: "Raju" },
              ]
            : [],
    }));
  }, []);

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

  // Segment Data
  const myCommunities = useMemo(
    () =>
      user && user.role === "student" && user.memberClubIds
        ? filterClubs(
            enrichedClubs.filter((c) => user.memberClubIds.includes(c.id)),
          )
        : [],
    [enrichedClubs, searchTerm, user],
  );

  const allFiltered = useMemo(
    () => filterClubs(enrichedClubs),
    [enrichedClubs, searchTerm],
  );

  // Categorized Data
  const filteredAcademic = useMemo(
    () => filterClubs(enrichedClubs.filter((c) => c.category === "Academic")),
    [enrichedClubs, searchTerm],
  );
  const filteredLeadership = useMemo(
    () => filterClubs(enrichedClubs.filter((c) => c.category === "Leadership")),
    [enrichedClubs, searchTerm],
  );
  const filteredUniformed = useMemo(
    () => filterClubs(enrichedClubs.filter((c) => c.category === "Uniformed")),
    [enrichedClubs, searchTerm],
  );
  const filteredJoined = useMemo(
    () =>
      user && user.role === "student" && user.memberClubIds
        ? filterClubs(
            enrichedClubs.filter((c) => user.memberClubIds.includes(c.id)),
          )
        : [],
    [enrichedClubs, searchTerm, user],
  );

  // DEFINED AFTER DATA IS READY
  const tabItems = [
    {
      value: "joined",
      label: `Joined (${filteredJoined.length})`,
      icon: CheckCircle,
      activeColor: "text-cyan-300",
      bg: "bg-cyan-500/20",
    },
    {
      value: "all",
      label: `All (${allFiltered.length})`,
      icon: LayoutGrid,
      activeColor: "text-purple-300",
      bg: "bg-purple-500/20",
    },
    {
      value: "academic",
      label: `Academic (${filteredAcademic.length})`,
      icon: BookOpen,
      activeColor: "text-purple-300",
      bg: "bg-purple-500/20",
    },
    {
      value: "leadership",
      label: `Leadership (${filteredLeadership.length})`,
      icon: Users,
      activeColor: "text-purple-300",
      bg: "bg-purple-500/20",
    },
    {
      value: "uniformed",
      label: `Uniformed (${filteredUniformed.length})`,
      icon: Shield,
      activeColor: "text-purple-300",
      bg: "bg-purple-500/20",
    },
  ].filter((tab) => {
    // Hide 'Joined' tab for non-students (public users)
    if (tab.value === "joined") {
      return user && user.role === "student";
    }
    return true;
  });

  const navigate = useNavigate();

  // Handle card click
  const handleCardClick = (club) => {
    // RESTRICTION: Redirect public users to login
    if (!user) {
      navigate("/login");
      return;
    }
    setSelectedClub(club);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedClub(null), 300); // Wait for animation
  };

  return (
    <div className="min-h-screen pt-0 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
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

        {/* SECTION: My Communities (Priority Row) */}
        {myCommunities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-full bg-cyan-500/20">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white font-clash">
                Your Communities
              </h2>
            </div>
            <EnhancedHoverEffect
              items={myCommunities}
              onCardClick={handleCardClick}
              user={user}
              className="py-2"
            />
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-8" />
          </motion.div>
        )}

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className={`grid w-full grid-cols-2 mb-8 bg-slate-950/40 backdrop-blur-xl border border-white/5 p-1 rounded-xl h-auto relative ${tabItems.length === 4 ? "md:grid-cols-4" : "md:grid-cols-5"}`}
          >
            {tabItems.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="relative z-10 transition-all flex items-center gap-2 font-clash py-2.5 data-[state=active]:text-white"
              >
                {activeTab === tab.value && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 rounded-lg ${tab.bg}`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-20 flex items-center gap-2 ${activeTab === tab.value ? tab.activeColor : "text-muted-foreground"}`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Joined Content */}
          <TabsContent
            value="joined"
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            {filteredJoined.length > 0 ? (
              <EnhancedHoverEffect
                items={filteredJoined}
                onCardClick={handleCardClick}
                user={user}
              />
            ) : (
              <EmptyState
                searchTerm={searchTerm}
                message="You haven't joined any communities yet."
              />
            )}
          </TabsContent>

          {/* All Organizations */}
          <TabsContent
            value="all"
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            {allFiltered.length > 0 ? (
              <EnhancedHoverEffect
                items={allFiltered}
                onCardClick={handleCardClick}
                user={user}
              />
            ) : (
              <EmptyState searchTerm={searchTerm} />
            )}
          </TabsContent>

          {/* Academic Organizations */}
          <TabsContent
            value="academic"
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            {filteredAcademic.length > 0 ? (
              <EnhancedHoverEffect
                items={filteredAcademic}
                onCardClick={handleCardClick}
                user={user}
              />
            ) : (
              <EmptyState searchTerm={searchTerm} />
            )}
          </TabsContent>

          {/* Leadership Organizations */}
          <TabsContent
            value="leadership"
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            {filteredLeadership.length > 0 ? (
              <EnhancedHoverEffect
                items={filteredLeadership}
                onCardClick={handleCardClick}
                user={user}
              />
            ) : (
              <EmptyState searchTerm={searchTerm} />
            )}
          </TabsContent>

          {/* Uniformed Organizations */}
          <TabsContent
            value="uniformed"
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            {filteredUniformed.length > 0 ? (
              <EnhancedHoverEffect
                items={filteredUniformed}
                onCardClick={handleCardClick}
                user={user}
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
const EmptyState = ({ searchTerm, message }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 px-4"
  >
    <div className="text-center max-w-md">
      <div className="mb-4 text-6xl">🔍</div>
      <h3 className="text-xl font-clash font-bold text-foreground mb-2">
        {message || "No organizations found"}
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
