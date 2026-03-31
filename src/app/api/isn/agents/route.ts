import { NextRequest, NextResponse } from "next/server";
import { isnFetch } from "@/lib/isn";

interface ISNAgent {
  id: string;
  first: string;
  last: string;
  display: string;
  email: string;
  mobile_phone: string;
  work_phone: string;
  agency: string | null;
}

interface ISNAgency {
  id: string;
  display: string;
}

// Cache agencies for 5 minutes (they don't change often)
let agencyCache: Map<string, string> | null = null;
let agencyCacheTime = 0;

async function getAgencyMap(): Promise<Map<string, string>> {
  if (agencyCache && Date.now() - agencyCacheTime < 5 * 60 * 1000) {
    return agencyCache;
  }
  const agencies = await isnFetch<ISNAgency[]>("/agencies");
  agencyCache = new Map(agencies.map((a) => [a.id, a.display]));
  agencyCacheTime = Date.now();
  return agencyCache;
}

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("search");

  if (!search || search.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const [agents, agencyMap] = await Promise.all([
      isnFetch<ISNAgent[]>(`/agents?search=${encodeURIComponent(search)}`),
      getAgencyMap(),
    ]);

    const results = agents.slice(0, 10).map((a) => ({
      id: a.id,
      name: a.display || `${a.first} ${a.last}`.trim(),
      email: a.email || "",
      phone: a.mobile_phone || a.work_phone || "",
      agency: a.agency ? agencyMap.get(a.agency) || "" : "",
    }));

    return NextResponse.json(results);
  } catch (err) {
    console.error("ISN agents search error:", err);
    return NextResponse.json({ error: "Failed to search agents" }, { status: 502 });
  }
}
