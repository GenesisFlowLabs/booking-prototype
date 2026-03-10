import { NextResponse } from "next/server";
import { isnFetch, type ISNService } from "@/lib/isn";

export async function GET() {
  try {
    const services = await isnFetch<ISNService[]>("/services");

    // Filter to bookable services (shown and not label/ancillary)
    const bookable = services.filter(
      (s) => s.show === "Yes" && !s.ancillary && s.inspectors.length > 0
    );

    return NextResponse.json(bookable);
  } catch (err) {
    console.error("ISN services error:", err);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 502 });
  }
}
