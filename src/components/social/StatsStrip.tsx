"use client";

import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { stats } from "@/data/trust-badges";

export function StatsStrip() {
  return (
    <div className="w-full bg-gw-green py-6 md:py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-heading font-bold text-white">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                  immediate
                />
              </div>
              <div className="text-green-200 text-xs md:text-sm mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
