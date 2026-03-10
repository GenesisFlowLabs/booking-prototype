"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useBookingStore } from "@/store/booking";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  User,
  RefreshCw,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ISNTimeSlot, SelectedSlot } from "@/types/booking";
import { getISNMarketTags } from "@/data/service-areas";

interface AvailabilityData {
  slots: ISNTimeSlot[];
  byDate: Record<string, ISNTimeSlot[]>;
}

function formatTime(datetime: string): string {
  const time = datetime.split(" ")[1];
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
}

function formatInspectorName(name: string): string {
  // "Troy Cunningham, CPI DFW IT1" -> "Troy C."
  const parts = name.split(",")[0].split(" ");
  if (parts.length >= 2) return `${parts[0]} ${parts[1][0]}.`;
  return parts[0];
}

function getMarketFromName(name: string): string | null {
  const markets = ["DFW", "HOU", "SA", "ATX", "SA/ATX", "COL", "OKC", "FLA"];
  for (const m of markets) {
    if (name.includes(m)) return m;
  }
  return null;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Filter slots to only show inspectors matching the user's market
function filterSlotsByMarket(
  slots: ISNTimeSlot[],
  marketTags: string[] | null
): ISNTimeSlot[] {
  if (!marketTags) return slots; // No filter if we can't determine market
  return slots
    .map((slot) => {
      const matchingInspectors = slot.inspectors.filter((insp) =>
        marketTags.some((tag) => insp.name.includes(tag))
      );
      if (matchingInspectors.length === 0) return null;
      return { ...slot, inspectors: matchingInspectors };
    })
    .filter((s): s is ISNTimeSlot => s !== null);
}

export function SchedulerStep() {
  const { nextStep, prevStep, selectedPackage, address, selectedSlot, setSelectedSlot } =
    useBookingStore();

  const marketTags = useMemo(() => getISNMarketTags(address.zip), [address.zip]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availability, setAvailability] = useState<AvailabilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = useCallback(async (year: number, month: number) => {
    setLoading(true);
    setError(null);
    try {
      // ISN rejects past/today dates — use tomorrow as earliest start
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
      const startDay = isCurrentMonth ? tomorrow.getDate() : 1;
      const start = `${year}-${String(month + 1).padStart(2, "0")}-${String(startDay).padStart(2, "0")}`;
      const lastDay = new Date(year, month + 1, 0).getDate();
      const end = `${year}-${String(month + 1).padStart(2, "0")}-${lastDay}`;
      const res = await fetch(`/api/isn/availability?start=${start}&end=${end}`);
      if (!res.ok) throw new Error("Failed to load availability");
      const data: AvailabilityData = await res.json();
      // Filter to user's market
      const filteredSlots = filterSlotsByMarket(data.slots, marketTags);
      const filteredByDate: Record<string, ISNTimeSlot[]> = {};
      for (const slot of filteredSlots) {
        const date = slot.start.split(" ")[0];
        if (!filteredByDate[date]) filteredByDate[date] = [];
        filteredByDate[date].push(slot);
      }
      setAvailability({ slots: filteredSlots, byDate: filteredByDate });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability(viewYear, viewMonth);
  }, [viewYear, viewMonth, fetchAvailability]);

  const navigateMonth = (dir: 1 | -1) => {
    let m = viewMonth + dir;
    let y = viewYear;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }
    setViewMonth(m);
    setViewYear(y);
    setSelectedDate(null);
  };

  // Calendar grid
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const availableDates = availability ? Object.keys(availability.byDate) : [];

  const slotsForDate = selectedDate && availability?.byDate[selectedDate]
    ? availability.byDate[selectedDate]
    : [];

  // Deduplicate slots: group by time, pick best inspector
  const uniqueSlots = useMemo(() => {
    const seen = new Map<string, ISNTimeSlot>();
    for (const slot of slotsForDate) {
      const key = `${slot.start}-${slot.end}`;
      if (!seen.has(key)) {
        seen.set(key, slot);
      }
    }
    return Array.from(seen.values()).sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );
  }, [slotsForDate]);

  // All inspectors for selected date (for slot selection)
  const inspectorsForSlot = useCallback(
    (start: string, end: string) => {
      return slotsForDate
        .filter((s) => s.start === start && s.end === end)
        .flatMap((s) => s.inspectors);
    },
    [slotsForDate]
  );

  const handleSlotSelect = (slot: ISNTimeSlot) => {
    const date = slot.start.split(" ")[0];
    const inspector = slot.inspectors[0];
    const selected: SelectedSlot = {
      date,
      start: slot.start,
      end: slot.end,
      inspectorId: inspector.id,
      inspectorName: inspector.name,
      quote: slot.quote,
    };
    setSelectedSlot(selected);
  };

  const canProceed = selectedSlot !== null;
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
          Pick your inspection date
        </h2>
        <p className="text-gray-500 mt-2">
          Select an available date and time. Our inspectors are available 7 days
          a week.
        </p>
      </div>

      {/* Context banner */}
      <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-gw-green/5 border border-gw-green/20">
        <Calendar className="w-5 h-5 text-gw-green flex-shrink-0" />
        <p className="text-sm text-gray-700">
          You&apos;re scheduling a{" "}
          <strong className="text-gw-green capitalize">{selectedPackage}</strong>{" "}
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
          <div className="grid grid-cols-7 gap-1 relative">
            {loading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-xl">
                <Loader2 className="w-6 h-6 text-gw-green animate-spin" />
              </div>
            )}

            {/* Empty cells before first day */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isAvailable = availableDates.includes(dateStr);
              const isSelected = selectedDate === dateStr;
              const isPast =
                new Date(viewYear, viewMonth, day) < today;
              const isToday =
                day === today.getDate() &&
                viewMonth === today.getMonth() &&
                viewYear === today.getFullYear();
              const slotCount = availability?.byDate[dateStr]?.length ?? 0;

              return (
                <button
                  key={day}
                  onClick={() => isAvailable && !isPast && setSelectedDate(dateStr)}
                  disabled={!isAvailable || isPast}
                  className={`
                    aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium
                    transition-all duration-200 relative
                    ${isPast ? "text-gray-300 cursor-not-allowed" : ""}
                    ${isAvailable && !isPast && !isSelected ? "text-gray-900 hover:bg-gw-green/10 cursor-pointer" : ""}
                    ${!isAvailable && !isPast ? "text-gray-300 cursor-not-allowed" : ""}
                    ${isSelected ? "bg-gw-green text-white shadow-lg shadow-gw-green/25 scale-105" : ""}
                    ${isToday && !isSelected ? "ring-2 ring-gw-green/30" : ""}
                  `}
                >
                  <span className={isSelected ? "font-bold" : ""}>{day}</span>
                  {isAvailable && !isPast && (
                    <span
                      className={`text-[9px] leading-none mt-0.5 ${
                        isSelected ? "text-white/80" : "text-gw-green"
                      }`}
                    >
                      {slotCount} {slotCount === 1 ? "slot" : "slots"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots panel */}
        <div className="lg:col-span-2">
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
                  Select a date to see
                  <br />
                  available time slots
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
                  {uniqueSlots.length} time{uniqueSlots.length !== 1 ? "s" : ""}{" "}
                  available
                </p>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {uniqueSlots.map((slot) => {
                    const inspectors = inspectorsForSlot(slot.start, slot.end);
                    const isChosen =
                      selectedSlot?.start === slot.start &&
                      selectedSlot?.end === slot.end;
                    const market = getMarketFromName(
                      slot.inspectors[0]?.name ?? ""
                    );

                    return (
                      <button
                        key={`${slot.start}-${slot.end}`}
                        onClick={() => handleSlotSelect(slot)}
                        className={`
                          w-full text-left p-3 rounded-xl border-2 transition-all duration-200
                          ${
                            isChosen
                              ? "border-gw-green bg-gw-green/5 shadow-sm"
                              : "border-gray-100 hover:border-gw-green/40 hover:bg-gray-50"
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock
                              className={`w-4 h-4 ${
                                isChosen ? "text-gw-green" : "text-gray-400"
                              }`}
                            />
                            <span className="font-semibold text-sm text-gray-900">
                              {formatTime(slot.start)} – {formatTime(slot.end)}
                            </span>
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

                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {inspectors.length} inspector
                            {inspectors.length !== 1 ? "s" : ""}
                          </span>
                          {market && (
                            <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
                              {market}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error state */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-center"
            >
              <p className="text-sm text-red-700 mb-2">{error}</p>
              <button
                onClick={() => fetchAvailability(viewYear, viewMonth)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-700 hover:text-red-900"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Try again
              </button>
            </motion.div>
          )}

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
                  {formatTime(selectedSlot.start)} – {formatTime(selectedSlot.end)}{" "}
                  &middot; {formatInspectorName(selectedSlot.inspectorName)}
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
