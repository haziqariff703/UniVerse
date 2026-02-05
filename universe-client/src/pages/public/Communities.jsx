import { useState, useMemo, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  Shield,
  LayoutGrid,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { EnhancedHoverEffect } from "@/components/ui/enhanced-card-hover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import ClubDetailModal from "@/components/common/ClubDetailModal";

const API_BASE = "http://localhost:5000";

// Helper for distinct fallback images based on category
const getCategoryPlaceholder = (category) => {
  switch (category) {
    case "Creative":
      return "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071&auto=format&fit=crop";
    case "Academic":
      return "https://images.unsplash.com/photo-1523050335456-c684e040ae73?q=80&w=2070&auto=format&fit=crop";
    case "FYP":
      return "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop";
    default:
      return "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop";
  }
};

const Communities = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClub, setSelectedClub] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [categories, setCategories] = useState([]);

  // Real Auth Logic
  const [user] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Failed to parse user", e);
      return null;
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchOps = [
          fetch(`${API_BASE}/api/communities`),
          fetch(`${API_BASE}/api/categories`),
        ];

        // If user is logged in, fetch their joined communities
        const token = localStorage.getItem("token");
        if (token && user) {
          fetchOps.push(
            fetch(`${API_BASE}/api/communities/my-communities`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          );
        }

        const results = await Promise.all(fetchOps);
        const [commRes, catRes, joinedRes] = results;

        if (commRes.ok) {
          const data = await commRes.json();
          const mapped = data.map((c) => ({
            id: String(c._id),
            slug: c.slug,
            title: c.name,
            fullName: c.name,
            tagline: c.tagline,
            description: c.description,
            image:
              (c.banner
                ? c.banner.startsWith("http")
                  ? c.banner
                  : `${API_BASE}${c.banner}`
                : null) ||
              (c.logo
                ? c.logo.startsWith("http")
                  ? c.logo
                  : `${API_BASE}${c.logo}`
                : null) ||
              getCategoryPlaceholder(c.category),
            logo: c.logo
              ? c.logo.startsWith("http")
                ? c.logo
                : `${API_BASE}${c.logo}`
              : null,
            banner: c.banner
              ? c.banner.startsWith("http")
                ? c.banner
                : `${API_BASE}${c.banner}`
              : null,
            category: c.category,
            tags: [c.category, "UiTM"],
            members: c.stats?.member_count || 0,
            founded: c.stats?.founded_year || "2024",
            social: {
              instagram: c.social_links?.instagram || "@uitm",
              email: c.advisor?.email || "info@uitm.edu.my",
            },
            meritYield: c.category === "Academic" ? "High" : "Standard",
          }));
          setCommunities(mapped);
        }

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }

        if (joinedRes && joinedRes.ok) {
          const joinedData = await joinedRes.json();
          const mappedJoined = joinedData.map((c) => ({
            id: String(c._id),
            slug: c.slug,
            title: c.name,
            fullName: c.name,
            tagline: c.tagline,
            description: c.description,
            image:
              (c.banner
                ? c.banner.startsWith("http")
                  ? c.banner
                  : `${API_BASE}${c.banner}`
                : null) ||
              (c.logo
                ? c.logo.startsWith("http")
                  ? c.logo
                  : `${API_BASE}${c.logo}`
                : null) ||
              getCategoryPlaceholder(c.category),
            logo: c.logo
              ? c.logo.startsWith("http")
                ? c.logo
                : `${API_BASE}${c.logo}`
              : null,
            banner: c.banner
              ? c.banner.startsWith("http")
                ? c.banner
                : `${API_BASE}${c.banner}`
              : null,
            category: c.category,
            tags: [c.category, "UiTM"],
            members: c.stats?.member_count || 0,
            founded: c.stats?.founded_year || "2024",
            social: {
              instagram: c.social_links?.instagram || "@uitm",
              email: c.advisor?.email || "info@uitm.edu.my",
            },
            meritYield: c.category === "Academic" ? "High" : "Standard",
          }));
          setJoinedCommunities(mappedJoined);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [user]);

  const placeholders = [
    "Search for 'IMSA' or 'SMF'...",
    "Looking for 'Records Management'?",
    "Find creative clubs like 'CASA'...",
    "Search by tagline or keywords...",
    "What's happening in Academic units?",
    "Find 'Leadership' organizations...",
  ];

  // Filter function - searches across title, tagline, and tags
  const filterClubs = useCallback(
    (clubs) => {
      if (!searchTerm.trim()) return clubs;

      const search = searchTerm.toLowerCase();
      return clubs.filter((club) => {
        const matchesTitle = club?.title?.toLowerCase().includes(search);
        const matchesTagline = club?.tagline?.toLowerCase().includes(search);
        const matchesTags = club?.tags?.some((tag) =>
          tag.toLowerCase().includes(search),
        );
        const matchesDescription = club?.description
          ?.toLowerCase()
          .includes(search);

        return (
          matchesTitle || matchesTagline || matchesTags || matchesDescription
        );
      });
    },
    [searchTerm],
  );

  // Segment Data
  const myCommunities = useMemo(() => {
    if (!user || user.role !== "student") return [];

    // Prioritize API data if available, otherwise fallback to local IDs
    if (joinedCommunities.length > 0) {
      return filterClubs(joinedCommunities);
    }

    // Fallback to local storage IDs (kept for resilience)
    if (user.memberClubIds) {
      return filterClubs(
        communities.filter((c) => user.memberClubIds.includes(c.id)),
      );
    }

    return [];
  }, [communities, joinedCommunities, user, filterClubs]);

  // Dynamic Tabs Generation
  const tabItems = useMemo(() => {
    const baseTabs = [
      {
        value: "joined",
        label: "Joined",
        icon: CheckCircle,
        activeColor: "text-cyan-300",
        bg: "bg-cyan-500/20",
        hidden: !user || user.role !== "student",
      },
      {
        value: "all",
        label: `All (${communities.length})`,
        icon: LayoutGrid,
        activeColor: "text-purple-300",
        bg: "bg-purple-500/20",
      },
    ];

    const dynamicTabs = categories.map((cat) => ({
      value: cat.name,
      label: cat.name, // e.g. "Academic", "FYP"
      icon: BookOpen, // Default icon
      activeColor: "text-purple-300",
      bg: "bg-purple-500/20",
      isDynamic: true,
    }));

    return [...baseTabs, ...dynamicTabs].filter((t) => !t.hidden);
  }, [categories, communities, user]);

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
    <div className="min-h-screen bg-transparent pt-0 pb-20 px-4 md:px-6">
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
            className={`grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-8 bg-slate-950/40 backdrop-blur-xl border border-white/5 p-1 rounded-xl h-auto relative`}
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

          {tabItems.map((tab) => {
            // Determine content for this tab
            let content = [];
            if (tab.value === "joined") {
              content = myCommunities;
            } else if (tab.value === "all") {
              content = filterClubs(communities);
            } else {
              // Filter by category name matching the tab value
              content = filterClubs(
                communities.filter((c) => c.category === tab.value),
              );
            }

            return (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="mt-0 focus-visible:outline-none focus-visible:ring-0"
              >
                {content.length > 0 ? (
                  <EnhancedHoverEffect
                    items={content}
                    onCardClick={handleCardClick}
                    user={user}
                  />
                ) : (
                  <EmptyState searchTerm={searchTerm} />
                )}
              </TabsContent>
            );
          })}
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
