export type ServiceType = "home" | "engineering" | "environmental" | "new-construction" | "commercial";

export interface ServiceOption {
  id: ServiceType;
  title: string;
  description: string;
  startingPrice: number;
  priceHigh?: number;
  icon: string; // lucide icon name
}

export type PackageTier = "green" | "greener" | "greenest" | "nc1" | "nc2" | "nc3";

export interface PackageFeature {
  name: string;
  green: boolean;
  greener: boolean;
  greenest: boolean;
}

export interface NCPackageFeature {
  name: string;
  nc1: boolean;
  nc2: boolean;
  nc3: boolean;
}

export interface Package {
  id: PackageTier;
  name: string;
  tagline: string;
  price: number;
  priceNote?: string; // e.g. "estimated" for unconfirmed prices
  popular?: boolean;
  features: string[];
  serviceType?: ServiceType; // which service this package belongs to
  isnOrderTypeId?: string; // Maps to ISN order_types UUID
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

// --- ISN Native Scheduler Types ---

export interface ISNTimeSlot {
  start: string;
  end: string;
  inspectors: { id: string; name: string }[];
  distance: number;
  quote: number;
}

export type PreferredTime = "09:30" | "14:30";

// Preferred appointment — date + 9:30 AM or 2:30 PM Central. NOT a confirmed
// slot. Order lands in ISN as unscheduled; GreenWorks confirms manually.
export interface SelectedSlot {
  date: string;
  preferredTime: PreferredTime;
}

// --- ISN Order Submission Types ---

export interface ISNCreateOrderPayload {
  datetime: string;
  address: string;
  city: string;
  state: string;
  postal: string;
  client: {
    name: string;
    email?: string;
    mobile?: string;
  };
  agent?: {
    name: string;
    email?: string;
    mobile?: string;
  };
  inspectorId?: string;
  orderType?: number;
  notes?: string;
  area?: string;
  fee?: number;
}

export interface ISNCreateOrderResponse {
  status: string;
  orderId: string;
  oid: number;
}

export interface SubmissionState {
  submitting: boolean;
  submitError: string | null;
  orderId: string | null;
  orderOid: number | null;
}

// --- Contact & Property Types ---

export type ContactRole = "buyer" | "owner" | "agent";

export interface ContactInfo {
  role: ContactRole | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export type FoundationType = "slab" | "pier-beam" | "unknown";

export interface VIPAgentInfo {
  slug: string;
  name: string;
  phone: string;
  isnUserId: string;
}

export interface ReferringAgent {
  id: string | null;
  name: string;
  email: string;
  phone: string;
  agency: string;
  isNew: boolean;
}

export interface PropertyInfo {
  sqft: string;
  foundation: FoundationType;
}

// --- Booking State ---

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

  // Contact & property
  contact: ContactInfo;
  property: PropertyInfo;

  // Native scheduler
  selectedSlot: SelectedSlot | null;

  // Scheduler attribution (VIP link tracking)
  schedulerId: string | null;
  vipAgent: VIPAgentInfo | null;

  // Submission state (hides step indicator on success screen)
  bookingSubmitted: boolean;

  // Agent referral
  referringAgent: ReferringAgent | null;

  // Order submission
  submission: SubmissionState;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setServiceType: (type: ServiceType) => void;
  setAddress: (address: Partial<BookingState["address"]>) => void;
  setZipValid: (valid: boolean | null) => void;
  setPackage: (pkg: PackageTier) => void;
  setCallback: (data: { name?: string; phone?: string; requested?: boolean }) => void;
  setContact: (data: Partial<ContactInfo>) => void;
  setProperty: (data: Partial<PropertyInfo>) => void;
  setSelectedSlot: (slot: SelectedSlot | null) => void;
  setSchedulerId: (id: string | null) => void;
  setBookingSubmitted: (submitted: boolean) => void;
  setVIPAgent: (agent: VIPAgentInfo | null) => void;
  setReferringAgent: (agent: ReferringAgent | null) => void;
  setSubmission: (data: Partial<SubmissionState>) => void;
  reset: () => void;
}
