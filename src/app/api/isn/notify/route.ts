import { NextRequest, NextResponse } from "next/server";
import { notificationEmails } from "@/data/vip-agents";

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
  const body = [
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
  console.log(`[Team Notify] Recipients: ${notificationEmails.join(", ")}`);
  console.log(`[Team Notify] Body:\n${body}`);

  // Send email notifications to the team
  // Using a simple fetch to an email API or SMTP relay
  // For now, log + use the ISN webhook to handle downstream
  // TODO: Wire to Twilio SMS or SMTP for real email delivery
  // For now this logs everything so we can verify it works

  // If we have notification emails configured, we could send via:
  // 1. Twilio SendGrid
  // 2. Direct SMTP
  // 3. A GFL internal API
  // Leaving as log-only until we wire up the email provider

  return NextResponse.json({
    notified: true,
    recipients: notificationEmails.length,
    oid,
  });
}
