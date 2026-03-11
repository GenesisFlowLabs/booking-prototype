import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BookingState } from "@/types/booking";

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

      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, TOTAL_STEPS) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),
      setServiceType: (type) => set({ serviceType: type }),
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
          // Don't reset schedulerId — it persists from URL
        }),
    }),
    {
      name: "gw-booking-v2",
      partialize: (state) => ({
        serviceType: state.serviceType,
        address: state.address,
        isValidZip: state.isValidZip,
        selectedPackage: state.selectedPackage,
        contact: state.contact,
        property: state.property,
        selectedSlot: state.selectedSlot,
        schedulerId: state.schedulerId,
      }),
    }
  )
);
