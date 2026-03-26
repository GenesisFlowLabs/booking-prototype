"use client";

import { useEffect, useState, useRef } from "react";
import { useBookingStore } from "@/store/booking";
import { services } from "@/data/services";
import { RadioCard } from "@/components/ui/RadioCard";
import { Button } from "@/components/ui/Button";
import { Home, HardHat, Leaf, Building2, Building, ArrowRight, MapPin, CheckCircle2, XCircle, Eye, X, Check, Info, Star } from "lucide-react";
import { ServiceType } from "@/types/booking";
import { validateZip } from "@/data/service-areas";
import { motion, AnimatePresence } from "framer-motion";
import {
  homePackages,
  ncPackages,
  featureComparison,
  ncFeatureComparison,
  featureDescriptions,
} from "@/data/packages";

const iconMap: Record<string, React.ElementType> = {
  Home,
  HardHat,
  Leaf,
  Building2,
  Building,
};

const hasPackages = (id: string) => id === "home" || id === "new-construction";

export function ServiceTypeStep() {
  const { serviceType, setServiceType, address, setAddress, isValidZip, setZipValid, nextStep } = useBookingStore();
  const [zip, setZip] = useState(address.zip);
  const zipRef = useRef<HTMLInputElement>(null);
  const [previewService, setPreviewService] = useState<string | null>(null);

  useEffect(() => {
    if (zip.length === 5) {
      const result = validateZip(zip);
      setZipValid(result.valid);
      if (result.valid && result.stateCode) {
        setAddress({ zip, state: result.stateCode });
      } else {
        setAddress({ zip });
      }
    } else {
      setZipValid(null);
    }
  }, [zip, setZipValid, setAddress]);

  // Auto-advance when both service + valid zip are set
  useEffect(() => {
    if (serviceType && isValidZip === true) {
      const timer = setTimeout(() => nextStep(), 800);
      return () => clearTimeout(timer);
    }
  }, [serviceType, isValidZip, nextStep]);

  const [showErrors, setShowErrors] = useState(false);
  const zipResult = zip.length === 5 ? validateZip(zip) : null;
  const canProceed = serviceType !== null && isValidZip === true;

  const handleContinue = () => {
    if (canProceed) {
      setShowErrors(false);
      nextStep();
    } else {
      setShowErrors(true);
      if (!serviceType) {
        // scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        zipRef.current?.focus();
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
          What type of inspection do you need?
        </h2>
        <p className="text-gray-500 mt-2">
          Select a service and enter your zip code to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((service) => {
          const Icon = iconMap[service.icon] || Home;
          return (
            <RadioCard
              key={service.id}
              selected={serviceType === service.id}
              onSelect={() => {
                setServiceType(service.id as ServiceType);
                setTimeout(() => {
                  zipRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                  setTimeout(() => zipRef.current?.focus(), 300);
                }, 150);
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    serviceType === service.id
                      ? "bg-gw-green text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-gray-900">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {service.description}
                  </p>
                  <p className="text-sm font-semibold text-gw-green mt-2">
                    ${service.startingPrice} – ${service.priceHigh?.toLocaleString() ?? service.startingPrice}
                  </p>
                  {hasPackages(service.id) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewService(service.id);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gw-green mt-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      View packages
                    </button>
                  )}
                </div>
              </div>
            </RadioCard>
          );
        })}
      </div>

      {/* Zip code validation */}
      <div className="mt-8 max-w-sm mx-auto">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 font-heading mb-2">
            <MapPin className="w-4 h-4 inline mr-1.5 text-gw-green" />
            Property ZIP Code
          </label>
          <input
            ref={zipRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
            onKeyDown={(e) => { if (e.key === "Enter" && canProceed) nextStep(); }}
            placeholder="75201"
            maxLength={5}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-base text-center text-lg font-semibold tracking-wider transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-gw-green focus:ring-gw-green/20"
          />

          <AnimatePresence>
            {isValidZip === true && zipResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 mt-3 p-3 rounded-xl bg-green-50 border border-green-200"
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
                className="flex items-center gap-2 mt-3 p-3 rounded-xl bg-orange-50 border border-orange-200"
              >
                <XCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-orange-800">
                    Not in our area yet.
                  </p>
                  <p className="text-xs text-orange-600">
                    Call <strong>(855) 349-6757</strong> — we may still help.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showErrors && !canProceed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 max-w-sm mx-auto p-3 rounded-xl bg-red-50 border border-red-200 text-center"
          >
            <p className="text-sm font-semibold text-red-800">
              {!serviceType && !isValidZip ? "Please select a service and enter your ZIP code." :
               !serviceType ? "Please select a service type above." :
               "Please enter a valid ZIP code in our service area."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center mt-8">
        <Button onClick={handleContinue} size="lg">
          Continue
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Package preview modal */}
      <AnimatePresence>
        {previewService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-2 pb-2 sm:pb-0"
            onClick={() => setPreviewService(null)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl"
            >
              {/* Modal header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-3xl z-10">
                <h3 className="text-lg font-heading font-bold text-gray-900">
                  {previewService === "new-construction" ? "New Construction" : "Home Inspection"} Packages
                </h3>
                <button
                  onClick={() => setPreviewService(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Package columns */}
              <div className="p-4 sm:p-6">
                <PackagePreview serviceId={previewService} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PackagePreview({ serviceId }: { serviceId: string }) {
  const isNC = serviceId === "new-construction";
  const pkgs = isNC ? ncPackages : homePackages;
  const features = isNC ? ncFeatureComparison : featureComparison;
  const tierKeys = isNC
    ? (["nc1", "nc2", "nc3"] as const)
    : (["green", "greener", "greenest"] as const);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:items-start">
      {pkgs.map((pkg, colIdx) => {
        const tier = tierKeys[colIdx];
        const isPopular = pkg.popular;
        return (
          <div
            key={pkg.id}
            className={`rounded-2xl border p-4 relative ${
              isPopular
                ? "border-[3px] border-amber-400 bg-white shadow-lg sm:-mt-2 sm:scale-[1.02] ring-1 ring-amber-200"
                : "border-gw-green/30"
            }`}
          >
            {isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <div className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold shadow-md bg-amber-400 text-amber-900">
                  <Star className="w-3 h-3 fill-current" />
                  MOST POPULAR
                </div>
              </div>
            )}
            <div className={`text-center mb-4 ${isPopular ? "pt-2" : ""}`}>
              <h4 className={`font-heading font-bold ${isPopular ? "text-gw-green text-lg" : "text-gray-900"}`}>{pkg.name}</h4>
              <p className="text-[11px] text-gray-400">{pkg.tagline}</p>
              <div className="mt-2">
                <span className="text-[10px] text-gray-400 block">
                  {pkg.priceNote === "any size home" ? "Any size home" : "Starting at"}
                </span>
                <span className={`font-heading font-bold gradient-text-green ${isPopular ? "text-3xl" : "text-2xl"}`}>
                  ${pkg.price.toLocaleString()}
                </span>
              </div>
            </div>
            <ul className="space-y-0">
              {features.map((feature, i) => {
                const included = (feature as unknown as Record<string, boolean>)[tier];
                const desc = featureDescriptions[feature.name];
                return (
                  <li
                    key={feature.name}
                    className={`flex items-start gap-2 py-1.5 group/tip relative ${
                      i < features.length - 1 ? "border-b border-gray-50" : ""
                    }`}
                  >
                    {included ? (
                      <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gw-green" strokeWidth={2.5} />
                    ) : (
                      <X className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-300/70" strokeWidth={2} />
                    )}
                    <span className={`text-xs leading-snug ${included ? "text-gray-600" : "text-gray-400"}`}>
                      {feature.name}
                      {desc && (
                        <Info className="w-2.5 h-2.5 inline ml-0.5 text-gray-300 group-hover/tip:text-gw-green transition-colors" />
                      )}
                    </span>
                    {desc && (
                      <div className="absolute left-0 bottom-full mb-1 w-52 p-2.5 bg-gw-green text-white text-[11px] rounded-lg shadow-lg opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-200 z-50 pointer-events-none leading-relaxed">
                        {desc}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
