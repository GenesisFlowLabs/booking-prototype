import { NextRequest, NextResponse } from "next/server";
import { notificationEmails } from "@/data/vip-agents";
import { verifyInternalRequest } from "@/lib/webhook-auth";
import { sendEmail } from "@/lib/email";

interface NotifyPayload {
  oid: number;
  address: string;
  client: string;
  clientPhone: string;
  clientEmail: string;
  vipAgent: string | null;
  vipSlug: string | null;
  referringAgent: string | null;
  packageTier: string | null;
}

export async function POST(req: NextRequest) {
  // Verify this is an internal request
  if (!verifyInternalRequest(req)) {
    console.warn("[Team Notify] Rejected — invalid or missing internal secret");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: NotifyPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { oid, address, client, clientPhone, clientEmail, vipAgent, vipSlug, referringAgent, packageTier } = payload;

  // Build notification message
  const vipLine = vipAgent ? `Booked via ${vipAgent}'s link (${vipSlug})` : "Booked via direct link";
  const agentLine = referringAgent ? `Referring Agent: ${referringAgent}` : "";
  const pkgLine = packageTier || "No package selected";

  const subject = `New Booking - OID ${oid} - ${address}`;
  const textBody = [
    `New online booking received!`,
    ``,
    `OID: ${oid}`,
    `Address: ${address}`,
    `Client: ${client}`,
    `Phone: ${clientPhone}`,
    `Email: ${clientEmail}`,
    `Package: ${pkgLine}`,
    vipLine,
    agentLine,
    ``,
    `View in ISN: https://goisn.net/greenworks`,
  ].filter(Boolean).join("\n");

  // Log the notification
  console.log(`[Team Notify] ${subject}`);

  // Send email if we have recipients
  if (notificationEmails.length > 0) {
    const result = await sendEmail({
      to: notificationEmails,
      subject,
      text: textBody,
    });

    if (!result.success) {
      console.error(`[Team Notify] Email failed: ${result.error}`);
    }
  }

  return NextResponse.json({
    notified: true,
    recipients: notificationEmails.length,
    oid,
  });
}
