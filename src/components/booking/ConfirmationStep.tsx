"use client";

import { useBookingStore } from "@/store/booking";
import { services } from "@/data/services";
import { packages } from "@/data/packages";
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
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";

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

const roleLabels: Record<string, string> = {
  buyer: "Home Buyer",
  owner: "Home Owner",
  agent: "Buyer's Agent",
};

export function ConfirmationStep() {
  const { serviceType, address, selectedPackage, contact, property, selectedSlot, schedulerId, prevStep, reset } =
    useBookingStore();

  const service = services.find((s) => s.id === serviceType);
  const pkg = packages.find((p) => p.id === selectedPackage);
  const referringAgent = schedulerId ? getAgentBySlug(schedulerId) : undefined;

  const timelineSteps = [
    { icon: CheckCircle2, label: "Booking confirmed", detail: "You'll receive a text confirmation" },
    { icon: FileText, label: "Pre-inspection prep", detail: "Checklist sent to you" },
    { icon: Wrench, label: "Inspection day", detail: "2-4 hours on-site" },
    { icon: FileText, label: "Report delivered", detail: "Within 24 hours" },
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
      <div className="flex flex-col items-center gap-4 mt-8">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Button onClick={prevStep} variant="ghost">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
          <button
            onClick={() => {
              // TODO: POST to ISN /orders when API is ready
              alert("Booking submitted! In production this will create an ISN order.");
            }}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-base font-semibold font-heading bg-gw-green text-white hover:bg-gw-green-light transition-colors shadow-lg shadow-gw-green/25 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            Submit Booking
          </button>
        </div>

        <a
          href={`sms:8553496757&body=${encodeURIComponent(`Hi, I just booked a ${selectedPackage} inspection at ${address.street}, ${address.city} ${address.state} ${address.zip}. Name: ${contact.firstName} ${contact.lastName}. Please confirm.`)}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gw-green hover:text-gw-green-dark transition-colors"
        >
          <Phone className="w-4 h-4" />
          Or text to confirm — (855) 349-6757
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
