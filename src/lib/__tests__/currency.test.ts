import { describe, expect, it } from "vitest";
import { formatPrice, discountPercent } from "@/lib/currency";

describe("formatPrice", () => {
  it("formats a whole number as ILS currency", () => {
    const formatted = formatPrice(1999);
    expect(formatted).toContain("1,999");
    expect(formatted).toMatch(/₪/);
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toMatch(/₪/);
  });
});

describe("discountPercent", () => {
  it("returns null when there is no compareAtPrice", () => {
    expect(discountPercent(100, undefined)).toBeNull();
  });

  it("returns null when compareAtPrice is not greater than price", () => {
    expect(discountPercent(100, 100)).toBeNull();
    expect(discountPercent(100, 80)).toBeNull();
  });

  it("computes the rounded percentage discount", () => {
    expect(discountPercent(80, 100)).toBe(20);
    expect(discountPercent(75, 100)).toBe(25);
  });
});
