import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cacheGet, cacheSet } from "@/lib/cache";

describe("cache", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns null for missing keys", () => {
    expect(cacheGet("nonexistent")).toBeNull();
  });

  it("stores and retrieves values", () => {
    cacheSet("test-key", { data: "hello" }, 60000);
    expect(cacheGet("test-key")).toEqual({ data: "hello" });
  });

  it("returns null for expired entries", () => {
    cacheSet("expiring", "value", 5000);
    expect(cacheGet("expiring")).toBe("value");

    vi.advanceTimersByTime(6000);
    expect(cacheGet("expiring")).toBeNull();
  });

  it("returns value just before expiry", () => {
    cacheSet("edge", "value", 5000);
    vi.advanceTimersByTime(4999);
    expect(cacheGet("edge")).toBe("value");
  });
});
