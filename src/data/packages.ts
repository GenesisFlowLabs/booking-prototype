import { Package, PackageFeature, NCPackageFeature } from "@/types/booking";

// ── Feature Descriptions (from GreenWorks site) ────────────────────

export const featureDescriptions: Record<string, string> = {
  // Home inspection features
  "Licensed Professional Home Inspection":
    "Our experienced and certified inspectors conduct a detailed assessment of the property's condition, covering all major systems and components. This inspection forms the foundation of our comprehensive service.",
  "Infrared Thermal Imaging":
    "Using advanced thermal imaging technology, we identify hidden issues such as moisture intrusion, energy loss, electrical hotspots, and insulation deficiencies, helping your clients make informed decisions.",
  "Sprinkler & Irrigation Inspection":
    "We assess the functionality and condition of sprinkler systems and irrigation setups, ensuring proper water distribution and identifying any potential issues that could lead to water waste or damage.",
  "Foundation Elevation Map":
    "We provide a comprehensive foundation elevation map, helping you understand the slope and elevation of the property's foundation. This information is crucial for evaluating potential drainage issues or foundation stability.",
  "Above & Beyond TREC Standards":
    "In addition to the TREC standards, we go the extra mile to deliver exceptional service, ensuring no stone is left unturned during the inspection process. Our goal is to exceed your expectations.",
  "System & Structural Evaluation":
    "Our inspectors thoroughly evaluate the property's systems, including electrical, plumbing, HVAC, and structural elements. This comprehensive evaluation provides a clear picture of the property's condition.",
  "90-Day Termite Guarantee":
    "To give you added protection, we offer a 90-day termite guarantee. If termites are discovered within 90 days of our inspection, we will provide necessary recommendations and solutions.",
  "Digital Photo Reports":
    "Our detailed inspection reports include high-resolution digital photos, providing visual evidence of any issues or areas of concern identified during the inspection.",
  "Digital Report Summary":
    "For quick reference, we provide a concise summary of the inspection report, highlighting the key findings and recommendations. This helps you understand the overall condition of the property at a glance.",
  "Repair Estimate Report":
    "Our Repair Estimate Report provides estimates for potential repair costs based on the findings of the inspection. This valuable information allows you to assess the financial implications of necessary repairs or improvements.",
  "Online Home Management Platform":
    "We provide an online platform that helps organize and manage home-related documents, maintenance schedules, and warranty information, promoting long-term homeowner success.",
  "Insurance Claims History (C.L.U.E)":
    "We provide an Insurance Claims History Report (C.L.U.E) that offers insights into the property's insurance claims history. This information helps you understand any past issues and make informed decisions.",
  "GreenWorks HomeHub Utility Setup":
    "To simplify the moving process, we offer a HomeHub utility setup service. Our team will assist in setting up essential utilities, saving time and effort during the transition.",
  "Energy Report":
    "We provide a detailed energy report to help you understand the property's energy efficiency and identify opportunities for improvement.",
  "Sewer Line Inspection":
    "We perform a thorough inspection of the property's main sewer line using advanced camera equipment to identify blockages, cracks, root intrusion, or other hidden issues that could lead to costly plumbing repairs.",
  "Pool/Spa OR Septic/Well":
    "Choose either a pool and spa inspection or a septic and well inspection, depending on your property's needs. Both options provide detailed assessments of these specialized systems.",
  "Air Quality Readings":
    "We take air quality readings to assess the indoor environment for potential concerns such as elevated moisture, mold spores, or other airborne contaminants.",
  "3D Floor Plan":
    "We create a detailed 3D floor plan of the property, giving you a comprehensive visual layout of the home's structure and room dimensions.",
  "Square Footage Verification":
    "We verify the property's square footage with precise measurements, ensuring accuracy for real estate transactions and appraisals.",
  "Engineer-Stamped Foundation Report":
    "A licensed professional engineer provides a stamped foundation report, offering an authoritative assessment of the property's structural integrity.",

  // NC-specific features
  "Pre-Drywall Inspection":
    "We assess the condition and installation of key structural and mechanical components, including framing, electrical wiring, plumbing lines, and HVAC ductwork, before drywall installation to ensure proper construction and code compliance.",
  "Final Pre-Closing":
    "We conduct a detailed evaluation of the home shortly before closing to confirm that all major systems are functioning properly and that any agreed-upon repairs or final construction items have been completed.",
  "11-Month Home Warranty Inspection":
    "We inspect the home around the 11th month of occupancy to identify defects or warranty-related issues, such as settling cracks, faulty systems, or finish flaws, so the builder can address them before the warranty expires.",
  "1 Repair Verification Inspection":
    "We revisit specific areas of concern to confirm that repairs made by contractors or the builder have been properly completed, ensuring the work meets industry standards and your expectations.",
  "Blue Tape Inspection":
    "We walk through your newly built home with a critical eye to identify cosmetic issues such as paint imperfections, misaligned fixtures, and trim flaws, marking them with blue tape for the builder to repair before your final move-in.",
};

