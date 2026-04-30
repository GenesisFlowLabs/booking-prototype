import { NextRequest, NextResponse } from "next/server";
import { isnFetch } from "@/lib/isn";

const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET || "";

// Diagnostic endpoint — returns ISN order types so we can validate UUIDs and _id values.
// Protected by internal secret. Hit this once to get production order type data, then
// update ISN_ORDER_TYPE_IDS in src/lib/isn-mappings.ts with the real values.
//
// Usage: GET /api/isn/ordertypes
// Header: x-internal-secret: <INTERNAL_API_SECRET>   (if secret is configured)
export async function GET(req: NextRequest) {
  if (INTERNAL_SECRET && req.headers.get("x-internal-secret") !== INTERNAL_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Try both common ISN path variants
  let result: unknown;
  let usedPath: string;
  try {
    result = await isnFetch<unknown>("/order_types");
    usedPath = "/order_types";
  } catch {
    try {
      result = await isnFetch<unknown>("/ordertypes");
      usedPath = "/ordertypes";
    } catch (err2) {
      const message = err2 instanceof Error ? err2.message : String(err2);
      console.error("[ordertypes diagnostic]", message);
      return NextResponse.json({ ok: false, error: message }, { status: 502 });
    }
  }

  return NextResponse.json({ ok: true, path: usedPath, data: result });
}
