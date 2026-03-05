"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { TrustBar } from "@/components/social/TrustBar";
import { StatsStrip } from "@/components/social/StatsStrip";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { CallbackForm } from "@/components/booking/CallbackForm";
import { Shield, Star, Award } from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />

      {/* Hero section */}
      <section className="relative pt-8 pb-6 md:pt-12 md:pb-8 bg-gradient-to-b from-gw-green/5 to-cream">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gw-green/10 text-gw-green text-sm font-semibold mb-4">
              <Star className="w-4 h-4 fill-current" />
              4.9 Stars from 7,183 Google Reviews
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-extrabold text-gray-900 leading-tight">
              Book Your Home Inspection
              <br />
              <span className="gradient-text-green">in Minutes, Not Hours</span>
            </h1>
            <p className="text-gray-500 text-lg md:text-xl mt-4 max-w-2xl mx-auto">
              2,400+ inspections per month across 6 states. Select your service,
              pick a date, and you&apos;re done.
            </p>
          </motion.div>

          {/* Quick trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-6 text-sm text-gray-500"
          >
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-gw-green" />
              Licensed & Insured
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-gw-green" />
              Inc. 5000
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-gw-green" />
              BBB A+ Rated
            </span>
          </motion.div>
        </div>
      </section>

      {/* Booking flow */}
      <section className="py-8 md:py-12">
        <BookingFlow />
      </section>

      {/* Stats strip */}
      <StatsStrip />

      {/* Trust bar footer */}
      <TrustBar />

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} GreenWorks Inspections. All rights
          reserved.
        </p>
        <p className="mt-1">
          Serving Texas, Colorado, Florida, Georgia, Ohio & Oklahoma
        </p>
      </footer>

      {/* Floating callback form */}
      <CallbackForm />
    </>
  );
}
