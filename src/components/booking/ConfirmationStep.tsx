"use client";

import { useBookingStore } from "@/store/booking";
import { services } from "@/data/services";
import { homePackages, ncPackages } from "@/data/packages";
import { getAgentBySlug } from "@/data/agents";
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
  User,
  UserCheck,
  Calendar,
  CalendarPlus,
  Mail,
  Download,
  Loader2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function formatTime(datetime: string): string {
  const time = datetime.split(" ")[1];
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
}

function formatInspectorName(name: string): string {
  const parts = name.split(",")[0].split(" ");
  if (parts.length >= 2) return `${parts[0]} ${parts[1][0]}.`;
  return parts[0];
}

function toICSDate(datetime: string): string {
  // datetime format: "2026-03-15 09:00:00" → "20260315T090000"
  return datetime.replace(/[-: ]/g, "").slice(0, 15);
}

function buildGoogleCalendarUrl(
  title: string,
  start: string,
  end: string,
  location: string,
  description: string
): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${toICSDate(start)}/${toICSDate(end)}`,
    location,
    details: description,
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
}

function buildICSFile(
  title: string,
  start: string,
  end: string,
  location: string,
  description: string
): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//GreenWorks Inspections//Booking//EN",
    "BEGIN:VEVENT",
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadICS(ics: string, filename: string) {
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const roleLabels: Record<string, string> = {
  buyer: "Home Buyer",
  owner: "Home Owner",
  agent: "Buyer's Agent",
};

export function ConfirmationStep() {
  const { serviceType, address, selectedPackage, contact, property, selectedSlot, schedulerId, prevStep, reset, setBookingSubmitted, submission, setSubmission } =
    useBookingStore();

  const [submitted, setSubmitted] = useState(false);
  const submitRef = useRef<HTMLDivElement>(null);
  const service = services.find((s) => s.id === serviceType);

  // Auto-scroll to submit button after review renders
  useEffect(() => {
    if (!submitted) {
      const timer = setTimeout(() => {
        submitRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [submitted]);
  const allPackages = [...homePackages, ...ncPackages];
  const pkg = allPackages.find((p) => p.id === selectedPackage);
  const referringAgent = schedulerId ? getAgentBySlug(schedulerId) : undefined;

  const handleSubmit = async () => {
    setSubmission({ submitting: true, submitError: null });

    try {
      const res = await fetch("/api/isn/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType,
          packageTier: selectedPackage,
          address,
          contact,
          property,
          selectedSlot,
          schedulerId,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setSubmission({
          submitting: false,
          submitError: data.error || "Something went wrong. Please try again or call us.",
        });
        return;
      }

      setSubmission({
        submitting: false,
        orderId: data.orderId,
        orderOid: data.oid,
      });
      setSubmitted(true);
      setBookingSubmitted(true);
    } catch {
      setSubmission({
        submitting: false,
        submitError: "Network error. Please check your connection and try again.",
      });
    }
  };

  const timelineSteps = [
    { icon: CheckCircle2, label: "Booking confirmed", detail: "You'll receive a text confirmation" },
    { icon: FileText, label: "Pre-inspection prep", detail: "Checklist sent to you" },
    { icon: Wrench, label: "Inspection day", detail: "2-4 hours on-site" },
    { icon: FileText, label: "Report delivered", detail: "Within 24 hours" },
  ];

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, delay: 0.1 }}
          className="w-20 h-20 rounded-full bg-gw-green/10 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-gw-green" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
            You&apos;re all set!
          </h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            We&apos;ve received your booking request. You&apos;ll get a text confirmation shortly with your appointment details.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left max-w-sm mx-auto space-y-3"
        >
          <div className="flex items-center gap-3">
            <Wrench className="w-5 h-5 text-gw-green" />
            <p className="text-sm font-semibold text-gray-900">{service?.title}</p>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gw-blue" />
            <p className="text-sm text-gray-700">
              {address.street ? `${address.street}, ${address.city}, ${address.state} ${address.zip}` : `${address.zip}`}
            </p>
          </div>
          {selectedSlot && (
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-gray-700">
                {new Date(selectedSlot.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                {" "}at {formatTime(selectedSlot.start)}
              </p>
            </div>
          )}
        </motion.div>

        {selectedSlot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            {(() => {
              const loc = address.street ? `${address.street}, ${address.city}, ${address.state} ${address.zip}` : "";
              const title = `${service?.title || "Home Inspection"} - GreenWorks`;
              const desc = `${service?.title || "Home Inspection"} by GreenWorks Inspections.\nPackage: ${pkg?.name || "Green"}\nContact: ${contact.firstName} ${contact.lastName} (${contact.phone})`;
              return (
                <>
                  <a
                    href={buildGoogleCalendarUrl(title, selectedSlot.start, selectedSlot.end, loc, desc)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gw-green text-white text-sm font-semibold font-heading shadow-md hover:bg-gw-green-light transition-colors"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    Add to Google Calendar
                  </a>
                  <button
                    onClick={() => downloadICS(buildICSFile(title, selectedSlot.start, selectedSlot.end, loc, desc), "greenworks-inspection.ics")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-gray-200 text-gray-700 text-sm font-semibold font-heading hover:border-gw-green hover:text-gw-green transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Apple / Outlook (.ics)
                  </button>
                </>
              );
            })()}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-8 space-y-3">
          <p className="text-sm text-gray-400">
            Questions? Call us at <a href="tel:8553496757" className="font-semibold text-gw-green">(855) 349-6757</a>
          </p>
          <button
            onClick={() => { setSubmitted(false); reset(); }}
            className="text-sm text-gray-400 hover:text-gray-600 underline cursor-pointer"
          >
            Book another inspection
          </button>
        </motion.div>
      </div>
    );
  }

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
          Review your booking
        </h2>
        <p className="text-gray-500 mt-2">
          Confirm everything looks right, then submit.
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

        {/* Address */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gw-blue/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-gw-blue" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">PROPERTY ADDRESS</p>
            <p className="font-semibold text-gray-900">
              {address.street ? `${address.street}, ${address.city}, ${address.state} ${address.zip}` : `${address.zip}${address.state ? `, ${address.state}` : ""}`}
            </p>
            {property.sqft && (
              <p className="text-xs text-gray-500 mt-0.5">
                ~{parseInt(property.sqft).toLocaleString()} sq ft
              </p>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <User className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">CONTACT</p>
            <p className="font-semibold text-gray-900">
              {contact.firstName} {contact.lastName}
              {contact.role && (
                <span className="text-xs text-gray-400 ml-2">
                  ({roleLabels[contact.role] || contact.role})
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {contact.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {contact.phone}
              </span>
            </p>
          </div>
        </div>

        {/* Referring Agent */}
        {referringAgent && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gw-green/10 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-gw-green" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">REFERRED BY</p>
              <p className="font-semibold text-gray-900">
                {referringAgent.name}
                <span className="text-gray-400 font-normal">, {referringAgent.company}</span>
              </p>
            </div>
          </div>
        )}

        {/* Package */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gw-orange/10 flex items-center justify-center">
            <Package className="w-5 h-5 text-gw-orange" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">PACKAGE</p>
            <p className="font-semibold text-gray-900">
              {pkg?.name || "Green"} — Starting at ${pkg?.price.toLocaleString() || "545"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Final pricing confirmed after submission based on property details.
            </p>
          </div>
        </div>

        {/* Scheduled Time */}
        {selectedSlot && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">APPOINTMENT</p>
              <p className="font-semibold text-gray-900">
                {new Date(selectedSlot.date + "T12:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatTime(selectedSlot.start)} – {formatTime(selectedSlot.end)} &middot; Inspector: {formatInspectorName(selectedSlot.inspectorName)}
              </p>
            </div>
          </div>
        )}

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

        <div className="text-center text-xs text-gray-400 italic">
          Final pricing will be confirmed after order submission based on property size and selected services.
        </div>

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
      <div ref={submitRef} className="flex flex-col items-center gap-4 mt-8">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Button onClick={prevStep} variant="ghost">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
          <button
            onClick={handleSubmit}
            disabled={submission.submitting}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-base font-semibold font-heading bg-gw-green text-white hover:bg-gw-green-light transition-colors shadow-lg shadow-gw-green/25 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed animate-pulse-subtle ring-2 ring-gw-green/30 ring-offset-2"
          >
            {submission.submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Submit Booking
              </>
            )}
          </button>
        </div>

        <a
          href={`sms:8553496757&body=${encodeURIComponent(`Hi, I just booked a ${selectedPackage} inspection at ${address.street}, ${address.city} ${address.state} ${address.zip}. Name: ${contact.firstName} ${contact.lastName}. Please confirm.`)}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gw-green hover:text-gw-green-dark transition-colors"
        >
          <Phone className="w-4 h-4" />
          Or text to confirm — (855) 349-6757
        </a>

        {submission.submitError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-center max-w-md mx-auto"
          >
            <p className="text-sm text-red-700">{submission.submitError}</p>
            <p className="text-xs text-red-500 mt-1">
              Or call <a href="tel:8553496757" className="font-semibold underline">(855) 349-6757</a>
            </p>
          </motion.div>
        )}
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
