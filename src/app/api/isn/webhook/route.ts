import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // ISN webhook payload uses "action" field with SCREAMING_SNAKE values:
  //   ORDER_CREATED, ORDER_UPDATED, ORDER_COMPLETED, ORDER_SCHEDULED
  // Also includes: order_id, oid, client_first, client_last, client_email,
  //   client_mobile, address, inspector, fees, datetime, etc.
  const action = payload.action as string | undefined;
  const orderId = payload.order_id as string | undefined;
  const oid = payload.oid as number | undefined;
  const clientName = `${payload.client_first || ""} ${payload.client_last || ""}`.trim();
  const address = payload.address as string | undefined;

  console.log(`[ISN Webhook] action=${action} oid=${oid} client=${clientName} address=${address}`);

  switch (action) {
    case "ORDER_CREATED":
      console.log(`[ISN Webhook] Order ${oid} created - ${clientName} at ${address}`);
      // Future: trigger SMS confirmation via Twilio/AirCall
      break;

    case "ORDER_SCHEDULED":
      console.log(`[ISN Webhook] Order ${oid} scheduled`);
      break;

    case "ORDER_UPDATED":
      console.log(`[ISN Webhook] Order ${oid} updated`);
      break;

    case "ORDER_COMPLETED":
      console.log(`[ISN Webhook] Order ${oid} completed`);
      break;

    case "ORDER_CANCELED":
      console.log(`[ISN Webhook] Order ${oid} canceled`);
      break;

    default:
      console.log(`[ISN Webhook] Unhandled action: ${action}`);
      console.log(`[ISN Webhook] Full payload: ${JSON.stringify(payload)}`);
  }

  // Always return 200 so ISN doesn't retry
  return NextResponse.json({ received: true });
}

// ISN may send a GET to verify the endpoint exists
export async function GET() {
  return NextResponse.json({ status: "ok", service: "greenworks-isn-webhook" });
}
