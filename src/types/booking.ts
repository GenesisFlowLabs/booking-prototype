export type ServiceType = "home" | "engineering" | "environmental" | "new-construction";

export interface ServiceOption {
  id: ServiceType;
  title: string;
  description: string;
  startingPrice: number;
  icon: string; // lucide icon name
}

export type PackageTier = "green" | "greener" | "greenest";

export interface PackageFeature {
  name: string;
  green: boolean;
  greener: boolean;
  greenest: boolean;
}

export interface Package {
  id: PackageTier;
  name: string;
  tagline: string;
  price: number;
  priceNote?: string; // e.g. "estimated" for unconfirmed prices
  popular?: boolean;
  features: string[];
}

export interface ServiceArea {
  state: string;
  stateCode: string;
  metros: { name: string; zipRanges: [number, number][] }[];
}

export interface Review {
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
}

export interface TrustBadge {
  id: string;
  name: string;
  value?: string;
}

export interface BookingState {
  currentStep: number;
  serviceType: ServiceType | null;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  isValidZip: boolean | null;
  selectedPackage: PackageTier | null;
  callbackRequested: boolean;
  callbackPhone: string;
  callbackName: string;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setServiceType: (type: ServiceType) => void;
  setAddress: (address: Partial<BookingState["address"]>) => void;
  setZipValid: (valid: boolean | null) => void;
  setPackage: (pkg: PackageTier) => void;
  setCallback: (data: { name?: string; phone?: string; requested?: boolean }) => void;
  reset: () => void;
}
