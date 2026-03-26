"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBookingStore } from "@/store/booking";
import { StepIndicator } from "./StepIndicator";
import { AgentBanner } from "./AgentBanner";
import { ServiceTypeStep } from "./ServiceTypeStep";
import { DetailsStep } from "./DetailsStep";
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
  const { currentStep, bookingSubmitted } = useBookingStore();
  const direction = useBookingStore((s) => s.currentStep);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevStepRef = useRef(currentStep);

  // Scroll to top of booking flow on step change
  // Delay allows hero collapse animation (400ms) to finish before scrolling
  useEffect(() => {
    if (currentStep !== prevStepRef.current) {
      const wasStep1 = prevStepRef.current === 1;
      prevStepRef.current = currentStep;
      const delay = wasStep1 ? 450 : 50;
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, delay);
    }
  }, [currentStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ServiceTypeStep />;
      case 2:
        return <DetailsStep />;
      case 3:
        return <PackageStep />;
      case 4:
        return <SchedulerStep />;
      case 5:
        return <ConfirmationStep />;
      default:
        return <ServiceTypeStep />;
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto scroll-mt-4">
      {!bookingSubmitted && (
        <>
          <AgentBanner />
          <StepIndicator currentStep={currentStep} />
        </>
      )}

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
