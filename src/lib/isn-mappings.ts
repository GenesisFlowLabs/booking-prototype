// Maps our curated package tiers to ISN order type IDs.
// UUIDs verified against GreenWorks production ISN tenant (greenworksserviceco)
// via GET /ordertypes on 2026-04-30.

import type { PackageTier, ServiceType } from "@/types/booking";

export const ISN_ORDER_TYPE_IDS: Record<string, string> = {
  // Home inspection packages (ISN "5 - Package" series)
  "home-green":    "8c23e18e-35bd-458b-a6b0-d0bbb2f7ca6c", // 5 - Green Package
  "home-greener":  "0a43331b-421a-4db8-9e31-299d30f492cd", // 5 - Greener Package
  "home-greenest": "6946b600-13e0-4b51-81bd-0d1e9a204e5b", // 5 - Greenest Package - Engineer Stamped Foundation Report
  "home":          "94f2dda9-7eb1-43d1-aee9-c5a4b015e2d0", // 1 - Residential Home Inspection (fallback)

  // New construction packages (ISN "5 - NEW Construction Package" series)
  // Order lands in ISN; GreenWorks team manually creates remaining phase orders.
  "new-construction-nc1": "dca7b45f-f6c8-4319-8e09-ab97e7b7035b", // 5 - NEW Construction Package 1 Final Inspection
  "new-construction-nc2": "9fdd5aa5-7249-432c-a910-c35334309fa2", // 5 - NEW Construction Package 2 Pre-Drywall Inspection
  "new-construction-nc3": "e316088b-a198-4416-b1d9-15a0e3519efd", // 5 - NEW Construction Package 3 Pre-Dry-Wall Inspection
  "new-construction":     "dca7b45f-f6c8-4319-8e09-ab97e7b7035b", // fallback → NC1 Final

  // Other services
  "engineering":   "5dfbe074-2490-4b40-8faf-0efc46fc4a95", // 3 - Foundation Investigation Report Only
  "environmental": "28ffbeb5-354b-4629-a468-d74e9e43f86d", // 4 - Mold Inspection & Testing
  "commercial":    "522a23b3-22dc-492e-8e94-0666818ccb6c", // 2 - Commercial Inspection
};

export const ISN_PACKAGE_NAMES: Record<PackageTier, string> = {
  "green":    "5 - Green Package",
  "greener":  "5 - Greener Package",
  "greenest": "5 - Greenest Package - Engineer Stamped Foundation Report",
  "nc1":      "5 - NEW Construction Package 1",
  "nc2":      "5 - NEW Construction Package 2",
  "nc3":      "5 - NEW Construction Package 3",
};

export function getISNOrderTypeId(
  serviceType: ServiceType,
  packageTier: PackageTier | null
): string {
  if (serviceType === "home" && packageTier) {
    const key = `home-${packageTier}`;
    if (key in ISN_ORDER_TYPE_IDS) return ISN_ORDER_TYPE_IDS[key];
  }
  if (serviceType === "new-construction" && packageTier) {
    const key = `new-construction-${packageTier}`;
    return ISN_ORDER_TYPE_IDS[key] || ISN_ORDER_TYPE_IDS["new-construction"];
  }
  return ISN_ORDER_TYPE_IDS[serviceType] || ISN_ORDER_TYPE_IDS["home"];
}

export function buildOrderNotes(
  packageTier: PackageTier | null,
  sqft: string,
  contactRole: string | null,
  foundation?: string,
  preferredAppointment?: string
): string {
  const parts: string[] = [];
  parts.push("Booked via GreenWorks Online Scheduler");
  if (preferredAppointment) {
    parts.push(`Preferred: ${preferredAppointment}`);
  }
  if (packageTier) {
    parts.push(`Package: ${ISN_PACKAGE_NAMES[packageTier] || packageTier}`);
  }
  if (sqft) {
    parts.push(`Approx. Sq Ft: ${parseInt(sqft).toLocaleString()}`);
  }
  if (foundation && foundation !== "unknown") {
    const labels: Record<string, string> = {
      "slab": "Slab",
      "pier-beam": "Pier & Beam",
    };
    parts.push(`Foundation: ${labels[foundation] || foundation}`);
  }
  if (contactRole) {
    const labels: Record<string, string> = {
      buyer: "Home Buyer",
      owner: "Home Owner",
      agent: "Buyer's Agent",
    };
    parts.push(`Contact Role: ${labels[contactRole] || contactRole}`);
  }
  return parts.join(" | ");
}
