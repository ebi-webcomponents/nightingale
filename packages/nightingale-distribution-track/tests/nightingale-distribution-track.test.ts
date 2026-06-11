import { getQuantile } from "../src/nightingale-distribution-track";


describe("getQuantile", () => {
  // Basic quantile calculations
  test("calculates median (0.5 quantile) of odd-length array", () => {
    expect(getQuantile([1, 2, 3, 4, 5], 0.5)).toEqual(3);
  });

  test("calculates median (0.5 quantile) of even-length array", () => {
    expect(getQuantile([1, 2, 3, 4], 0.5)).toEqual(2.5);
  });

  // Edge cases for quantile values
  test("returns minimum value for quantile 0", () => {
    expect(getQuantile([1, 2, 3, 4, 5], 0)).toEqual(1);
  });

  test("returns maximum value for quantile 1", () => {
    expect(getQuantile([1, 2, 3, 4, 5], 1)).toEqual(5);
  });

  // Quartile calculations
  test("calculates first quartile (0.25)", () => {
    expect(getQuantile([1, 2, 3, 4, 5], 0.25)).toEqual(2);
  });

  test("calculates third quartile (0.75)", () => {
    expect(getQuantile([1, 2, 3, 4, 5], 0.75)).toEqual(4);
  });

  // Small arrays
  test("handles single-element array", () => {
    expect(getQuantile([5], 0.5)).toEqual(5);
    expect(getQuantile([5], 0.1)).toEqual(5);
  });

  test("handles two-element array", () => {
    expect(getQuantile([1, 5], 0.5)).toEqual(3);
    expect(getQuantile([1, 5], 0.1)).toEqual(1.4);
    expect(getQuantile([1, 5], 0.25)).toEqual(2);
    expect(getQuantile([1, 5], 0.75)).toEqual(4);
    expect(getQuantile([1, 5], 0.9)).toEqual(4.6);
  });

  // Negative numbers
  test("works with negative values", () => {
    expect(getQuantile([-5, -3, 0, 3, 5], 0.5)).toEqual(0);
  });

  test("calculates quantile with all negative values", () => {
    expect(getQuantile([-5, -4, -3, -2, -1], 0.5)).toEqual(-3);
  });

  // Floating-point values
  test("works with floating-point values", () => {
    expect(getQuantile([1.5, 2.5, 3.5, 4.5], 0.5)).toEqual(3);
  });

  // Duplicate values
  test("handles array with duplicate values", () => {
    expect(getQuantile([1, 2, 2, 2, 5], 0.5)).toEqual(2);
  });

  // Various array sizes
  test("calculates quantile for larger array", () => {
    const largeArray = Array.from({ length: 101 }, (_, i) => i);
    expect(getQuantile(largeArray, 0.5)).toEqual(50);
  });

  test("calculates deciles correctly", () => {
    const array = Array.from({ length: 11 }, (_, i) => i);
    expect(getQuantile(array, 0.1)).toEqual(1);
    expect(getQuantile(array, 0.2)).toEqual(2);
    expect(getQuantile(array, 0.9)).toEqual(9);
  });
});
