/* Adapting it from this stack overflow answer: https://stackoverflow.com/a/6511606 */

type ColorProperty = "fill" | "stroke" | "color";

export function contrastingColor(color: number[] | null) {
  if (!color) return "black";
  return luma(color) >= 165 ? "black" : "white";
}
export function luma(rgb: number[]) {
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]; // SMPTE C, Rec. 709 weightings
}

export function getColor(
  element: Element,
  property: ColorProperty,
): number[] | null {
  const style = getComputedStyle(element);
  const prop = style?.[property];
  const res = prop?.match(/[.\d]+/g)?.map(Number) || null;
  return res;
}
