import React from "react";
import StatCard from "@/components/common/StatCard";

const Stats = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Active Users" value={10000} suffix="+" delay={0.1} />
          <StatCard label="Total Events" value={500} suffix="+" delay={0.2} />
          {/* Slower duration for 'Planets Reached' to emphasize rarity */}
          <StatCard
            label="Planets Reached"
            value={12}
            duration={3}
            delay={0.3}
          />
          <StatCard label="Review Score" value={98} suffix="%" delay={0.4} />
        </div>
      </div>
    </section>
  );
};

export default Stats;
