// VIP Agent links for Jordan's growth team
// Each VIP gets a unique booking URL: greenworks.genesisflowlabs.com/?vip=<slug>
// When a customer books through that link, the order is attributed to that VIP.
//
// Jordan to provide: AirCall/Haymarket phone numbers for each VIP
// These are the numbers customers will see on the success screen.

export interface VIPAgent {
  slug: string;           // URL slug: ?vip=gaby
  name: string;           // Display name
  isnUserId: string;      // ISN user UUID for order attribution
  email: string;          // For team notifications
  phone: string;          // AirCall/Haymarket number (customer-facing)
  photoUrl?: string;      // Optional headshot
}

// --- JORDAN: Fill in the phone numbers (AirCall/Haymarket) ---
export const vipAgents: VIPAgent[] = [
  {
    slug: "gaby",
    name: "Gaby Vasquez",
    isnUserId: "0072daa1-efff-4a6a-8dd5-ba22ac009c6b",
    email: "cindy.vasquez@greenworksinspections.com",
    phone: "",  // TODO: Jordan to provide AirCall/Haymarket number
  },
  {
    slug: "jordan",
    name: "Jordan Vanover",
    isnUserId: "da617ac2-5530-4d17-8744-e65fc480ff0c",
    email: "jordan.vanover@GreenWorksInspections.com",
    phone: "(405) 662-9777",
  },
  // TODO: Jordan to provide the rest of his active team members
  // {
  //   slug: "jake",
  //   name: "Jake ???",
  //   isnUserId: "???",
  //   email: "???@greenworksinspections.com",
  //   phone: "",  // AirCall/Haymarket number
  // },
];

// Team-wide notification list
// Everyone on this list gets notified when ANY VIP link booking comes in
export const notificationEmails: string[] = [
  "jordan.vanover@GreenWorksInspections.com",
  // TODO: Add team members who should receive booking notifications
];

export function getVIPBySlug(slug: string): VIPAgent | undefined {
  return vipAgents.find((v) => v.slug === slug);
}
