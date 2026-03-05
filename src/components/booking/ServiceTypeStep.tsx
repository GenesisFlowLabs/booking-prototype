"use client";

import { useBookingStore } from "@/store/booking";
import { services } from "@/data/services";
import { RadioCard } from "@/components/ui/RadioCard";
import { Button } from "@/components/ui/Button";
import { Home, HardHat, Leaf, Building2, ArrowRight } from "lucide-react";
import { ServiceType } from "@/types/booking";

const iconMap: Record<string, React.ElementType> = {
  Home,
  HardHat,
  Leaf,
  Building2,
};

export function ServiceTypeStep() {
  const { serviceType, setServiceType, nextStep } = useBookingStore();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
          What type of inspection do you need?
        </h2>
        <p className="text-gray-500 mt-2">
          Select a service to get started with your booking.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((service) => {
          const Icon = iconMap[service.icon] || Home;
          return (
            <RadioCard
              key={service.id}
              selected={serviceType === service.id}
              onSelect={() => setServiceType(service.id as ServiceType)}
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
                    Starting at ${service.startingPrice}
                  </p>
                </div>
              </div>
            </RadioCard>
          );
        })}
      </div>

      <div className="flex justify-center mt-8">
        <Button onClick={nextStep} disabled={!serviceType} size="lg">
          Continue
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
