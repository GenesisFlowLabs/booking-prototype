"use client";

import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Package, PackageTier } from "@/types/booking";

interface PackageCardProps {
  pkg: Package;
  selected: boolean;
  onSelect: (id: PackageTier) => void;
}

export function PackageCard({ pkg, selected, onSelect }: PackageCardProps) {
  const isPopular = pkg.popular;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(pkg.id)}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative w-full text-left rounded-2xl p-6 md:p-7 transition-all duration-200 cursor-pointer
        ${isPopular && !selected ? "ring-2 ring-gw-green shadow-lg" : ""}
        ${selected
          ? "bg-gw-green text-white shadow-xl ring-2 ring-gw-green"
          : "bg-white border border-gray-200 hover:shadow-md"
        }
      `}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold shadow-md ${
              selected
                ? "bg-white text-gw-green"
                : "bg-gw-green text-white"
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            MOST POPULAR
          </div>
        </div>
      )}

      {/* Selected checkmark */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white flex items-center justify-center"
        >
          <Check className="w-5 h-5 text-gw-green" strokeWidth={3} />
        </motion.div>
      )}

      {/* Package name */}
      <h3
        className={`text-xl font-heading font-bold mt-1 ${
          selected ? "text-white" : "text-gray-900"
        }`}
      >
        {pkg.name}
      </h3>
      <p
        className={`text-sm mt-1 ${
          selected ? "text-green-100" : "text-gray-500"
        }`}
      >
        {pkg.tagline}
      </p>

      {/* Price */}
      <div className="mt-4 mb-5">
        <span
          className={`text-3xl md:text-4xl font-heading font-bold ${
            selected ? "text-white" : "gradient-text-green"
          }`}
        >
          ${pkg.price.toLocaleString()}
        </span>
        {pkg.priceNote && (
          <span
            className={`text-xs ml-2 ${
              selected ? "text-green-200" : "text-gray-400"
            }`}
          >
            ({pkg.priceNote})
          </span>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-2.5">
        {pkg.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check
              className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                selected ? "text-green-200" : "text-gw-green"
              }`}
              strokeWidth={2.5}
            />
            <span
              className={`text-sm ${
                selected ? "text-green-50" : "text-gray-600"
              }`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </motion.button>
  );
}
