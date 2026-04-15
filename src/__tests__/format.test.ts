import { describe, it, expect } from "vitest";
import { formatTime, formatInspectorName } from "@/lib/format";

describe("formatTime", () => {
  it("formats morning time", () => {
    expect(formatTime("2026-04-10 09:00:00")).toBe("9:00 AM");
  });

  it("formats afternoon time", () => {
    expect(formatTime("2026-04-10 14:30:00")).toBe("2:30 PM");
  });

  it("formats noon as PM", () => {
    expect(formatTime("2026-04-10 12:00:00")).toBe("12:00 PM");
  });

  it("formats midnight as 12 AM", () => {
    expect(formatTime("2026-04-10 00:00:00")).toBe("12:00 AM");
  });
});

describe("formatInspectorName", () => {
  it("shortens full name with suffix", () => {
    expect(formatInspectorName("Troy Cunningham, CPI DFW IT1")).toBe("Troy C.");
  });

  it("shortens plain two-word name", () => {
    expect(formatInspectorName("Jordan Vanover")).toBe("Jordan V.");
  });

  it("returns single name as-is", () => {
    expect(formatInspectorName("Jordan")).toBe("Jordan");
  });
});
