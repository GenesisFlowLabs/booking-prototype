"use client";

import { useBookingStore } from "@/store/booking";
import {
  homePackages,
  ncPackages,
  featureComparison,
  ncFeatureComparison,
  featureDescriptions,
} from "@/data/packages";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ArrowLeft, Check, X, Info, Star, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import { PackageTier } from "@/types/booking";

export function PackageStep() {
  const { selectedPackage, setPackage, nextStep, prevStep, serviceType } =
    useBookingStore();
  const continueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedPackage) {
      const timer = setTimeout(() => {
        continueRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedPackage]);

  const isNC = serviceType === "new-construction";
  const activePackages = isNC ? ncPackages : homePackages;
  const activeFeatures = isNC ? ncFeatureComparison : featureComparison;
  const tierKeys = isNC
    ? (["nc1", "nc2", "nc3"] as const)
    : (["green", "greener", "greenest"] as const);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
          Choose your inspection package
        </h2>
        <p className="text-gray-500 mt-2">
          {isNC
            ? "Flat-rate pricing for any size home. Every package includes certified inspectors and digital reports."
            : "Every package includes a certified inspector and detailed digital report."}
        </p>
      </div>

      {/* Package columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 md:items-start">
        {activePackages.map((pkg, colIdx) => {
          const tier = tierKeys[colIdx];
          const isSelected = selectedPackage === pkg.id;
          const isPopular = pkg.popular;

          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: colIdx * 0.1 }}
              className={`
                relative flex flex-col border transition-all duration-200
                ${isPopular
                  ? "md:-mt-4 md:scale-[1.02] rounded-2xl z-10"
                  : `rounded-2xl md:rounded-none ${colIdx === 0 ? "md:rounded-l-2xl" : ""} ${colIdx === activePackages.length - 1 ? "md:rounded-r-2xl" : ""}`
                }
                ${isSelected
                  ? "border-gw-green bg-gw-green/[0.03] ring-2 ring-gw-green shadow-xl z-20"
                  : isPopular
                    ? "border-[3px] border-amber-400 bg-white shadow-xl ring-1 ring-amber-200"
                    : "border-gw-green/30 bg-white"
                }
              `}
            >
              {/* Popular badge + ribbon */}
              {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold shadow-lg bg-amber-400 text-amber-900 whitespace-nowrap">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              {/* Header */}
              <div className={`p-5 md:p-6 text-center border-b ${isPopular ? "pt-8" : ""} ${isSelected ? "border-gw-green/20" : isPopular ? "border-amber-200" : "border-gray-100"}`}>
                <h3 className={`text-xl font-heading font-bold ${isSelected || isPopular ? "text-gw-green" : "text-gray-900"}`}>
                  {pkg.name}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">{pkg.tagline}</p>
                {isPopular && (
                  <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-amber-600 font-semibold">
                    <Shield className="w-3.5 h-3.5" />
                    Best value for most homes
                  </div>
                )}
              </div>

              {/* Feature list */}
              <div className="flex-1 p-4 md:p-5">
                <ul className="space-y-0">
                  {activeFeatures.map((feature, i) => {
                    const included = (feature as unknown as Record<string, boolean>)[tier];
                    const desc = featureDescriptions[feature.name];

                    return (
                      <li
                        key={feature.name}
                        className={`flex items-start gap-2.5 py-2.5 group/feat relative ${
                          i < activeFeatures.length - 1 ? "border-b border-gray-50" : ""
                        }`}
                      >
                        {included ? (
                          <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-gw-green" strokeWidth={2.5} />
                        ) : (
                          <X className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-300/70" strokeWidth={2} />
                        )}
                        <span
                          className={`text-sm leading-snug ${
                            included ? "text-gray-700" : "text-gray-400"
                          }`}
                        >
                          {feature.name}
                          {desc && (
                            <Info className="w-3 h-3 inline ml-1 text-gray-300 group-hover/feat:text-gw-green transition-colors" />
                          )}
                        </span>
                        {desc && (
                          <div className="absolute left-0 bottom-full mb-2 w-60 p-3 bg-gw-green text-white text-xs rounded-xl shadow-lg opacity-0 invisible group-hover/feat:opacity-100 group-hover/feat:visible transition-all duration-200 z-50 pointer-events-none leading-relaxed">
                            {desc}
                            <div className="absolute top-full left-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gw-green" />
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Price - below features */}
              <div className={`px-4 md:px-5 pb-3 pt-2 border-t ${isSelected ? "border-gw-green/20" : isPopular ? "border-amber-200" : "border-gray-100"} text-center`}>
                <span className="text-xs text-gray-400 block">
                  {pkg.priceNote === "any size home" ? "Any size home" : "Starting at"}
                </span>
                <span className={`font-heading font-bold gradient-text-green ${isPopular ? "text-4xl" : "text-3xl"}`}>
                  ${pkg.price.toLocaleString()}
                </span>
              </div>

              {/* Select button */}
              <div className="p-4 md:p-5 pt-0">
                <button
                  onClick={() => setPackage(pkg.id as PackageTier)}
                  className={`w-full py-3 rounded-xl text-sm font-bold font-heading transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-gw-green text-white shadow-md"
                      : isPopular
                        ? "bg-gw-green text-white shadow-md hover:shadow-lg hover:brightness-110"
                        : "border-2 border-gw-green text-gw-green hover:bg-gw-green hover:text-white"
                  }`}
                >
                  {isSelected ? "Selected" : isPopular ? "Select Best Value" : "Select Package"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div ref={continueRef} className="flex items-center justify-between mt-8">
        <Button onClick={prevStep} variant="ghost">
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>
        <Button onClick={nextStep} disabled={!selectedPackage} size="lg" pulse={!!selectedPackage}>
          Continue
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
