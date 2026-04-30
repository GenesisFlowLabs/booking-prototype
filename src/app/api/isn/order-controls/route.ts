import { NextRequest, NextResponse } from "next/server";
import { isnFetch } from "@/lib/isn";

const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET || "";

// Diagnostic: fetch a single order with all controls expanded.
// Use this to discover control UUIDs for the GreenWorks ISN tenant
// (e.g. the "Inspection Order Notes" text-control ID needed for controls-v2).
//
// Usage: GET /api/isn/order-controls?oid=<order-oid>
// Header: x-internal-secret: <INTERNAL_API_SECRET>
export async function GET(req: NextRequest) {
  if (INTERNAL_SECRET && req.headers.get("x-internal-secret") !== INTERNAL_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const oid = req.nextUrl.searchParams.get("oid");
  if (!oid) {
    return NextResponse.json({ error: "oid param required" }, { status: 400 });
  }

  try {
    const result = await isnFetch<unknown>(`/order/${oid}`, { withallcontrols: "true" });
    return NextResponse.json({ ok: true, data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
