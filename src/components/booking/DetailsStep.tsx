"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useBookingStore } from "@/store/booking";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { validateZip, serviceAreas } from "@/data/service-areas";
import { ArrowRight, ArrowLeft, MapPin, CheckCircle2, XCircle, User, Home, Briefcase, Loader2, UserPlus, Search, X } from "lucide-react";
import type { ReferringAgent } from "@/types/booking";
import { motion, AnimatePresence } from "framer-motion";
import { useGooglePlaces } from "@/hooks/useGooglePlaces";
import type { ContactRole, FoundationType } from "@/types/booking";

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
    referringAgent,
    setReferringAgent,
    nextStep,
    prevStep,
  } = useBookingStore();

  const [streetInput, setStreetInput] = useState(address.street);
  const [sqftLoading, setSqftLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const firstErrorRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLDivElement>(null);

  // Agent referral search
  const [showAgentSearch, setShowAgentSearch] = useState(!!referringAgent);
  const [agentQuery, setAgentQuery] = useState(referringAgent?.name || "");
  const [agentResults, setAgentResults] = useState<ReferringAgent[]>([]);
  const [agentSearching, setAgentSearching] = useState(false);
  const agentDebounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const searchAgents = useCallback(async (query: string) => {
    if (query.length < 2) {
      setAgentResults([]);
      return;
    }
    setAgentSearching(true);
    try {
      const res = await fetch(`/api/isn/agents?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setAgentResults(data.map((a: { id: string; name: string; email: string; phone: string; agency: string }) => ({
          id: a.id,
          name: a.name,
          email: a.email,
          phone: a.phone,
          agency: a.agency,
          isNew: false,
        })));
      }
    } catch {
      setAgentResults([]);
    } finally {
      setAgentSearching(false);
    }
  }, []);

  const handleAgentQueryChange = useCallback((val: string) => {
    setAgentQuery(val);
    setReferringAgent(null);
    if (agentDebounceRef.current) clearTimeout(agentDebounceRef.current);
    agentDebounceRef.current = setTimeout(() => searchAgents(val), 300);
  }, [searchAgents, setReferringAgent]);

  const selectAgent = useCallback((agent: ReferringAgent) => {
    setReferringAgent(agent);
    setAgentQuery(agent.name);
    setAgentResults([]);
  }, [setReferringAgent]);

  const markAsNewAgent = useCallback(() => {
    if (agentQuery.trim()) {
      setReferringAgent({
        id: null,
        name: agentQuery.trim(),
        email: "",
        phone: "",
        agency: "",
        isNew: true,
      });
      setAgentResults([]);
    }
  }, [agentQuery, setReferringAgent]);

  const clearAgent = useCallback(() => {
    setReferringAgent(null);
    setAgentQuery("");
    setAgentResults([]);
    setShowAgentSearch(false);
  }, [setReferringAgent]);

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
      if (result.valid && result.stateCode) {
        setAddress({ state: result.stateCode });
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

  const missingFields: string[] = [];
  if (!address.street.trim()) missingFields.push("Street address");
  if (!address.city.trim()) missingFields.push("City");
  if (!address.state) missingFields.push("State");
  if (isValidZip !== true) missingFields.push("Valid ZIP code");
  if (!contact.role) missingFields.push("Your role");
  if (!contact.firstName.trim()) missingFields.push("First name");
  if (!contact.lastName.trim()) missingFields.push("Last name");
  if (!contact.email.trim()) missingFields.push("Email");
  if (!contact.phone.trim()) missingFields.push("Phone");

  const handleContinue = () => {
    if (canProceed) {
      setShowErrors(false);
      nextStep();
    } else {
      setShowErrors(true);
      firstErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

        {/* Foundation type */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700 font-heading">
            Foundation Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {([
              { id: "slab" as FoundationType, label: "Slab" },
              { id: "pier-beam" as FoundationType, label: "Pier & Beam" },
              { id: "unknown" as FoundationType, label: "Not Sure" },
            ]).map((f) => {
              const isSelected = property.foundation === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setProperty({ foundation: f.id })}
                  className={`
                    flex items-center justify-center p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 cursor-pointer
                    ${isSelected
                      ? "border-gw-green bg-gw-green/5 text-gw-green"
                      : "border-gray-200 text-gray-500 hover:border-gw-green/40"
                    }
                  `}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-400">
            Pier &amp; beam homes require additional crawlspace inspection time.
          </p>
        </div>
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
            // Strip +1 country code prefix if present (from autofill)
            let raw = v.replace(/\D/g, "");
            if (raw.length === 11 && raw.startsWith("1")) {
              raw = raw.slice(1);
            }
            const digits = raw.slice(0, 10);
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

      {/* Agent Referral */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mt-5">
        {!showAgentSearch ? (
          <motion.button
            type="button"
            onClick={() => setShowAgentSearch(true)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full flex items-center gap-4 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-gw-green/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gw-green/20 transition-colors">
              <UserPlus className="w-6 h-6 text-gw-green" />
            </div>
            <div className="text-left flex-1">
              <p className="font-heading font-bold text-gray-900 group-hover:text-gw-green transition-colors">
                Were you referred by an agent?
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                Let us know so we can thank them
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gw-green transition-colors" />
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700 font-heading">
                Referring Agent
              </label>
              <button
                type="button"
                onClick={clearAgent}
                className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                Remove
              </button>
            </div>

            {referringAgent ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-gw-green/5 border-2 border-gw-green">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gw-green/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-gw-green" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {referringAgent.name}
                      {referringAgent.isNew && (
                        <span className="ml-2 text-xs font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          New Agent
                        </span>
                      )}
                    </p>
                    {referringAgent.agency && (
                      <p className="text-xs text-gray-500">{referringAgent.agency}</p>
                    )}
                    {referringAgent.email && (
                      <p className="text-xs text-gray-400">{referringAgent.email}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearAgent}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={agentQuery}
                    onChange={(e) => handleAgentQueryChange(e.target.value)}
                    placeholder="Start typing agent name..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-gw-green focus:ring-gw-green/20"
                    autoComplete="off"
                  />
                  {agentSearching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                  )}
                </div>

                {/* Results dropdown */}
                {agentResults.length > 0 && (
                  <div className="absolute z-20 mt-1 w-full bg-white rounded-xl border border-gray-200 shadow-lg max-h-48 overflow-y-auto">
                    {agentResults.map((agent) => (
                      <button
                        key={agent.id}
                        type="button"
                        onClick={() => selectAgent(agent)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0"
                      >
                        <p className="text-sm font-semibold text-gray-900">{agent.name}</p>
                        {agent.agency && (
                          <p className="text-xs text-gray-500">{agent.agency}</p>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* "Not found" option */}
                {agentQuery.length >= 2 && !agentSearching && agentResults.length === 0 && (
                  <div className="absolute z-20 mt-1 w-full bg-white rounded-xl border border-gray-200 shadow-lg">
                    <button
                      type="button"
                      onClick={markAsNewAgent}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <p className="text-sm text-gray-700">
                        Agent not found — add <strong>&ldquo;{agentQuery}&rdquo;</strong> as new agent
                      </p>
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showErrors && missingFields.length > 0 && (
          <motion.div
            ref={firstErrorRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-5 p-4 rounded-xl bg-red-50 border border-red-200"
          >
            <p className="text-sm font-semibold text-red-800 mb-1">Please complete the following:</p>
            <ul className="text-sm text-red-700 list-disc list-inside space-y-0.5">
              {missingFields.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={continueRef} className="flex items-center justify-between mt-8">
        <Button onClick={prevStep} variant="ghost">
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>
        <Button onClick={handleContinue} size="lg" pulse={canProceed}>
          Continue
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
