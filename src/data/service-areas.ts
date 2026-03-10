import { ServiceArea } from "@/types/booking";

export const serviceAreas: ServiceArea[] = [
  {
    state: "Texas",
    stateCode: "TX",
    metros: [
      { name: "Dallas-Fort Worth", zipRanges: [[75001, 76311]] },
      { name: "Houston", zipRanges: [[77001, 77599]] },
      { name: "Austin", zipRanges: [[73301, 73399], [78601, 78799]] },
      { name: "San Antonio", zipRanges: [[78001, 78299]] },
    ],
  },
  {
    state: "Colorado",
    stateCode: "CO",
    metros: [
      { name: "Denver Metro", zipRanges: [[80001, 80299]] },
      { name: "Colorado Springs", zipRanges: [[80801, 80951]] },
    ],
  },
  {
    state: "Florida",
    stateCode: "FL",
    metros: [
      { name: "Orlando", zipRanges: [[32789, 32899], [34734, 34787]] },
      { name: "Tampa", zipRanges: [[33601, 33699]] },
      { name: "Jacksonville", zipRanges: [[32099, 32299]] },
    ],
  },
  {
    state: "Georgia",
    stateCode: "GA",
    metros: [
      { name: "Atlanta Metro", zipRanges: [[30001, 30399]] },
    ],
  },
  {
    state: "Ohio",
    stateCode: "OH",
    metros: [
      { name: "Columbus", zipRanges: [[43001, 43299]] },
      { name: "Cincinnati", zipRanges: [[45201, 45299]] },
      { name: "Cleveland", zipRanges: [[44101, 44199]] },
    ],
  },
  {
    state: "Oklahoma",
    stateCode: "OK",
    metros: [
      { name: "Oklahoma City", zipRanges: [[73001, 73199]] },
      { name: "Tulsa", zipRanges: [[74001, 74199]] },
    ],
  },
];

// Map metro names to ISN inspector market tags found in inspector names
export const metroToISNTag: Record<string, string[]> = {
  "Dallas-Fort Worth": ["DFW"],
  "Houston": ["HOU"],
  "Austin": ["ATX", "SA/ATX"],
  "San Antonio": ["SA", "SA/ATX"],
  "Denver Metro": ["COL"],
  "Colorado Springs": ["COL"],
  "Orlando": ["FLA"],
  "Tampa": ["FLA"],
  "Jacksonville": ["FLA"],
  "Atlanta Metro": ["ATL"],
  "Columbus": ["OH"],
  "Cincinnati": ["OH"],
  "Cleveland": ["OH"],
  "Oklahoma City": ["OKC"],
  "Tulsa": ["OKC"],
};

export function getISNMarketTags(zip: string): string[] | null {
  const result = validateZip(zip);
  if (!result.valid || !result.metro) return null;
  return metroToISNTag[result.metro] || null;
}

export function validateZip(zip: string): { valid: boolean; metro?: string; state?: string } {
  const zipNum = parseInt(zip, 10);
  if (isNaN(zipNum) || zip.length !== 5) {
    return { valid: false };
  }

  for (const area of serviceAreas) {
    for (const metro of area.metros) {
      for (const [min, max] of metro.zipRanges) {
        if (zipNum >= min && zipNum <= max) {
          return { valid: true, metro: metro.name, state: area.state };
        }
      }
    }
  }

  return { valid: false };
}
