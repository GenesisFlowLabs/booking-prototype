import { NextResponse } from "next/server";
import { isnFetch, type ISNPackage, type ISNService } from "@/lib/isn";

export async function GET() {
  try {
    const [packages, services] = await Promise.all([
      isnFetch<ISNPackage[]>("/packages"),
      isnFetch<ISNService[]>("/services"),
    ]);

    // Build a service lookup by ID
    const serviceMap = new Map(services.map((s) => [s.id, s]));

    // Enrich packages with resolved service names
    const enriched = packages
      .filter((p) => p.show)
      .map((pkg) => ({
        ...pkg,
        resolvedServices: pkg.services
          .map((sid) => {
            const svc = serviceMap.get(sid);
            return svc ? { id: svc.id, name: svc.name, fee: svc.fees?.[0]?.amount } : null;
          })
          .filter(Boolean),
      }));

    return NextResponse.json(enriched);
  } catch (err) {
    console.error("ISN packages error:", err);
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 502 });
  }
}
