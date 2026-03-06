import { create } from "zustand";
import { BookingState } from "@/types/booking";

export const useBookingStore = create<BookingState>((set) => ({
  currentStep: 1,
  serviceType: null,
  address: { street: "", city: "", state: "", zip: "" },
  isValidZip: null,
  selectedPackage: null,
  callbackRequested: false,
  callbackPhone: "",
  callbackName: "",

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 4) })),
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
    }),
}));
