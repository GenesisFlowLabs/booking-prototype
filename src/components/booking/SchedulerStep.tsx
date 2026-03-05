"use client";

import { useState, useEffect } from "react";
import { useBookingStore } from "@/store/booking";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, Calendar, Loader2, ExternalLink, Phone } from "lucide-react";
import { motion } from "framer-motion";

const ISN_URL =
  "https://inspectionsupport.com/greenworksserviceco/online-scheduler/a60ac7a4-65c4-5205-99c4-52c3e5f37002";

export function SchedulerStep() {
  const { nextStep, prevStep, selectedPackage } = useBookingStore();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) setFailed(true);
    }, 10000);
    return () => clearTimeout(timeout);
  }, [loading]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
          Pick your inspection date
        </h2>
        <p className="text-gray-500 mt-2">
          Select an available time that works for you. Our inspectors are
          available 7 days a week.
        </p>
      </div>

      {/* Context banner */}
      <div className="flex items-center gap-3 p-4 mb-4 rounded-xl bg-gw-green/5 border border-gw-green/20">
        <Calendar className="w-5 h-5 text-gw-green flex-shrink-0" />
        <p className="text-sm text-gray-700">
          You&apos;re scheduling a{" "}
          <strong className="text-gw-green capitalize">{selectedPackage}</strong>{" "}
          package inspection. Most inspections are completed within 3-5 business
          days.
        </p>
      </div>

      {/* ISN Iframe */}
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 min-h-[500px]">
        {/* Loading skeleton */}
        {loading && !failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
            <Loader2 className="w-8 h-8 text-gw-green animate-spin mb-3" />
            <p className="text-sm text-gray-500">Loading scheduler...</p>
          </div>
        )}

        {/* Failure fallback */}
        {failed ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
          >
            <Calendar className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
              Scheduler is taking longer than expected
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md">
              You can open the scheduler directly or give us a call — we&apos;ll
              get you booked in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={ISN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-gw-green text-white hover:bg-gw-green-light transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open Scheduler
              </a>
              <a
                href="tel:8553496757"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border-2 border-gw-green text-gw-green hover:bg-gw-green hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                (855) 349-6757
              </a>
            </div>
          </motion.div>
        ) : (
          <iframe
            src={ISN_URL}
            title="GreenWorks Inspection Scheduler"
            className="w-full min-h-[500px] border-0"
            onLoad={() => setLoading(false)}
          />
        )}
      </div>

      <div className="flex items-center justify-between mt-8">
        <Button onClick={prevStep} variant="ghost">
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>
        <Button onClick={nextStep} size="lg">
          Continue
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
