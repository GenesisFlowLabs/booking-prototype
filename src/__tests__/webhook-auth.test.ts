import { describe, it, expect, vi, beforeEach } from "vitest";

describe("verifyISNWebhook", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("allows requests when no secret is configured", async () => {
    vi.stubEnv("ISN_WEBHOOK_SECRET", "");
    const { verifyISNWebhook } = await import("@/lib/webhook-auth");
    const req = new Request("http://localhost/api/isn/webhook", { method: "POST" });
    expect(verifyISNWebhook(req)).toBe(true);
  });

  it("rejects requests with wrong secret", async () => {
    vi.stubEnv("ISN_WEBHOOK_SECRET", "correct-secret");
    const { verifyISNWebhook } = await import("@/lib/webhook-auth");
    const req = new Request("http://localhost/api/isn/webhook", {
      method: "POST",
      headers: { "x-webhook-secret": "wrong-secret" },
    });
    expect(verifyISNWebhook(req)).toBe(false);
  });

  it("accepts requests with correct secret", async () => {
    vi.stubEnv("ISN_WEBHOOK_SECRET", "correct-secret");
    const { verifyISNWebhook } = await import("@/lib/webhook-auth");
    const req = new Request("http://localhost/api/isn/webhook", {
      method: "POST",
      headers: { "x-webhook-secret": "correct-secret" },
    });
    expect(verifyISNWebhook(req)).toBe(true);
  });

  it("rejects requests with missing secret header when secret is configured", async () => {
    vi.stubEnv("ISN_WEBHOOK_SECRET", "correct-secret");
    const { verifyISNWebhook } = await import("@/lib/webhook-auth");
    const req = new Request("http://localhost/api/isn/webhook", { method: "POST" });
    expect(verifyISNWebhook(req)).toBe(false);
  });
});

describe("verifyInternalRequest", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("allows requests when no secret is configured", async () => {
    vi.stubEnv("INTERNAL_API_SECRET", "");
    const { verifyInternalRequest } = await import("@/lib/webhook-auth");
    const req = new Request("http://localhost/api/isn/notify", { method: "POST" });
    expect(verifyInternalRequest(req)).toBe(true);
  });

  it("rejects requests with wrong internal secret", async () => {
    vi.stubEnv("INTERNAL_API_SECRET", "internal-key");
    const { verifyInternalRequest } = await import("@/lib/webhook-auth");
    const req = new Request("http://localhost/api/isn/notify", {
      method: "POST",
      headers: { "x-internal-secret": "wrong-key" },
    });
    expect(verifyInternalRequest(req)).toBe(false);
  });

  it("accepts requests with correct internal secret", async () => {
    vi.stubEnv("INTERNAL_API_SECRET", "internal-key");
    const { verifyInternalRequest } = await import("@/lib/webhook-auth");
    const req = new Request("http://localhost/api/isn/notify", {
      method: "POST",
      headers: { "x-internal-secret": "internal-key" },
    });
    expect(verifyInternalRequest(req)).toBe(true);
  });
});
