import React, { useState, useEffect } from "react";
import StatCard from "@/components/common/StatCard";

const Stats = () => {
  const [stats, setStats] = useState({
    studentCount: 10000,
    eventCount: 500,
    facultyCount: 2,
    engagementRate: 98,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/public/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Error fetching public stats:", err);
      }
    };
    fetchStats();
  }, []);

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
            value={stats.studentCount}
            suffix="+"
            delay={0.1}
          />
          <StatCard
            label="Campus Events"
            value={stats.eventCount}
            suffix="+"
            delay={0.2}
          />
          <StatCard
            label="Academic Faculties"
            value={stats.facultyCount}
            delay={0.3}
          />
          <StatCard
            label="Engagement Rate"
            value={stats.engagementRate}
            suffix="%"
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
};

export default Stats;
