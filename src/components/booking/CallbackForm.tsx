"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookingStore } from "@/store/booking";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Phone, X, CheckCircle2 } from "lucide-react";

export function CallbackForm() {
  const { callbackName, callbackPhone, callbackRequested, setCallback, currentStep } =
    useBookingStore();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // Prototype: log to console, no API call
    console.log("Callback requested:", { name: callbackName, phone: callbackPhone });
    setCallback({ requested: true });
    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
    }, 2000);
  };

  return (
    <>
      {/* Floating trigger button — hidden during package, scheduler, and confirm steps */}
      {!open && !callbackRequested && currentStep < 3 && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center justify-center gap-2 w-12 h-12 sm:w-auto sm:h-auto sm:px-5 sm:py-3 rounded-full bg-gw-orange text-white text-sm sm:text-base font-semibold font-heading shadow-lg hover:bg-gw-orange-light transition-colors cursor-pointer"
        >
          <Phone className="w-5 h-5" />
          <span className="hidden sm:inline">Request a Call</span>
        </motion.button>
      )}

      {/* Modal backdrop + form */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-4 sm:pb-0"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 md:p-8 shadow-2xl"
            >
              {submitted ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-12 h-12 text-gw-green mx-auto mb-3" />
                  <h3 className="text-xl font-heading font-bold text-gray-900">
                    We&apos;ll call you back!
                  </h3>
                  <p className="text-gray-500 mt-2 text-sm">
                    Expect a call within 15 minutes during business hours.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-heading font-bold text-gray-900">
                        Request a Callback
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        We&apos;ll call you within 15 minutes.
                      </p>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="Your Name"
                      value={callbackName}
                      onChange={(v) => setCallback({ name: v })}
                      placeholder="John Smith"
                      required
                    />
                    <Input
                      label="Phone Number"
                      value={callbackPhone}
                      onChange={(v) =>
                        setCallback({
                          phone: v.replace(/[^\d()-\s+]/g, "").slice(0, 15),
                        })
                      }
                      placeholder="(214) 555-0123"
                      type="tel"
                      required
                    />
                  </div>

                  <div className="mt-6">
                    <Button
                      onClick={handleSubmit}
                      disabled={!callbackName.trim() || !callbackPhone.trim()}
                      size="lg"
                      className="w-full"
                    >
                      <Phone className="w-5 h-5" />
                      Call Me Back
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
