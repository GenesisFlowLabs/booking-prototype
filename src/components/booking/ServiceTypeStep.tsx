"use client";

import { useEffect, useState, useRef } from "react";
import { useBookingStore } from "@/store/booking";
import { services } from "@/data/services";
import { RadioCard } from "@/components/ui/RadioCard";
import { Button } from "@/components/ui/Button";
import { Home, HardHat, Leaf, Building2, Building, ArrowRight, MapPin, CheckCircle2, XCircle } from "lucide-react";
import { ServiceType } from "@/types/booking";
import { validateZip } from "@/data/service-areas";
import { motion, AnimatePresence } from "framer-motion";

const iconMap: Record<string, React.ElementType> = {
  Home,
  HardHat,
  Leaf,
  Building2,
  Building,
};

export function ServiceTypeStep() {
  const { serviceType, setServiceType, address, setAddress, isValidZip, setZipValid, nextStep } = useBookingStore();
  const [zip, setZip] = useState(address.zip);
  const zipRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (zip.length === 5) {
      const result = validateZip(zip);
      setZipValid(result.valid);
      if (result.valid && result.state) {
        setAddress({ zip, state: result.state });
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

  const zipResult = zip.length === 5 ? validateZip(zip) : null;
  const canProceed = serviceType !== null && isValidZip === true;

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
                setTimeout(() => zipRef.current?.focus(), 150);
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

      <div className="flex justify-center mt-8">
        <Button onClick={nextStep} disabled={!canProceed} size="lg">
          Continue
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
