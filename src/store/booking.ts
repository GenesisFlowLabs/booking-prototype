import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BookingState, SubmissionState } from "@/types/booking";

const TOTAL_STEPS = 5;
const SESSION_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours — stale sessions auto-clear

const initialContact = {
  role: null as BookingState["contact"]["role"],
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

const initialProperty = {
  sqft: "",
  foundation: "unknown" as const,
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      currentStep: 1,
      serviceType: null,
      address: { street: "", city: "", state: "", zip: "" },
      isValidZip: null,
      selectedPackage: null,
      callbackRequested: false,
      callbackPhone: "",
      callbackName: "",
      contact: { ...initialContact },
      property: { ...initialProperty },
      selectedSlot: null,
      schedulerId: null,
      vipAgent: null,
      referringAgent: null,
      bookingSubmitted: false,
      submission: {
        submitting: false,
        submitError: null,
        orderId: null,
        orderOid: null,
      },

      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((s) => {
        const hasPackages = s.serviceType === "home" || s.serviceType === "new-construction";
        let next = s.currentStep + 1;
        if (!hasPackages && next === 3) next++; // skip PackageStep
        return { currentStep: Math.min(next, TOTAL_STEPS) };
      }),
      prevStep: () => set((s) => {
        const hasPackages = s.serviceType === "home" || s.serviceType === "new-construction";
        let prev = s.currentStep - 1;
        if (!hasPackages && prev === 3) prev--; // skip PackageStep
        return { currentStep: Math.max(prev, 1) };
      }),
      setServiceType: (type) => set((s) => ({
        serviceType: type,
        // Clear package selection when switching service types (different tier IDs)
        selectedPackage: s.serviceType !== type ? null : s.selectedPackage,
      })),
      setAddress: (address) =>
        set((s) => ({ address: { ...s.address, ...address } })),
      setZipValid: (valid) => set({ isValidZip: valid }),
      setPackage: (pkg) => set({ selectedPackage: pkg }),
      setCallback: (data) =>
        set((s) => ({
          callbackName: data.name ?? s.callbackName,
          callbackPhone: data.phone ?? s.callbackPhone,
          callbackRequested: data.requested ?? s.callbackRequested,
        })),
      setContact: (data) =>
        set((s) => ({ contact: { ...s.contact, ...data } })),
      setProperty: (data) =>
        set((s) => ({ property: { ...s.property, ...data } })),
      setSelectedSlot: (slot) => set({ selectedSlot: slot }),
      setSchedulerId: (id) => set({ schedulerId: id }),
      setBookingSubmitted: (submitted) => set({ bookingSubmitted: submitted }),
      setVIPAgent: (agent) => set({ vipAgent: agent }),
      setReferringAgent: (agent) => set({ referringAgent: agent }),
      setSubmission: (data) =>
        set((s) => ({ submission: { ...s.submission, ...data } })),
      reset: () =>
        set({
          currentStep: 1,
          serviceType: null,
          address: { street: "", city: "", state: "", zip: "" },
          isValidZip: null,
          selectedPackage: null,
          callbackRequested: false,
          callbackPhone: "",
          callbackName: "",
          contact: { ...initialContact },
          property: { ...initialProperty },
          selectedSlot: null,
          vipAgent: null,
          referringAgent: null,
          bookingSubmitted: false,
          submission: {
            submitting: false,
            submitError: null,
            orderId: null,
            orderOid: null,
          },
          // Don't reset schedulerId — it persists from URL
        }),
    }),
    {
      name: "gw-booking-v5",
      partialize: (state) => ({
        // Persist form progress so users can resume after accidental refresh
        currentStep: state.currentStep,
        serviceType: state.serviceType,
        address: state.address,
        isValidZip: state.isValidZip,
        selectedPackage: state.selectedPackage,
        contact: state.contact,
        property: state.property,
        selectedSlot: state.selectedSlot,
        schedulerId: state.schedulerId,
        vipAgent: state.vipAgent,
        referringAgent: state.referringAgent,
        // Don't persist: submission state, bookingSubmitted, callbacks
        _savedAt: Date.now(),
      }),
      onRehydrateStorage: () => {
        return (state) => {
          if (!state) return;
          // Clear stale sessions (older than 2 hours)
          const savedAt = (state as unknown as { _savedAt?: number })._savedAt;
          if (savedAt && Date.now() - savedAt > SESSION_TTL_MS) {
            state.reset();
          }
        };
      },
    }
  )
);
