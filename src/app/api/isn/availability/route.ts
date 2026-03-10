import { NextRequest, NextResponse } from "next/server";
import { isnFetch, type ISNSlot } from "@/lib/isn";

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

    return NextResponse.json({ slots, byDate });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("ISN availability error:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
