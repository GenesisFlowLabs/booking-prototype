import { TrustBadge } from "@/types/booking";

export const trustBadges: TrustBadge[] = [
  { id: "google", name: "Google Reviews", value: "4.9 ★ (7,183 reviews)" },
  { id: "bbb", name: "BBB", value: "A+ Rating" },
  { id: "inc5000", name: "Inc. 5000", value: "Fastest Growing" },
  { id: "internachi", name: "InterNACHI", value: "Certified" },
  { id: "ashi", name: "ASHI", value: "Member" },
];

export const stats = [
  { label: "Inspections / Month", value: 2400, suffix: "+" },
  { label: "Google Reviews", value: 7183, suffix: "+" },
  { label: "Average Rating", value: 4.9, suffix: " ★", decimals: 1 },
  { label: "Certified Inspectors", value: 100, suffix: "+" },
  { label: "Years in Business", value: 16, suffix: "+" },
  { label: "States Served", value: 6, suffix: "" },
];
