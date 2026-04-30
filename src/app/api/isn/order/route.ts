import { NextRequest, NextResponse } from "next/server";
import { isnPost } from "@/lib/isn";
import { buildOrderNotes, getISNOrderTypeId } from "@/lib/isn-mappings";
import { homePackages, ncPackages } from "@/data/packages";
import type {
  ISNCreateOrderResponse,
  ServiceType,
  PackageTier,
  ContactRole,
} from "@/types/booking";

// GreenWorks default inspector — order lands assigned here; team reassigns
// to the actual on-call inspector after manual review in ISN.
const DEFAULT_INSPECTOR_UUID = "da617ac2-5530-4d17-8744-e65fc480ff0c";

const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET || "";

interface OrderRequestBody {
  serviceType: ServiceType;
  packageTier: PackageTier | null;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  contact: {
    role: ContactRole | null;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  property: {
    sqft: string;
    foundation: string;
  };
  selectedSlot: {
    date: string;
    preferredTime: "09:30" | "14:30";
  } | null;
  schedulerId: string | null;
  vipAgent: {
    slug: string;
    name: string;
    phone: string;
    isnUserId: string;
  } | null;
  referringAgent: {
    id: string | null;
    name: string;
    email: string;
    phone: string;
    agency: string;
    isNew: boolean;
  } | null;
}

export async function POST(req: NextRequest) {
  let body: OrderRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { serviceType, packageTier, address, contact, property, selectedSlot, schedulerId, vipAgent, referringAgent } = body;

  // Validate required fields
  if (!address.street || !address.city || !address.state || !address.zip) {
    return NextResponse.json({ error: "Address fields required" }, { status: 400 });
  }
  if (!contact.firstName || !contact.lastName) {
    return NextResponse.json({ error: "Contact name required" }, { status: 400 });
  }
  if (!selectedSlot || !selectedSlot.date || !selectedSlot.preferredTime) {
    return NextResponse.json({ error: "Preferred date and time required" }, { status: 400 });
  }

  // Build ISN order payload
  const clientName = `${contact.firstName} ${contact.lastName}`;

  // Format preferred appointment for ISN notes and the payload datetime field
  const timeLabel = selectedSlot.preferredTime === "09:30" ? "9:30 AM CT" : "2:30 PM CT";
  const dateLabel = new Date(selectedSlot.date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
  const preferredAppointment = `${dateLabel} at ${timeLabel} (pending confirmation)`;
  const timeOfDay = selectedSlot.preferredTime === "09:30" ? "09:30:00" : "14:30:00";
  const datetime = `${selectedSlot.date} ${timeOfDay}`;

  // Look up package starting price for the fee field
  const pkg = packageTier ? [...homePackages, ...ncPackages].find((p) => p.id === packageTier) : null;

  const notes = buildOrderNotes(packageTier, property.sqft, contact.role, property.foundation, preferredAppointment);
  let notesWithRef = notes;
  if (vipAgent) {
    notesWithRef = `${notesWithRef} | VIP Link: ${vipAgent.name} (${vipAgent.slug})`;
  }
  if (referringAgent) {
    const agentLabel = referringAgent.isNew ? `NEW AGENT: ${referringAgent.name}` : `Agent: ${referringAgent.name}`;
    const agencyLabel = referringAgent.agency ? ` (${referringAgent.agency})` : "";
    notesWithRef = `${notesWithRef} | ${agentLabel}${agencyLabel}`;
  } else if (schedulerId && !vipAgent) {
    notesWithRef = `${notesWithRef} | Referred by link: ${schedulerId}`;
  }

  // Resolve ISN order type UUID for this service/package combination
  const orderTypeId = getISNOrderTypeId(serviceType, packageTier);

  const isnPayload: Record<string, unknown> = {
    datetime,
    address: address.street,
    city: address.city,
    state: address.state,
    postal: address.zip,
    client: {
      name: clientName,
      email: contact.email || undefined,
      mobile: contact.phone || undefined,
    },
    inspectorId: DEFAULT_INSPECTOR_UUID,
    orderType: orderTypeId,
    notes: notesWithRef,
    fee: pkg?.price,
    area: property.sqft || undefined,
  };

  // Set agent field from referral or if contact is a buyer's agent
  if (referringAgent && referringAgent.id) {
    // Known ISN agent — pass their ID
    isnPayload.agentId = referringAgent.id;
  } else if (referringAgent && referringAgent.name) {
    // New agent — pass name/contact info
    isnPayload.agent = {
      name: referringAgent.name,
      email: referringAgent.email || undefined,
      mobile: referringAgent.phone || undefined,
    };
  } else if (contact.role === "agent") {
    // Contact IS the agent
    isnPayload.agent = {
      name: clientName,
      email: contact.email || undefined,
      mobile: contact.phone || undefined,
    };
  }

  console.log("[ISN Order] Submitting payload:", JSON.stringify({
    ...isnPayload,
    client: { ...((isnPayload.client as Record<string, unknown>) || {}), email: isnPayload.client ? "[redacted]" : undefined },
  }));

  try {
    const result = await isnPost<ISNCreateOrderResponse>("/order", isnPayload);

    console.log("[ISN Order] Response:", JSON.stringify(result));

    if (result.status === "error") {
      console.error("ISN order creation failed:", result);
      return NextResponse.json(
        { error: (result as unknown as { message: string }).message || "ISN rejected the order" },
        { status: 422 }
      );
    }

    // Fire-and-forget: notify team via webhook endpoint
    const notifyPayload = {
      oid: result.oid,
      address: `${address.street}, ${address.city}, ${address.state} ${address.zip}`,
      client: clientName,
      clientPhone: contact.phone,
      clientEmail: contact.email,
      vipAgent: vipAgent ? vipAgent.name : null,
      vipSlug: vipAgent ? vipAgent.slug : schedulerId,
      referringAgent: referringAgent ? referringAgent.name : null,
      packageTier,
    };
    fetch(`${req.nextUrl.origin}/api/isn/notify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(INTERNAL_SECRET ? { "x-internal-secret": INTERNAL_SECRET } : {}),
      },
      body: JSON.stringify(notifyPayload),
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
      oid: result.oid,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("ISN order submission error:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
