import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BookingState, SubmissionState } from "@/types/booking";

const TOTAL_STEPS = 5;

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
      referringAgent: null,
      bookingSubmitted: false,
      submission: {
        submitting: false,
        submitError: null,
        orderId: null,
        orderOid: null,
      },

      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, TOTAL_STEPS) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),
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
      name: "gw-booking-v3",
      partialize: (state) => ({
        // Only persist the agent referral link — form data resets each visit
        schedulerId: state.schedulerId,
      }),
    }
  )
);
