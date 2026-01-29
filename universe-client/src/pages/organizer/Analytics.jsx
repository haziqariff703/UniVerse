import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  Users,
  Star,
  MessageSquare,
} from "lucide-react";
import SentimentGauge from "@/components/organizer/analytics/SentimentGauge";
import ReviewFeed from "@/components/organizer/analytics/ReviewFeed";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Analytics = () => {
  // const [loading, setLoading] = useState(true);
  // Simulate API call
  // setTimeout(() => setLoading(false), 800);

  // Mock Data
  const stats = {
    totalReviews: 128,
    avgRating: 4.6,
    sentimentScore: 88,
    retentionRate: "+12%",
  };

  const reviews = [
    {
      id: 1,
      user_name: "Sarah Jenkins",
      user_initials: "SJ",
      event_title: "Tech Innovation Summit",
      rating: 5,
      comment:
        "Absolutely mind-blowing speakers! The venue was top-notch and networking was great.",
      date: "2h ago",
      sentiment: "positive",
    },
    {
      id: 2,
      user_name: "Mike Ross",
      user_initials: "MR",
      event_title: "AI Workshop 2024",
      rating: 4,
      comment:
        "Great content, but the AC was a bit too cold. Otherwise perfect.",
      date: "5h ago",
      sentiment: "positive",
    },
    {
      id: 3,
      user_name: "Jessica Pearson",
      user_initials: "JP",
      event_title: "Startup Pitch Night",
      rating: 5,
      comment: "Found my co-founder here. Best event of the year!",
      date: "1d ago",
      sentiment: "positive",
    },
    {
      id: 4,
      user_name: "Louis Litt",
      user_initials: "LL",
      event_title: "Tech Innovation Summit",
      rating: 2,
      comment: "Registration queue was too long. Need better management.",
      date: "2d ago",
      sentiment: "negative",
    },
  ];

  const chartData = [
    { name: "5 Stars", value: 85 },
    { name: "4 Stars", value: 30 },
    { name: "3 Stars", value: 8 },
    { name: "2 Stars", value: 4 },
    { name: "1 Star", value: 1 },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-neuemontreal font-bold text-white mb-1">
            Analytics & Feedback
          </h1>
          <p className="text-white/40 text-sm">Measure your event impact</p>
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
            label: "Retention",
            value: stats.retentionRate,
            icon: Users,
            color: "text-blue-400",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-[#050505] border border-white/10 rounded-2xl p-5 shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/5 rounded-lg">
                <stat.icon size={20} className={stat.color} />
              </div>
              <span className="text-xs font-bold bg-white/5 px-2 py-1 rounded text-white/60">
                Last 30 Days
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
        {/* Left Col: Charts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Sentiment Gauge & Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#050505] border border-white/10 rounded-3xl p-8 shadow-xl">
            <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 pb-8 md:pb-0 md:pr-8">
              <h3 className="text-lg font-bold text-white mb-6">
                Overall Sentiment
              </h3>
              <SentimentGauge score={stats.sentimentScore} />
              <p className="text-center text-sm text-gray-400 mt-4 px-8">
                Your events are performing in the top{" "}
                <span className="text-emerald-400 font-bold">5%</span> of
                organizers this month.
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
                      width={50}
                      tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#050505",
                        borderColor: "#333",
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

        {/* Right Col: Feed */}
        <div className="lg:col-span-1">
          <div className="bg-[#050505] border border-white/10 rounded-3xl p-6 shadow-xl h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Recent Feedback</h3>
              <button className="text-xs font-bold text-violet-400 hover:text-violet-300">
                View All
              </button>
            </div>
            <ReviewFeed reviews={reviews} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
