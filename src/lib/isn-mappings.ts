// Maps our curated package tiers to ISN order type IDs.
// ISN order_types use integer _id values for the orderType field in POST /order.
// These IDs come from GET /order_types on the greenworks ISN account.
//
// Our 5 service categories map to ISN order types:
//   home -> "1 - Residential Home Inspection" (_id from order_types)
//   new-construction -> varies by package (Phase 1/2/3, Final, etc.)
//   engineering -> "Foundation Investigation Report Only" etc.
//   environmental -> "Mold Inspection & Testing" etc.
//   commercial -> "Commercial Inspection"
//
// For packages (Green/Greener/Greenest, NC1/NC2/NC3), ISN has matching
// package definitions that bundle services. We pass the primary order type
// and let ISN's package system handle the service bundle.

import type { PackageTier, ServiceType } from "@/types/booking";

// ISN order type UUIDs — used for the availability endpoint (which needs UUID)
// Mapped from GET /json/order_types response
export const ISN_ORDER_TYPE_IDS: Record<string, string> = {
  "home": "ba4905c0-6b47-11ed-9e48-0a4ef934752f",
  "new-construction-nc1": "38702513-e5e3-4d23-a997-e6eb1490edcd",
  "new-construction-nc2": "cd5197d0-a2cd-4077-bd65-9066f4426d20",
  "new-construction-nc3": "04d2cee9-bd44-4c55-abd8-f61389e65e39",
  "engineering": "2207b97a-2787-4ac9-9288-3e0b8668b31e",
  "environmental": "2f686d69-ba65-4c19-8803-f85e28b380ce",
  "commercial": "e0038a18-7e28-4ed1-9461-bb3e6c42089c",
};

// ISN package names — these map to GET /json/packages response
// Used when we need to reference the ISN package by name for order notes
export const ISN_PACKAGE_NAMES: Record<PackageTier, string> = {
  "green": "5 - Green Package",
  "greener": "5 - Greener Package",
  "greenest": "5 - Greenest Package - Foundation Investigation",
  "nc1": "New Construction Package 1",
  "nc2": "New Construction Package 2",
  "nc3": "New Construction Package 3",
};

// Get the primary ISN order type UUID for a given service + package combination
export function getISNOrderTypeId(
  serviceType: ServiceType,
  packageTier: PackageTier | null
): string {
  if (serviceType === "new-construction" && packageTier) {
    const key = `new-construction-${packageTier}`;
    return ISN_ORDER_TYPE_IDS[key] || ISN_ORDER_TYPE_IDS["new-construction-nc1"];
  }
  return ISN_ORDER_TYPE_IDS[serviceType] || ISN_ORDER_TYPE_IDS["home"];
}

// Build the notes string that goes into the ISN order
export function buildOrderNotes(
  packageTier: PackageTier | null,
  sqft: string,
  contactRole: string | null,
  foundation?: string
): string {
  const parts: string[] = [];
  parts.push("Booked via GreenWorks Online Scheduler");
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
