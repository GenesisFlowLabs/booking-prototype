import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "address param required" }, { status: 400 });
  }

  const key = process.env.MELISSA_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Melissa API key not configured" }, { status: 500 });
  }

  try {
    const url = new URL("https://property.melissadata.net/v4/WEB/LookupProperty");
    url.searchParams.set("id", key);
    url.searchParams.set("ff", address);
    url.searchParams.set("format", "json");

    const res = await fetch(url.toString(), { cache: "no-store" });

    if (!res.ok) {
      return NextResponse.json({ error: `Melissa API ${res.status}` }, { status: 502 });
    }

    const data = await res.json();

    // Extract property info from Melissa response
    const records = data?.Records;
    if (!records || records.length === 0) {
      return NextResponse.json({ sqft: null, yearBuilt: null });
    }

    const record = records[0];
    const sqft =
      record?.PropertySquareFootage ||
      record?.BuildingSquareFootage ||
      record?.LivingSquareFootage ||
      null;
    const yearBuilt = record?.YearBuilt || null;
    const bedrooms = record?.Bedrooms || null;
    const bathrooms = record?.Bathrooms || null;

    return NextResponse.json({
      sqft: sqft ? parseInt(sqft, 10) : null,
      yearBuilt: yearBuilt || null,
      bedrooms: bedrooms || null,
      bathrooms: bathrooms || null,
    });
  } catch (err) {
    console.error("Melissa property error:", err);
    return NextResponse.json({ error: "Property lookup failed" }, { status: 502 });
  }
}
