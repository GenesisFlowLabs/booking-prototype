import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // ISN sends: { order_id, oid, type?, event?, ... }
  // The event type field varies - check multiple possible keys
  const orderId = payload.order_id as string | undefined;
  const oid = payload.oid as number | undefined;
  const event = (payload.event || payload.type || payload.action || "unknown") as string;

  // Log full payload on first few calls so we can see ISN's exact format
  console.log(`[ISN Webhook] event=${event} order_id=${orderId} oid=${oid}`);
  console.log(`[ISN Webhook] Full payload: ${JSON.stringify(payload)}`);

  switch (event) {
    case "Order Created":
    case "OrderCreated":
    case "order.created":
      console.log(`[ISN Webhook] Order ${oid} created`);
      // Future: trigger SMS confirmation via Twilio/AirCall
      break;

    case "Order Scheduled":
    case "OrderScheduled":
    case "order.scheduled":
      console.log(`[ISN Webhook] Order ${oid} scheduled`);
      break;

    case "Order Updated":
    case "OrderUpdated":
    case "order.updated":
      console.log(`[ISN Webhook] Order ${oid} updated`);
      break;

    case "Order Completed":
    case "OrderCompleted":
    case "order.completed":
      console.log(`[ISN Webhook] Order ${oid} completed`);
      break;

    case "Order Canceled":
    case "OrderCanceled":
    case "order.canceled":
      console.log(`[ISN Webhook] Order ${oid} canceled`);
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
