"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useBookingStore } from "@/store/booking";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { PreferredTime } from "@/types/booking";
import { homePackages, ncPackages } from "@/data/packages";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// GreenWorks works 7 days a week. These are the only fully-closed holidays.
function isClosedHoliday(date: Date): boolean {
  const m = date.getMonth();
  const d = date.getDate();
  // Jan 1 (NYD), Jul 4, Dec 25
  return (m === 0 && d === 1) || (m === 6 && d === 4) || (m === 11 && d === 25);
}

const TIME_OPTIONS: { value: PreferredTime; display: string; subtitle: string }[] = [
  { value: "09:30", display: "9:30 AM", subtitle: "Morning" },
  { value: "14:30", display: "2:30 PM", subtitle: "Afternoon" },
];

export function SchedulerStep() {
  const { nextStep, prevStep, selectedPackage, selectedSlot, setSelectedSlot } =
    useBookingStore();

  const allPackages = [...homePackages, ...ncPackages];
  const pkg = allPackages.find((p) => p.id === selectedPackage);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const continueRef = useRef<HTMLDivElement>(null);
  const timePickerRef = useRef<HTMLDivElement>(null);

  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    selectedSlot?.date ?? null
  );

  const navigateMonth = (dir: 1 | -1) => {
    let m = viewMonth + dir;
    let y = viewYear;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }
    setViewMonth(m);
    setViewYear(y);
  };

  // Calendar grid math
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Auto-scroll to time picker when a date is selected
  useEffect(() => {
    if (selectedDate && timePickerRef.current) {
      setTimeout(() => {
        timePickerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    }
  }, [selectedDate]);

  // Auto-scroll to Continue when both date + time are picked
  useEffect(() => {
    if (selectedSlot && continueRef.current) {
      setTimeout(() => {
        continueRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [selectedSlot]);

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    // Preserve previously chosen time if the user is just changing the date
    if (selectedSlot?.preferredTime) {
      setSelectedSlot({ date: dateStr, preferredTime: selectedSlot.preferredTime });
    } else {
      setSelectedSlot(null);
    }
  };

  const handleTimeClick = (time: PreferredTime) => {
    if (!selectedDate) return;
    setSelectedSlot({ date: selectedDate, preferredTime: time });
  };

  const canProceed = !!selectedSlot;
  const isPastMonth =
    viewYear < today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth < today.getMonth());
  const isMaxMonth =
    viewYear > today.getFullYear() + 1 ||
    (viewYear === today.getFullYear() + 1 && viewMonth > today.getMonth());

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
          Pick your preferred date and time
        </h2>
        <p className="text-gray-500 mt-2">
          Choose what works best — a team member will reach out shortly to confirm.
        </p>
      </div>

      {/* Context banner */}
      <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-gw-green/5 border border-gw-green/20">
        <Calendar className="w-5 h-5 text-gw-green flex-shrink-0" />
        <p className="text-sm text-gray-700">
          You&apos;re scheduling a{" "}
          <strong className="text-gw-green">{pkg?.name || selectedPackage}</strong>{" "}
          package inspection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => navigateMonth(-1)}
              disabled={isPastMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h3 className="text-lg font-heading font-bold text-gray-900">
              {MONTHS[viewMonth]} {viewYear}
            </h3>
            <button
              onClick={() => navigateMonth(1)}
              disabled={isMaxMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-semibold text-gray-400 uppercase py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const cellDate = new Date(viewYear, viewMonth, day);
              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isPast = cellDate < today;
              const isHoliday = isClosedHoliday(cellDate);
              const isAvailable = !isPast && !isHoliday;
              const isSelected = selectedDate === dateStr;
              const isToday =
                day === today.getDate() &&
                viewMonth === today.getMonth() &&
                viewYear === today.getFullYear();

              return (
                <button
                  key={day}
                  onClick={() => isAvailable && handleDateClick(dateStr)}
                  disabled={!isAvailable}
                  className={`
                    aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium
                    transition-all duration-200 relative
                    ${isPast ? "text-gray-300 cursor-not-allowed" : ""}
                    ${isHoliday && !isPast ? "text-gray-300 cursor-not-allowed" : ""}
                    ${isAvailable && !isSelected ? "text-gray-900 hover:bg-gw-green/10 cursor-pointer" : ""}
                    ${isSelected ? "bg-gw-green text-white shadow-lg shadow-gw-green/25 scale-105" : ""}
                    ${isToday && !isSelected ? "ring-2 ring-gw-green/30" : ""}
                  `}
                >
                  <span className={isSelected ? "font-bold" : ""}>{day}</span>
                  {isHoliday && !isPast && (
                    <span className="text-[8px] leading-none mt-0.5 text-gray-400">
                      Closed
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time picker panel */}
        <div className="lg:col-span-2" ref={timePickerRef}>
          <AnimatePresence mode="wait">
            {!selectedDate ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center min-h-[300px]"
              >
                <Calendar className="w-10 h-10 text-gray-200 mb-3" />
                <p className="text-sm text-gray-400 font-medium">
                  Select a date to choose
                  <br />
                  your preferred time
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={selectedDate}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 min-h-[300px]"
              >
                <h4 className="font-heading font-bold text-gray-900 mb-1">
                  {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h4>
                <p className="text-xs text-gray-400 mb-4">
                  Pick a preferred time
                </p>

                <div className="space-y-2">
                  {TIME_OPTIONS.map((opt) => {
                    const isChosen = selectedSlot?.preferredTime === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleTimeClick(opt.value)}
                        className={`
                          w-full text-left p-4 rounded-xl border-2 transition-all duration-200
                          ${
                            isChosen
                              ? "border-gw-green bg-gw-green/5 shadow-sm"
                              : "border-gray-100 hover:border-gw-green/40 hover:bg-gray-50"
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Clock
                              className={`w-5 h-5 ${
                                isChosen ? "text-gw-green" : "text-gray-400"
                              }`}
                            />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {opt.display}
                                <span className="text-xs text-gray-400 font-normal ml-1.5">
                                  CT
                                </span>
                              </p>
                              <p className="text-xs text-gray-500">{opt.subtitle}</p>
                            </div>
                          </div>
                          {isChosen && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-5 h-5 rounded-full bg-gw-green flex items-center justify-center"
                            >
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </motion.div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedSlot && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100 flex gap-2"
                  >
                    <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700 leading-relaxed">
                      A team member will reach out shortly to confirm your appointment.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fallback call option */}
          <div className="mt-4 p-4 rounded-xl bg-warm-gray text-center">
            <p className="text-xs text-gray-500 mb-2">
              Prefer to book by phone?
            </p>
            <a
              href="tel:8553496757"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gw-green hover:text-gw-green-dark transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              (855) 349-6757
            </a>
          </div>
        </div>
      </div>

      {/* Selected slot summary */}
      <AnimatePresence>
        {selectedSlot && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 p-4 rounded-2xl bg-gw-green/5 border border-gw-green/20"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(selectedSlot.date + "T12:00:00").toLocaleDateString(
                    "en-US",
                    { weekday: "long", month: "long", day: "numeric", year: "numeric" }
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedSlot.preferredTime === "09:30" ? "9:30 AM" : "2:30 PM"} Central Standard Time (preferred)
                </p>
              </div>
              <button
                onClick={() => setSelectedSlot(null)}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Change
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={continueRef} className="flex items-center justify-between mt-8">
        <Button onClick={prevStep} variant="ghost">
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>
        <Button onClick={nextStep} disabled={!canProceed} size="lg" pulse={canProceed}>
          Continue
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
