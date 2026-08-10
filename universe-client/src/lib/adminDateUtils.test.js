import { describe, expect, it } from "vitest";

import { matchesDateRange } from "./adminDateUtils";

describe("matchesDateRange", () => {
  it("matches items inside the selected date range", () => {
    const item = { created_at: "2026-08-10T12:30:00.000Z" };

    expect(matchesDateRange(item, "2026-08-01", "2026-08-31")).toBe(true);
  });

  it("rejects items outside the selected date range", () => {
    const item = { created_at: "2026-09-01T00:00:00.000Z" };

    expect(matchesDateRange(item, "2026-08-01", "2026-08-31")).toBe(false);
  });

  it("handles reversed start and end dates", () => {
    const item = { date_time: "2026-08-15T09:00:00.000Z" };

    expect(matchesDateRange(item, "2026-08-31", "2026-08-01")).toBe(true);
  });

  it("rejects invalid or missing item dates when a range is active", () => {
    expect(matchesDateRange({ created_at: "not-a-date" }, "2026-08-01", null)).toBe(
      false,
    );
    expect(matchesDateRange({}, null, "2026-08-31")).toBe(false);
  });
});
