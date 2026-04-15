// Email delivery via Resend
// Add RESEND_API_KEY to .env.local to enable

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = process.env.NOTIFY_FROM_EMAIL || "bookings@greenworksinspections.com";

interface EmailOptions {
  to: string[];
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  if (!RESEND_API_KEY) {
    console.warn("[Email] RESEND_API_KEY not set — logging instead of sending");
    console.log(`[Email] To: ${options.to.join(", ")}`);
    console.log(`[Email] Subject: ${options.subject}`);
    console.log(`[Email] Body:\n${options.text}`);
    return { success: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[Email] Resend API error ${res.status}: ${body}`);
      return { success: false, error: `Resend ${res.status}: ${body.slice(0, 200)}` };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[Email] Send failed: ${message}`);
    return { success: false, error: message };
  }
}