// ── Existing Home Packages ──────────────────────────────────────────

export const homePackages: Package[] = [
  {
    id: "green",
    name: "Green Package",
    tagline: "Essential coverage",
    price: 545,
    priceNote: "starting at",
    serviceType: "home",
    isnOrderTypeId: "ba4905c0-6b47-11ed-9e48-0a4ef934752f",
    features: [
      "Licensed Professional Home Inspection",
      "Infrared Thermal Imaging",
      "Sprinkler & Irrigation Inspection",
      "Foundation Elevation Map",
      "Above & Beyond TREC Standards",
      "System & Structural Evaluation",
      "90-Day Termite Guarantee",
      "Digital Photo Reports",
      "Digital Report Summary",
      "Repair Estimate Report",
      "Online Home Management Platform",
      "Insurance Claims History (C.L.U.E)",
      "GreenWorks HomeHub Utility Setup",
      "Energy Report",
    ],
  },
  {
    id: "greener",
    name: "Greener Package",
    tagline: "Complete peace of mind",
    price: 895,
    priceNote: "starting at",
    popular: true,
    serviceType: "home",
    isnOrderTypeId: "ba4905c0-6b47-11ed-9e48-0a4ef934752f",
    features: [
      "Everything in Green, plus:",
      "Sewer Line Inspection",
      "Pool/Spa OR Septic/Well",
      "Air Quality Readings",
    ],
  },
  {
    id: "greenest",
    name: "Greenest Package",
    tagline: "The full picture",
    price: 1295,
    priceNote: "starting at",
    serviceType: "home",
    isnOrderTypeId: "ba4905c0-6b47-11ed-9e48-0a4ef934752f",
    features: [
      "Everything in Greener, plus:",
      "3D Floor Plan",
      "Square Footage Verification",
      "Engineer-Stamped Foundation Report",
    ],
  },
];

// ── New Construction Packages ───────────────────────────────────────

export const ncPackages: Package[] = [
  {
    id: "nc1",
    name: "New Construction Package 1",
    tagline: "Essential new build coverage",
    price: 725,
    priceNote: "any size home",
    serviceType: "new-construction",
    isnOrderTypeId: "38702513-e5e3-4d23-a997-e6eb1490edcd",
    features: [
      "Final Pre-Closing",
      "Infrared Thermal Imaging",
      "Sprinkler & Irrigation Inspection",
      "Foundation Elevation Map",
      "Above & Beyond TREC Standards",
      "Digital Photo Reports",
      "Digital Report Summary",
      "GreenWorks HomeHub Utility Setup",
      "11-Month Home Warranty Inspection",
      "Online Home Management Platform",
    ],
  },
  {
    id: "nc2",
    name: "New Construction Package 2",
    tagline: "Full phase coverage",
    price: 1050,
    priceNote: "any size home",
    popular: true,
    serviceType: "new-construction",
    isnOrderTypeId: "cd5197d0-a2cd-4077-bd65-9066f4426d20",
    features: [
      "Everything in Core Check, plus:",
      "Pre-Drywall Inspection",
      "Sewer Line Inspection",
    ],
  },
  {
    id: "nc3",
    name: "New Construction Package 3",
    tagline: "Every phase, every detail",
    price: 1695,
    priceNote: "any size home",
    serviceType: "new-construction",
    isnOrderTypeId: "04d2cee9-bd44-4c55-abd8-f61389e65e39",
    features: [
      "Everything in Build Phase, plus:",
      "1 Repair Verification Inspection",
      "Blue Tape Inspection",
    ],
  },
];

