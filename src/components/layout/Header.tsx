"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import Image from "next/image";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 glass-card border-b border-gray-100"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo-2025.jpg"
              alt="GreenWorks Inspections"
              width={140}
              height={40}
              className="h-8 md:h-10 w-auto"
              priority
            />
          </div>

          {/* Phone CTA */}
          <a
            href="tel:8553496757"
            className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-sm font-semibold font-heading text-white bg-gw-green hover:bg-gw-green-light transition-colors shadow-md hover:shadow-lg"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">(855) 349-6757</span>
            <span className="sm:hidden">Call Us</span>
          </a>
        </div>
      </div>
    </motion.header>
  );
}
