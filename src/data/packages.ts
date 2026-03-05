import { Package, PackageFeature } from "@/types/booking";

export const packages: Package[] = [
  {
    id: "green",
    name: "Green",
    tagline: "Essential coverage",
    price: 545,
    features: [
      "Full home inspection",
      "Digital report within 24 hours",
      "200+ point checklist",
      "Photo documentation",
      "Inspector Q&A support",
    ],
  },
  {
    id: "greener",
    name: "Greener",
    tagline: "Complete peace of mind",
    // NOTE: Price estimated — verify with GreenWorks before going live
    price: 895,
    priceNote: "estimated",
    popular: true,
    features: [
      "Everything in Green, plus:",
      "Termite/WDI inspection",
      "Radon testing",
      "Sewer scope inspection",
      "90-day warranty",
      "Priority scheduling",
    ],
  },
  {
    id: "greenest",
    name: "Greenest",
    tagline: "The full picture",
    // NOTE: Price estimated — verify with GreenWorks before going live
    price: 1195,
    priceNote: "estimated",
    features: [
      "Everything in Greener, plus:",
      "Pool & spa inspection",
      "Sprinkler system check",
      "Thermal imaging scan",
      "Mold air quality test",
      "180-day warranty",
      "Dedicated concierge line",
    ],
  },
];

export const featureComparison: PackageFeature[] = [
  { name: "Full Home Inspection", green: true, greener: true, greenest: true },
  { name: "Digital Report (24hr)", green: true, greener: true, greenest: true },
  { name: "200+ Point Checklist", green: true, greener: true, greenest: true },
  { name: "Photo Documentation", green: true, greener: true, greenest: true },
  { name: "Inspector Q&A", green: true, greener: true, greenest: true },
  { name: "Termite/WDI Inspection", green: false, greener: true, greenest: true },
  { name: "Radon Testing", green: false, greener: true, greenest: true },
  { name: "Sewer Scope", green: false, greener: true, greenest: true },
  { name: "Priority Scheduling", green: false, greener: true, greenest: true },
  { name: "Pool & Spa Inspection", green: false, greener: false, greenest: true },
  { name: "Sprinkler System Check", green: false, greener: false, greenest: true },
  { name: "Thermal Imaging", green: false, greener: false, greenest: true },
  { name: "Mold Air Quality Test", green: false, greener: false, greenest: true },
  { name: "Warranty", green: false, greener: true, greenest: true },
  { name: "Warranty Duration", green: false, greener: true, greenest: true },
  { name: "Concierge Line", green: false, greener: false, greenest: true },
];
