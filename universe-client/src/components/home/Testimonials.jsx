import React from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const testimonials = [
  {
    quote:
      "UniVerse made organizing our IM Career Fair a breeze. We coordinated with record management students seamlessly.",
    name: "Siti Khadijah",
    title: "IM Faculty",
  },
  {
    quote:
      "Found my entire crew for the FiTA Theater Night through this platform. The talent is all here.",
    name: "Megat Naufal",
    title: "FiTA Faculty",
  },
  {
    quote:
      "A definitive hub for both IM and FiTA. From coding workshops to screenings, I never feel disconnected.",
    name: "Faris Afizuan",
    title: "IM + FiTA",
  },
  {
    quote:
      "Discovered amazing film production workshops and connected with talented cinematographers. This platform brings our creative community together.",
    name: "Nurul Aisyah",
    title: "FiTA Faculty",
  },
  {
    quote:
      "From digital archives seminars to game dev meetups, UniVerse keeps me updated on everything happening across both faculties. It's indispensable.",
    name: "Ahmad Zaki",
    title: "IM Faculty",
  },
];

const Testimonials = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-clash font-bold text-foreground mb-4">
            Voices from the{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Void
            </span>
          </h2>
          <p className="text-base text-muted-foreground">
            Real stories from Puncak Perdana's IM and FiTA community
          </p>
        </div>

        {/* Infinite Moving Cards */}
        <InfiniteMovingCards
          items={testimonials}
          direction="left"
          speed="slow"
          pauseOnHover={true}
        />
      </div>
    </section>
  );
};

export default Testimonials;
