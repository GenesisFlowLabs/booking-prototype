"use client";

import { useEffect, useState, useCallback } from "react";
import { useBookingStore } from "@/store/booking";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { validateZip, serviceAreas } from "@/data/service-areas";
import { ArrowRight, ArrowLeft, MapPin, CheckCircle2, XCircle, User, Home, Briefcase, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGooglePlaces } from "@/hooks/useGooglePlaces";
import type { ContactRole } from "@/types/booking";

const roles: { id: ContactRole; label: string; icon: React.ElementType }[] = [
  { id: "buyer", label: "Home Buyer", icon: User },
  { id: "owner", label: "Home Owner", icon: Home },
  { id: "agent", label: "Buyer's Agent", icon: Briefcase },
];

export function DetailsStep() {
  const {
    address,
    setAddress,
    isValidZip,
    setZipValid,
    contact,
    setContact,
    property,
    setProperty,
    nextStep,
    prevStep,
  } = useBookingStore();

  const [streetInput, setStreetInput] = useState(address.street);
  const [sqftLoading, setSqftLoading] = useState(false);

  const lookupProperty = useCallback(async (street: string, city: string, state: string, zip: string) => {
    const full = `${street}, ${city}, ${state} ${zip}`;
    if (!street || !city) return;
    setSqftLoading(true);
    try {
      const res = await fetch(`/api/property?address=${encodeURIComponent(full)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.sqft) {
          setProperty({ sqft: String(data.sqft) });
        }
      }
    } catch {
      // Silent — sq ft is optional
    } finally {
      setSqftLoading(false);
    }
  }, [setProperty]);

  const { suggestions, isOpen, loading: placesLoading, search, select, close, containerRef } =
    useGooglePlaces((result) => {
      setStreetInput(result.street);
      setAddress({
        street: result.street,
        city: result.city,
        state: result.state,
        zip: result.zip,
      });
      lookupProperty(result.street, result.city, result.state, result.zip);
    });

  useEffect(() => {
    if (address.zip.length === 5) {
      const result = validateZip(address.zip);
      setZipValid(result.valid);
      if (result.valid && result.state) {
        setAddress({ state: result.state });
      }
    } else {
      setZipValid(null);
    }
  }, [address.zip, setZipValid, setAddress]);

  const handleStreetChange = (v: string) => {
    setStreetInput(v);
    setAddress({ street: v });
    search(v);
  };

  const handleSuggestionClick = (placeId: string) => {
    select(placeId);
  };

  const zipResult = address.zip.length === 5 ? validateZip(address.zip) : null;

  const canProceed =
    address.street.trim() !== "" &&
    address.city.trim() !== "" &&
    address.state !== "" &&
    isValidZip === true &&
    contact.role !== null &&
    contact.firstName.trim() !== "" &&
    contact.lastName.trim() !== "" &&
    contact.email.trim() !== "" &&
    contact.phone.trim() !== "";

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
          Property &amp; contact details
        </h2>
        <p className="text-gray-500 mt-2">
          Tell us about the property and how to reach you.
        </p>
      </div>

      {/* Address Section */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-heading font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gw-green" />
          Property address
        </h3>

        {/* Street with autocomplete */}
        <div className="relative" ref={containerRef}>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 font-heading">
              Street Address <span className="text-gw-orange ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={streetInput}
                onChange={(e) => handleStreetChange(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) close(); }}
                placeholder="Start typing an address..."
                autoComplete="off"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-gw-green focus:ring-gw-green/20"
              />
              {placesLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Autocomplete dropdown */}
          <AnimatePresence>
            {isOpen && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 w-full mt-1 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
              >
                {suggestions.map((s, i) => (
                  <button
                    key={s.placeId}
                    type="button"
                    onClick={() => handleSuggestionClick(s.placeId)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 text-sm transition-colors hover:bg-gw-green/5 cursor-pointer ${
                      i < suggestions.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700">{s.description}</span>
                  </button>
                ))}
                <div className="px-4 py-1.5 bg-gray-50 text-[10px] text-gray-400 text-right">
                  Powered by Google
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="col-span-2">
            <Input
              label="City"
              value={address.city}
              onChange={(v) => setAddress({ city: v })}
              placeholder="Dallas"
              autoComplete="address-level2"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 font-heading">
              State <span className="text-gw-orange ml-1">*</span>
            </label>
            <select
              value={address.state}
              onChange={(e) => setAddress({ state: e.target.value })}
              className="w-full px-3 py-3 rounded-xl border-2 border-gray-200 text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-gw-green focus:ring-gw-green/20 bg-white"
            >
              <option value="">--</option>
              {serviceAreas.map((area) => (
                <option key={area.stateCode} value={area.stateCode}>
                  {area.stateCode}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Input
              label="ZIP"
              value={address.zip}
              onChange={(v) => setAddress({ zip: v.replace(/\D/g, "").slice(0, 5) })}
              placeholder="75201"
              maxLength={5}
              inputMode="numeric"
              required
            />
          </div>
        </div>

        <AnimatePresence>
          {isValidZip === true && zipResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200"
            >
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              <p className="text-sm font-semibold text-green-800">
                We serve {zipResult.metro}, {zipResult.state}!
              </p>
            </motion.div>
          )}
          {isValidZip === false && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl bg-orange-50 border border-orange-200"
            >
              <XCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <p className="text-sm font-semibold text-orange-800">
                Not in our area yet. Call <strong>(855) 349-6757</strong>.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Approx Sq Ft */}
        <div className="relative">
          <Input
            label="Approx. Square Footage"
            value={property.sqft ? parseInt(property.sqft).toLocaleString() : ""}
            onChange={(v) => setProperty({ sqft: v.replace(/\D/g, "") })}
            placeholder="2,500"
            inputMode="numeric"
          />
          {sqftLoading && (
            <div className="absolute right-3 top-9">
              <Loader2 className="w-4 h-4 text-gw-green animate-spin" />
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 -mt-2">
          {property.sqft ? "Auto-filled from public records. You can adjust if needed." : "Helps us provide a more accurate quote. Optional."}
        </p>
      </div>

      {/* Contact Section */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-4 mt-5">
        <h3 className="font-heading font-bold text-gray-900 flex items-center gap-2">
          <User className="w-4 h-4 text-gw-green" />
          Your contact info
        </h3>

        {/* Role selector */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700 font-heading">
            I am a... <span className="text-gw-orange ml-1">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = contact.role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setContact({ role: r.id })}
                  className={`
                    flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 cursor-pointer
                    ${isSelected
                      ? "border-gw-green bg-gw-green/5 text-gw-green"
                      : "border-gray-200 text-gray-500 hover:border-gw-green/40"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            value={contact.firstName}
            onChange={(v) => setContact({ firstName: v })}
            placeholder="Jordan"
            autoComplete="given-name"
            required
          />
          <Input
            label="Last Name"
            value={contact.lastName}
            onChange={(v) => setContact({ lastName: v })}
            placeholder="Vanover"
            autoComplete="family-name"
            required
          />
        </div>

        <Input
          label="Email"
          value={contact.email}
          onChange={(v) => setContact({ email: v })}
          placeholder="jordan@example.com"
          type="email"
          autoComplete="email"
          required
        />

        <Input
          label="Mobile Phone"
          value={contact.phone}
          onChange={(v) => {
            // Auto-format: (555) 123-4567
            const digits = v.replace(/\D/g, "").slice(0, 10);
            let formatted = digits;
            if (digits.length > 6) {
              formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
            } else if (digits.length > 3) {
              formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
            } else if (digits.length > 0) {
              formatted = `(${digits}`;
            }
            setContact({ phone: formatted });
          }}
          placeholder="(555) 123-4567"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
        />
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
