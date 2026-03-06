"use client";

import { useBookingStore } from "@/store/booking";
import { services } from "@/data/services";
import { packages } from "@/data/packages";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Package,
  Wrench,
  Clock,
  Phone,
  FileText,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";

export function ConfirmationStep() {
  const { serviceType, address, selectedPackage, prevStep, reset } =
    useBookingStore();

  const service = services.find((s) => s.id === serviceType);
  const pkg = packages.find((p) => p.id === selectedPackage);

  const timelineSteps = [
    { icon: CheckCircle2, label: "Booking confirmed", detail: "You'll receive a text confirmation" },
    {
      icon: FileText,
      label: "Pre-inspection prep",
      detail: "Checklist sent to you",
    },
    {
      icon: Wrench,
      label: "Inspection day",
      detail: "2-4 hours on-site",
    },
    {
      icon: FileText,
      label: "Report delivered",
      detail: "Within 24 hours",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15, delay: 0.1 }}
          className="w-16 h-16 rounded-full bg-gw-green/10 flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle2 className="w-8 h-8 text-gw-green" />
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
          You&apos;re almost there!
        </h2>
        <p className="text-gray-500 mt-2">
          Review your selections below. Our team will confirm your appointment
          shortly.
        </p>
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-5">
        {/* Service */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gw-green/10 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-gw-green" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">SERVICE</p>
            <p className="font-semibold text-gray-900">
              {service?.title || "Home Inspection"}
            </p>
          </div>
        </div>

        {/* Area */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gw-blue/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-gw-blue" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">SERVICE AREA</p>
            <p className="font-semibold text-gray-900">
              {address.zip}{address.state ? `, ${address.state}` : ""}
            </p>
          </div>
        </div>

        {/* Package */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gw-orange/10 flex items-center justify-center">
            <Package className="w-5 h-5 text-gw-orange" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">PACKAGE</p>
            <p className="font-semibold text-gray-900">
              {pkg?.name || "Green"} — ${pkg?.price.toLocaleString() || "545"}
              {pkg?.priceNote && (
                <span className="text-xs text-gray-400 ml-1">
                  ({pkg.priceNote})
                </span>
              )}
            </p>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Timeline */}
        <div>
          <h3 className="font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gw-green" />
            What happens next
          </h3>
          <div className="space-y-4">
            {timelineSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gw-green/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-gw-green" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-500">{step.detail}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Trust */}
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Shield className="w-5 h-5 text-gw-green flex-shrink-0" />
          <p>
            Licensed, insured, and backed by 7,183+ five-star Google reviews.
            Your satisfaction is guaranteed.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
        <Button onClick={prevStep} variant="ghost">
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>
        <a
          href="sms:8553496757&body=Hi%2C%20I%20just%20booked%20an%20inspection%20and%20would%20like%20to%20confirm."
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold font-heading bg-gw-green text-white hover:bg-gw-green-light transition-colors shadow-md"
        >
          <Phone className="w-5 h-5" />
          Text to Confirm — (855) 349-6757
        </a>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={reset}
          className="text-sm text-gray-400 hover:text-gray-600 underline cursor-pointer"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
