import { NextRequest, NextResponse } from "next/server";

// ISN webhook payload structure (based on ISN webhook documentation)
interface ISNWebhookPayload {
  event: string;
  order_id?: string;
  oid?: number;
  data?: Record<string, unknown>;
}

export async function POST(req: NextRequest) {
  let payload: ISNWebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event, order_id, oid } = payload;

  // Log all webhook events for debugging
  console.log(`[ISN Webhook] event=${event} order_id=${order_id} oid=${oid}`);

  switch (event) {
    case "order.created":
    case "order.scheduled":
      // Order was created or scheduled - this confirms our submission landed
      console.log(`[ISN Webhook] Order ${oid} confirmed: ${event}`);
      // Future: trigger SMS confirmation via Twilio/AirCall
      break;

    case "order.canceled":
      console.log(`[ISN Webhook] Order ${oid} canceled`);
      break;

    case "order.completed":
      console.log(`[ISN Webhook] Order ${oid} completed`);
      break;

    default:
      console.log(`[ISN Webhook] Unhandled event: ${event}`);
  }

  // Always return 200 so ISN doesn't retry
  return NextResponse.json({ received: true });
}

// ISN may send a GET to verify the endpoint exists
export async function GET() {
  return NextResponse.json({ status: "ok", service: "greenworks-isn-webhook" });
}
