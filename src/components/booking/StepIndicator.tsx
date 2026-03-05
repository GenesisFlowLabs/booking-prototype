"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const steps = [
  { num: 1, label: "Service" },
  { num: 2, label: "Address" },
  { num: 3, label: "Package" },
  { num: 4, label: "Schedule" },
  { num: 5, label: "Confirm" },
];

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const isComplete = currentStep > step.num;
          const isCurrent = currentStep === step.num;

          return (
            <div key={step.num} className="flex items-center flex-1 last:flex-none">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isComplete
                      ? "#227038"
                      : isCurrent
                        ? "#227038"
                        : "#e5e7eb",
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-bold font-heading"
                >
                  {isComplete ? (
                    <Check className="w-4 h-4 md:w-5 md:h-5 text-white" strokeWidth={3} />
                  ) : (
                    <span className={isCurrent ? "text-white" : "text-gray-400"}>
                      {step.num}
                    </span>
                  )}
                </motion.div>
                <span
                  className={`mt-1.5 text-[10px] md:text-xs font-medium ${
                    isCurrent || isComplete ? "text-gw-green" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 md:mx-3 mt-[-18px] md:mt-[-22px] rounded-full overflow-hidden bg-gray-200">
                  <motion.div
                    initial={false}
                    animate={{
                      width: isComplete ? "100%" : isCurrent ? "50%" : "0%",
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="h-full bg-gw-green"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
