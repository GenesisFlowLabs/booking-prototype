"use client";

import { motion } from "framer-motion";
import { Star, Shield, Award, Trophy, BadgeCheck } from "lucide-react";
import { trustBadges } from "@/data/trust-badges";

const iconMap: Record<string, React.ElementType> = {
  google: Star,
  bbb: Shield,
  inc5000: Trophy,
  internachi: BadgeCheck,
  ashi: Award,
};

export function TrustBar() {
  return (
    <div className="w-full overflow-hidden py-4 bg-white/60 border-y border-gray-100">
      <motion.div
        className="flex items-center gap-8 md:gap-12 justify-center flex-wrap px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {trustBadges.map((badge) => {
          const Icon = iconMap[badge.id] || Shield;
          return (
            <div
              key={badge.id}
              className="flex items-center gap-2 text-gray-500 whitespace-nowrap"
            >
              <Icon className="w-5 h-5 text-gw-green/70" />
              <span className="text-xs md:text-sm font-medium">
                {badge.value || badge.name}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
