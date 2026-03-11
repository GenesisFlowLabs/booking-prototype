import { ServiceOption } from "@/types/booking";

export const services: ServiceOption[] = [
  {
    id: "home",
    title: "Pre-Owned Home Inspections",
    description: "Complete evaluation of your home's condition — structure, systems, safety.",
    startingPrice: 545,
    priceHigh: 1195,
    icon: "Home",
  },
  {
    id: "new-construction",
    title: "New Construction Inspections",
    description: "Phase inspections for new builds — pre-pour, pre-drywall, and final.",
    startingPrice: 495,
    priceHigh: 1100,
    icon: "Building2",
  },
  {
    id: "engineering",
    title: "Engineering Services",
    description: "Structural and foundation assessments by licensed professional engineers.",
    startingPrice: 595,
    priceHigh: 1200,
    icon: "HardHat",
  },
  {
    id: "environmental",
    title: "Environmental Services",
    description: "Mold, radon, air quality, and environmental hazard testing.",
    startingPrice: 295,
    priceHigh: 750,
    icon: "Leaf",
  },
  {
    id: "commercial",
    title: "Commercial Property Inspections",
    description: "Comprehensive inspections for commercial and multi-family properties.",
    startingPrice: 995,
    priceHigh: 2500,
    icon: "Building",
  },
];
