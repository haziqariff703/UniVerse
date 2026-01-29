import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import CampusLifeInMotion from "@/components/sections/CampusLifeInMotion";
import FacultyShowcase from "@/components/sections/FacultyShowcase";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import Communities from "@/components/home/Communities";
import Footer from "@/components/common/Footer";
import FeaturedEventSlider from "@/components/public/FeaturedEventSlider";
import { FEATURED_EVENTS } from "@/data/mockEvents";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading for premium feel
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Hero />
      <Communities />
      <Stats />
      <CampusLifeInMotion />

      <FacultyShowcase />

      <main className="max-w-7xl mx-auto px-6 py-20" id="events">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-clash font-bold text-foreground mb-4">
              Upcoming{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Events
              </span>
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Curated experiences from across the universe.
            </p>
          </div>
          <Link
            to="/events"
            className="hidden md:block text-primary hover:text-foreground transition-colors"
          >
            View All &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : (
          <div className="w-full">
            <FeaturedEventSlider events={FEATURED_EVENTS} isSmall={true} />
          </div>
        )}
      </main>

      <Testimonials />
      <Newsletter />
      <Footer />
    </>
  );
};

export default Home;
