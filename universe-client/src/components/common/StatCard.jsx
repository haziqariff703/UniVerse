import React from "react";
import { motion } from "framer-motion";
import NumberTicker from "@/components/ui/NumberTicker";

const StatCard = ({ label, value, suffix = "", delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative overflow-hidden rounded-xl bg-white/[1%] border border-white/[5%] p-6 transition-all duration-500 hover:bg-white/[2%] hover:border-white/[8%]"
    >
      {/* Number with Ticker */}
      <div className="mb-3">
        <h3 className="text-4xl md:text-5xl font-semibold text-white tabular-nums">
          <NumberTicker value={value} suffix={suffix} duration={2} />
        </h3>
      </div>

      {/* Label */}
      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">
        {label}
      </p>

      {/* Subtle hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
      </div>
    </motion.div>
  );
};

export default StatCard;
