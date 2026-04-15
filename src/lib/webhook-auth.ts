// Webhook authentication helpers

const WEBHOOK_SECRET = process.env.ISN_WEBHOOK_SECRET || "";
const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET || "";

/**
 * Verify ISN webhook requests using a shared secret header.
 * ISN sends the secret in X-Webhook-Secret header when registered.
 */
export function verifyISNWebhook(request: Request): boolean {
  if (!WEBHOOK_SECRET) {
    // No secret configured — allow in dev, log warning
    console.warn("[Webhook Auth] ISN_WEBHOOK_SECRET not set — skipping verification");
    return true;
  }
  const header = request.headers.get("x-webhook-secret");
  return header === WEBHOOK_SECRET;
}

/**
 * Verify internal API calls (e.g. /api/isn/notify) using a shared secret.
 * Only accepts requests from our own server or with the correct secret.
 */
export function verifyInternalRequest(request: Request): boolean {
  if (!INTERNAL_SECRET) {
    // No secret configured — allow in dev, log warning
    console.warn("[Internal Auth] INTERNAL_API_SECRET not set — skipping verification");
    return true;
  }
  const header = request.headers.get("x-internal-secret");
  return header === INTERNAL_SECRET;
}
