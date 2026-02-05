import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  Users,
  Star,
  MessageSquare,
  Activity,
  PieChart,
  Lightbulb,
  Award,
  AlertTriangle,
  Info,
  CheckCircle2,
} from "lucide-react";
import SentimentGauge from "@/components/organizer/analytics/SentimentGauge";
import ReviewFeed from "@/components/organizer/analytics/ReviewFeed";
import ReviewsModal from "@/components/organizer/analytics/ReviewsModal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReviews: 0,
    avgRating: 0,
    sentimentScore: 0,
    totalEvents: 0,
  });
  const [reviews, setReviews] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [categoryInsights, setCategoryInsights] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch Analytics Stats
        const statsRes = await fetch(
          "http://localhost:5000/api/events/organizer/analytics",
          { headers },
        );
        const statsData = await statsRes.json();

        if (statsData) {
          setStats({
            totalReviews: statsData.totalReviews || 0,
            avgRating: statsData.avgRating || 0,
            sentimentScore: statsData.sentimentScore || 0,
            totalEvents: statsData.totalEvents || 0,
          });
          setChartData(statsData.chartData || []);
        }

        // Fetch Recent Reviews (first 4-5 for the dashboard)
        const reviewsRes = await fetch(
          "http://localhost:5000/api/events/organizer/reviews",
          { headers },
        );
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData?.slice(0, 5) || []);

        // Fetch Events (for filtering in the modal)
        const eventsRes = await fetch(
          "http://localhost:5000/api/events/my-events",
          { headers },
        );
        const eventsData = await eventsRes.json();
        setEvents(eventsData || []);

        // Fetch Category Intelligence
        const categoryRes = await fetch(
          "http://localhost:5000/api/events/organizer/category-intelligence",
          { headers },
        );
        const categoryResData = await categoryRes.json();
        setCategoryData(categoryResData?.categoryData || []);
        setCategoryInsights(categoryResData?.insights || []);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 font-neuemontreal tracking-widest uppercase text-xs">
            Synchronizing Intelligence
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-clash font-bold text-white mb-1">
            Analytics & Feedback
          </h1>
          <p className="text-white/40 text-sm">
            Measure your event impact in real-time
          </p>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Reviews",
            value: stats.totalReviews,
            icon: MessageSquare,
            color: "text-violet-400",
          },
          {
            label: "Avg Rating",
            value: stats.avgRating,
            icon: Star,
            color: "text-amber-400",
          },
          {
            label: "Sentiment",
            value: `${stats.sentimentScore}%`,
            icon: TrendingUp,
            color: "text-emerald-400",
          },
          {
            label: "Active Events",
            value: stats.totalEvents,
            icon: Activity,
            color: "text-blue-400",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="group bg-[#050505] border border-white/10 rounded-2xl p-5 shadow-lg hover:border-white/20 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                <stat.icon size={20} className={stat.color} />
              </div>
              <span className="text-xs font-bold bg-white/5 px-2 py-1 rounded text-white/60">
                Live Data
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sentiment Gauge & Breakdown */}
        <div className="lg:col-span-2 bg-[#050505] border border-white/10 rounded-3xl p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 pb-8 md:pb-0 md:pr-8">
              <h3 className="text-lg font-bold text-white mb-6 text-center w-full">
                Overall Sentiment
              </h3>
              <SentimentGauge score={stats.sentimentScore} />
              <p className="text-center text-sm text-gray-400 mt-4 px-8">
                Your events are maintaining a{" "}
                <span className="text-emerald-400 font-bold">
                  {stats.sentimentScore}%
                </span>{" "}
                positive response rate.
              </p>
            </div>
            <div className="pl-0 md:pl-8 pt-8 md:pt-0">
              <h3 className="text-lg font-bold text-white mb-6">
                Rating Distribution
              </h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ left: 0, right: 20 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={60}
                      tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#050505",
                        borderColor: "#333",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "#fff", fontSize: 12 }}
                      cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#8b5cf6"
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="lg:col-span-1 bg-[#050505] border border-white/10 rounded-3xl p-8 shadow-xl flex flex-col h-full min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Recent Feedback</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors bg-violet-400/5 px-3 py-1.5 rounded-lg border border-violet-400/10"
            >
              View All
            </button>
          </div>
          <ReviewFeed reviews={reviews} />
        </div>

        {/* Category Intelligence Matrix */}
        {categoryData.length > 0 && (
          <>
            <div className="lg:col-span-2 bg-[#050505] border border-white/10 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-violet-500/10 rounded-lg">
                  <PieChart size={20} className="text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                    Category Matrix
                  </h3>
                  <p className="text-xs text-white/40">
                    Performance mapping by event category
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {categoryData.map((cat, i) => {
                  const classColor =
                    {
                      "High Performer":
                        "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
                      "Quality Issue":
                        "bg-red-500/10 border-red-500/30 text-red-400",
                      "Community Builder":
                        "bg-blue-500/10 border-blue-500/30 text-blue-400",
                      "Needs Attention":
                        "bg-amber-500/10 border-amber-500/30 text-amber-400",
                      Neutral: "bg-white/5 border-white/10 text-white/60",
                    }[cat.classification] ||
                    "bg-white/5 border-white/10 text-white/60";

                  return (
                    <div
                      key={i}
                      className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-violet-500/30 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-white">
                            {cat.category}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${classColor}`}
                          >
                            {cat.classification}
                          </span>
                        </div>
                        <span className="text-xs text-white/40 font-bold">
                          {cat.totalEvents} EVENTS
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold text-white">
                            RM{cat.totalRevenue.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">
                            Revenue
                          </p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-white">
                            {cat.totalAttendees}
                          </p>
                          <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">
                            Attendees
                          </p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-amber-400">
                            {cat.avgRating || "-"}
                          </p>
                          <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">
                            Avg Rating
                          </p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-emerald-400">
                            {cat.sentimentScore}%
                          </p>
                          <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">
                            Positive
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Strategic Insights */}
            <div className="lg:col-span-1 bg-[#050505] border border-white/10 rounded-3xl p-8 shadow-xl flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Lightbulb size={20} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                    Post-Mortem
                  </h3>
                  <p className="text-xs text-white/40">
                    Strategic decision support
                  </p>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                {categoryInsights.map((insight, i) => {
                  const iconMap = {
                    success: (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    ),
                    warning: (
                      <AlertTriangle size={18} className="text-amber-400" />
                    ),
                    info: <Info size={18} className="text-blue-400" />,
                  };
                  const borderMap = {
                    success:
                      "border-emerald-500/20 hover:border-emerald-500/40",
                    warning: "border-amber-500/20 hover:border-amber-500/40",
                    info: "border-blue-500/20 hover:border-blue-500/40",
                  };
                  return (
                    <div
                      key={i}
                      className={`p-5 rounded-2xl bg-white/[0.02] border transition-all ${borderMap[insight.type]}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-0.5">{iconMap[insight.type]}</div>
                        <div>
                          <p className="text-sm font-bold text-white mb-2">
                            {insight.title}
                          </p>
                          <p className="text-xs text-white/60 mb-3 leading-relaxed">
                            {insight.message}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] font-black text-violet-400 uppercase tracking-widest">
                            <TrendingUp size={10} />
                            {insight.action}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Reviews Explorer Modal */}
      <ReviewsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        events={events}
      />
    </div>
  );
};

export default Analytics;
