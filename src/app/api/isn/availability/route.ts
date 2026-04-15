import { NextRequest, NextResponse } from "next/server";
import { isnFetch, type ISNSlot } from "@/lib/isn";
import { cacheGet, cacheSet } from "@/lib/cache";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json(
      { error: "start and end date params required (YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  const cacheKey = `availability:${start}:${end}`;

  // Check cache first
  const cached = cacheGet<{ slots: ISNSlot[]; byDate: Record<string, ISNSlot[]> }>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const slots = await isnFetch<ISNSlot[]>("/availability", { start, end });

    // ISN may return an error object instead of array
    if (!Array.isArray(slots)) {
      const msg = (slots as Record<string, string>).message || "Unexpected response";
      return NextResponse.json({ error: msg }, { status: 422 });
    }

    // Group slots by date for easier calendar rendering
    const byDate: Record<string, ISNSlot[]> = {};
    for (const slot of slots) {
      const date = slot.start.split(" ")[0];
      if (!byDate[date]) byDate[date] = [];
      byDate[date].push(slot);
    }

    const result = { slots, byDate };

    // Cache the result
    cacheSet(cacheKey, result, CACHE_TTL_MS);

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("ISN availability error:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
