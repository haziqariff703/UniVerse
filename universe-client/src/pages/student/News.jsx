import React, { useState } from "react";
import { motion } from "framer-motion";
import HeroCarousel from "@/components/news/HeroCarousel";
import SearchFilter from "@/components/news/SearchFilter";
import NewsCard from "@/components/news/NewsCard";
import Sidebar from "@/components/news/Sidebar";

const News = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Mock Data
  const carouselSlides = [
    {
      id: 1,
      title: "University Announces New AI Research Center",
      date: "March 15, 2026",
      category: "Academic",
      excerpt:
        "A state-of-the-art facility dedicated to advancing artificial intelligence research and development has been approved for construction.",
      image:
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1200",
    },
    {
      id: 2,
      title: "Annual Sports Gala Registration Open",
      date: "March 12, 2026",
      category: "Sports",
      excerpt:
        "Join us for the biggest sporting event of the year. Competitions include football, basketball, athletics, and e-sports.",
      image:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba0111?auto=format&fit=crop&q=80&w=1200",
    },
    {
      id: 3,
      title: "Student Startup Expo 2026 Winners",
      date: "March 10, 2026",
      category: "Innovation",
      excerpt:
        "Three student-led startups have secured seed funding after an intense pitch competition judged by industry leaders.",
      image:
        "https://images.unsplash.com/photo-1559136555-9303dff5a98b?auto=format&fit=crop&q=80&w=1200",
    },
  ];

  const newsItems = [
    {
      id: 4,
      title: "Library Hours Extended for Finals",
      date: "March 08, 2026",
      category: "Campus Life",
      excerpt:
        "Starting next week, the central library will remain open 24/7 to support students preparing for end-of-semester examinations. The new schedule accommodates late-night study sessions.",
      image:
        "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 5,
      title: "Global Cultural Festival Highlights",
      date: "March 05, 2026",
      category: "Events",
      excerpt:
        "Students from over 50 countries showcased their traditions, food, and music in a vibrant celebration of diversity. The event drew a record crowd of over 5,000 attendees.",
      image:
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 6,
      title: "New Sustainable Energy Initiative",
      date: "March 01, 2026",
      category: "Sustainability",
      excerpt:
        "The campus is going green with the installation of solar panels and a new recycling program aimed at reducing our carbon footprint by 30% over the next five years.",
      image:
        "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 7,
      title: "Computer Science Department Hackathon",
      date: "Feb 28, 2026",
      category: "Academic",
      excerpt:
        "Over 200 students participated in the 24-hour hackathon, developing innovative solutions for local community problems. The winning team created an app for food waste reduction.",
      image:
        "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const popularPosts = [
    {
      id: 101,
      title: "Top 10 Study Spots on Campus",
      date: "Feb 20, 2026",
      category: "Guide",
      image:
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 102,
      title: "Alumni Success Story: Sarah Chen",
      date: "Feb 18, 2026",
      category: "Alumni",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 103,
      title: "Guide to Campus Clubs & Societies",
      date: "Feb 15, 2026",
      category: "Life",
      image:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 104,
      title: "Internship Opportunities Fair",
      date: "Feb 10, 2026",
      category: "Career",
      image:
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=200",
    },
  ];

  const categories = [
    "Academic",
    "Sports",
    "Innovation",
    "Campus Life",
    "Events",
    "Sustainability",
  ];

  const filteredNews = newsItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-6 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <section>
          <HeroCarousel slides={carouselSlides} />
        </section>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-8">
            <SearchFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onSearch={setSearchTerm}
            />

            <div className="space-y-8">
              {filteredNews.length > 0 ? (
                filteredNews.map((item, index) => (
                  <NewsCard key={item.id} {...item} delay={index * 0.1} />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-10">
                  No news found matching your criteria.
                </p>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <button className="bg-muted hover:bg-accent text-foreground px-8 py-3 rounded-full font-medium transition-colors border border-border hover:border-violet-500/50">
                Load More Stories
              </button>
            </motion.div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Sidebar popularPosts={popularPosts} categories={categories} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default News;
