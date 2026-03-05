"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ReactNode } from "react";

interface RadioCardProps {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
  className?: string;
}

export function RadioCard({ selected, onSelect, children, className = "" }: RadioCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative w-full text-left rounded-2xl p-5 transition-all duration-200 cursor-pointer
        ${selected
          ? "border-2 border-gw-green bg-gw-green/5 shadow-md"
          : "border-2 border-gray-200 bg-white hover:border-gw-green/40 hover:shadow-sm"
        }
        ${className}
      `}
    >
      {/* Checkmark */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gw-green flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </motion.div>
      )}
      {children}
    </motion.button>
  );
}
