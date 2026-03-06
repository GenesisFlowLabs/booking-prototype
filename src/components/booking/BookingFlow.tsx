"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useBookingStore } from "@/store/booking";
import { StepIndicator } from "./StepIndicator";
import { ServiceTypeStep } from "./ServiceTypeStep";
import { PackageStep } from "./PackageStep";
import { SchedulerStep } from "./SchedulerStep";
import { ConfirmationStep } from "./ConfirmationStep";

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

export function BookingFlow() {
  const { currentStep } = useBookingStore();
  // Track direction for animation (positive = forward, negative = backward)
  const direction = useBookingStore((s) => s.currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ServiceTypeStep />;
      case 2:
        return <PackageStep />;
      case 3:
        return <SchedulerStep />;
      case 4:
        return <ConfirmationStep />;
      default:
        return <ServiceTypeStep />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <StepIndicator currentStep={currentStep} />

      <div className="relative min-h-[500px] md:min-h-[600px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full px-4 sm:px-6"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
