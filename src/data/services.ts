import { ServiceOption } from "@/types/booking";

export const services: ServiceOption[] = [
  {
    id: "home",
    title: "Home Inspection",
    description: "Complete evaluation of your home's condition — structure, systems, safety.",
    startingPrice: 545,
    icon: "Home",
  },
  {
    id: "engineering",
    title: "Engineering",
    description: "Structural and foundation assessments by licensed professional engineers.",
    startingPrice: 595,
    icon: "HardHat",
  },
  {
    id: "environmental",
    title: "Environmental",
    description: "Mold, radon, air quality, and environmental hazard testing.",
    startingPrice: 295,
    icon: "Leaf",
  },
  {
    id: "new-construction",
    title: "New Construction",
    description: "Phase inspections for new builds — pre-pour, pre-drywall, and final.",
    startingPrice: 495,
    icon: "Building2",
  },
];
