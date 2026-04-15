import { describe, it, expect } from "vitest";
import { getISNOrderTypeId, buildOrderNotes, ISN_ORDER_TYPE_IDS } from "@/lib/isn-mappings";

describe("getISNOrderTypeId", () => {
  it("returns home inspection type for home service", () => {
    expect(getISNOrderTypeId("home", null)).toBe(ISN_ORDER_TYPE_IDS["home"]);
  });

  it("returns correct type for new-construction nc1", () => {
    expect(getISNOrderTypeId("new-construction", "nc1")).toBe(ISN_ORDER_TYPE_IDS["new-construction-nc1"]);
  });

  it("returns correct type for new-construction nc2", () => {
    expect(getISNOrderTypeId("new-construction", "nc2")).toBe(ISN_ORDER_TYPE_IDS["new-construction-nc2"]);
  });

  it("returns correct type for new-construction nc3", () => {
    expect(getISNOrderTypeId("new-construction", "nc3")).toBe(ISN_ORDER_TYPE_IDS["new-construction-nc3"]);
  });

  it("falls back to nc1 for unknown NC package", () => {
    // @ts-expect-error — testing unknown value
    expect(getISNOrderTypeId("new-construction", "nc99")).toBe(ISN_ORDER_TYPE_IDS["new-construction-nc1"]);
  });

  it("returns engineering type", () => {
    expect(getISNOrderTypeId("engineering", null)).toBe(ISN_ORDER_TYPE_IDS["engineering"]);
  });

  it("returns environmental type", () => {
    expect(getISNOrderTypeId("environmental", null)).toBe(ISN_ORDER_TYPE_IDS["environmental"]);
  });

  it("returns commercial type", () => {
    expect(getISNOrderTypeId("commercial", null)).toBe(ISN_ORDER_TYPE_IDS["commercial"]);
  });

  it("falls back to home for unknown service type", () => {
    // @ts-expect-error — testing unknown value
    expect(getISNOrderTypeId("plumbing", null)).toBe(ISN_ORDER_TYPE_IDS["home"]);
  });
});

describe("buildOrderNotes", () => {
  it("includes booking source", () => {
    const notes = buildOrderNotes(null, "", null);
    expect(notes).toContain("Booked via GreenWorks Online Scheduler");
  });

  it("includes package name", () => {
    const notes = buildOrderNotes("greener", "", null);
    expect(notes).toContain("Greener Package");
  });

  it("includes sqft", () => {
    const notes = buildOrderNotes(null, "3200", null);
    expect(notes).toContain("3,200");
  });

  it("includes foundation type", () => {
    const notes = buildOrderNotes(null, "", null, "slab");
    expect(notes).toContain("Foundation: Slab");
  });

  it("includes pier & beam foundation", () => {
    const notes = buildOrderNotes(null, "", null, "pier-beam");
    expect(notes).toContain("Foundation: Pier & Beam");
  });

  it("skips unknown foundation", () => {
    const notes = buildOrderNotes(null, "", null, "unknown");
    expect(notes).not.toContain("Foundation");
  });

  it("includes contact role", () => {
    const notes = buildOrderNotes(null, "", "buyer");
    expect(notes).toContain("Contact Role: Home Buyer");
  });

  it("uses pipe separator", () => {
    const notes = buildOrderNotes("green", "2500", "agent", "slab");
    const parts = notes.split(" | ");
    expect(parts.length).toBeGreaterThanOrEqual(4);
  });
});
