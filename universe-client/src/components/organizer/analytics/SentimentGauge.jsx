import React from "react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

const SentimentGauge = ({ score }) => {
  // score is 0 to 100
  const data = [{ name: "Score", value: score, fill: "#8b5cf6" }];

  return (
    <div className="relative w-full h-40 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          barSize={10}
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background
            clockWise
            dataKey="value"
            cornerRadius={10}
            fill="#8b5cf6"
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 text-center">
        <p className="text-3xl font-bold text-white">{score}</p>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
          NPS Score
        </p>
      </div>
    </div>
  );
};

export default SentimentGauge;
