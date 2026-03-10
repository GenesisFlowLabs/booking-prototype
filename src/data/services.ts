import { ServiceOption } from "@/types/booking";

export const services: ServiceOption[] = [
  {
    id: "home",
    title: "Home Inspection",
    description: "Complete evaluation of your home's condition — structure, systems, safety.",
    startingPrice: 545,
    priceHigh: 1195,
    icon: "Home",
  },
  {
    id: "engineering",
    title: "Engineering",
    description: "Structural and foundation assessments by licensed professional engineers.",
    startingPrice: 595,
    priceHigh: 1200,
    icon: "HardHat",
  },
  {
    id: "environmental",
    title: "Environmental",
    description: "Mold, radon, air quality, and environmental hazard testing.",
    startingPrice: 295,
    priceHigh: 750,
    icon: "Leaf",
  },
  {
    id: "new-construction",
    title: "New Construction",
    description: "Phase inspections for new builds — pre-pour, pre-drywall, and final.",
    startingPrice: 495,
    priceHigh: 1100,
    icon: "Building2",
  },
];
