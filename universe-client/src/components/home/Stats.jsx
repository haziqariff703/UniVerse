import React from "react";
import StatCard from "@/components/common/StatCard";

const Stats = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-clash font-bold text-foreground mb-4">
            Campus at a{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Glance
            </span>
          </h2>
          <p className="text-base text-muted-foreground">
            Real-time metrics from Puncak Perdana
          </p>
        </div>

        {/* Stats Grid - Single Row, Equal Spacing */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            label="Active Students"
            value={10000}
            suffix="+"
            delay={0.1}
          />
          <StatCard label="Campus Events" value={500} suffix="+" delay={0.2} />
          <StatCard label="Academic Faculties" value={2} delay={0.3} />
          <StatCard label="Engagement Rate" value={98} suffix="%" delay={0.4} />
        </div>
      </div>
    </section>
  );
};

export default Stats;