// Backwards compat
export const packages = homePackages;

// ── Feature Comparison Tables ───────────────────────────────────────

export const featureComparison: PackageFeature[] = [
  { name: "Licensed Professional Home Inspection", green: true, greener: true, greenest: true },
  { name: "Infrared Thermal Imaging", green: true, greener: true, greenest: true },
  { name: "Sprinkler & Irrigation Inspection", green: true, greener: true, greenest: true },
  { name: "Foundation Elevation Map", green: true, greener: true, greenest: true },
  { name: "Above & Beyond TREC Standards", green: true, greener: true, greenest: true },
  { name: "System & Structural Evaluation", green: true, greener: true, greenest: true },
  { name: "90-Day Termite Guarantee", green: true, greener: true, greenest: true },
  { name: "Digital Photo Reports", green: true, greener: true, greenest: true },
  { name: "Digital Report Summary", green: true, greener: true, greenest: true },
  { name: "Repair Estimate Report", green: true, greener: true, greenest: true },
  { name: "Online Home Management Platform", green: true, greener: true, greenest: true },
  { name: "Insurance Claims History (C.L.U.E)", green: true, greener: true, greenest: true },
  { name: "GreenWorks HomeHub Utility Setup", green: true, greener: true, greenest: true },
  { name: "Energy Report", green: true, greener: true, greenest: true },
  { name: "Sewer Line Inspection", green: false, greener: true, greenest: true },
  { name: "Pool/Spa OR Septic/Well", green: false, greener: true, greenest: true },
  { name: "Air Quality Readings", green: false, greener: true, greenest: true },
  { name: "3D Floor Plan", green: false, greener: false, greenest: true },
  { name: "Square Footage Verification", green: false, greener: false, greenest: true },
  { name: "Engineer-Stamped Foundation Report", green: false, greener: false, greenest: true },
];

export const ncFeatureComparison: NCPackageFeature[] = [
  { name: "Pre-Drywall Inspection", nc1: false, nc2: true, nc3: true },
  { name: "Final Pre-Closing", nc1: true, nc2: true, nc3: true },
  { name: "Sewer Line Inspection", nc1: false, nc2: true, nc3: true },
  { name: "Infrared Thermal Imaging", nc1: true, nc2: true, nc3: true },
  { name: "Sprinkler & Irrigation Inspection", nc1: true, nc2: true, nc3: true },
  { name: "Foundation Elevation Map", nc1: true, nc2: true, nc3: true },
  { name: "Above & Beyond TREC Standards", nc1: true, nc2: true, nc3: true },
  { name: "Digital Photo Reports", nc1: true, nc2: true, nc3: true },
  { name: "Digital Report Summary", nc1: true, nc2: true, nc3: true },
  { name: "GreenWorks HomeHub Utility Setup", nc1: true, nc2: true, nc3: true },
  { name: "11-Month Home Warranty Inspection", nc1: true, nc2: true, nc3: true },
  { name: "Online Home Management Platform", nc1: true, nc2: true, nc3: true },
  { name: "1 Repair Verification Inspection", nc1: false, nc2: false, nc3: true },
  { name: "Blue Tape Inspection", nc1: false, nc2: false, nc3: true },
];
