"use client";

import { useEffect } from "react";
import { useBookingStore } from "@/store/booking";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { validateZip } from "@/data/service-areas";
import { serviceAreas } from "@/data/service-areas";
import { ArrowRight, ArrowLeft, MapPin, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// TODO: Re-enable Google Places autocomplete once API billing is confirmed
// import { useGooglePlaces } from "@/hooks/useGooglePlaces";

export function AddressStep() {
  const { address, setAddress, isValidZip, setZipValid, nextStep, prevStep } =
    useBookingStore();

  // Validate zip as user types
  useEffect(() => {
    if (address.zip.length === 5) {
      const result = validateZip(address.zip);
      setZipValid(result.valid);
    } else {
      setZipValid(null);
    }
  }, [address.zip, setZipValid]);

  const zipResult = address.zip.length === 5 ? validateZip(address.zip) : null;

  const canProceed =
    address.street.trim() !== "" &&
    address.city.trim() !== "" &&
    address.state !== "" &&
    isValidZip === true;

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
          Where is the property?
        </h2>
        <p className="text-gray-500 mt-2">
          We&apos;ll confirm service availability in your area.
        </p>
      </div>

      <div className="space-y-4 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        <Input
          label="Street Address"
          value={address.street}
          onChange={(v) => setAddress({ street: v })}
          placeholder="123 Main Street"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="City"
            value={address.city}
            onChange={(v) => setAddress({ city: v })}
            placeholder="Dallas"
            required
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 font-heading">
              State <span className="text-gw-orange ml-1">*</span>
            </label>
            <select
              value={address.state}
              onChange={(e) => setAddress({ state: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-gw-green focus:ring-gw-green/20 bg-white"
            >
              <option value="">Select</option>
              {serviceAreas.map((area) => (
                <option key={area.stateCode} value={area.stateCode}>
                  {area.state}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="ZIP Code"
          value={address.zip}
          onChange={(v) => setAddress({ zip: v.replace(/\D/g, "").slice(0, 5) })}
          placeholder="75201"
          maxLength={5}
          required
          success={
            isValidZip === true && zipResult
              ? `We serve ${zipResult.metro}, ${zipResult.state}!`
              : undefined
          }
          error={
            isValidZip === false
              ? "We don't currently serve this area"
              : undefined
          }
        />

        {/* Zip validation feedback */}
        <AnimatePresence>
          {isValidZip === true && zipResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200"
            >
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-800">
                  Great news! We service your area.
                </p>
                <p className="text-xs text-green-600 mt-0.5">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  {zipResult.metro}, {zipResult.state}
                </p>
              </div>
            </motion.div>
          )}

          {isValidZip === false && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 border border-orange-200"
            >
              <XCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-orange-800">
                  We&apos;re not in your area yet — but we&apos;re growing fast.
                </p>
                <p className="text-xs text-orange-600 mt-0.5">
                  Call us at <strong>(855) 349-6757</strong> — we may still be
                  able to help.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-8">
        <Button onClick={prevStep} variant="ghost">
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>
        <Button onClick={nextStep} disabled={!canProceed} size="lg">
          Continue
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
