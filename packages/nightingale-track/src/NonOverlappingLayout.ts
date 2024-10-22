import { clamp } from "lodash-es";
import DefaultLayout, { LayoutOptions } from "./DefaultLayout";
import { Feature } from "./nightingale-track";


type Range = { start: number, end: number };

function overlap(feature1: Partial<Range>, feature2: Partial<Range>): boolean {
  return !(
    Number(feature2.start) > Number(feature1.end) ||
    Number(feature2.end) < Number(feature1.start)
  );
}

function overlapInRow(feature: Partial<Range>, row: Partial<Range>[]): boolean {
  // Search in reverse order for better performance
  return reverseSome(row, rowFeature => overlap(feature, rowFeature));
}

/** Equivalent to `array.some(predicate)` but tests elements in reverse order. */
function reverseSome<T>(array: T[], predicate: (value: T, index: number, array: T[]) => boolean): boolean {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i], i, array)) return true;
  }
  return false;
}


export default class NonOverlappingLayout extends DefaultLayout {
  /** Height of a row, including gap between rows */
  protected rowHeight: number;
  /** Height of a feature, excluding gap between rows */
  protected featureHeight: number;
  /** Y coordinate of the top of the first row */
  protected topOffset: number;

  featuresMap = new Map<Feature, number>();
  #rows: Feature[][];

  constructor(options: LayoutOptions) {
    super({
      ...options,
      maxHeight: options.maxHeight ?? 15,
    });
    this.rowHeight = 0;
    this.featureHeight = 0;
    this.topOffset = 0;
    this.#rows = [];
  }

  init(features: Feature[]) {
    const rowRanges: Record<number, Range> = {}; // For better performance, would also work without this
    for (const feature of features) {
      const rowIndex = this.#rows.findIndex(
        (row, i) => !overlap(feature, rowRanges[i]) || !overlapInRow(feature, row),
      );
      if (rowIndex >= 0) {
        // Add to existing row
        this.#rows[rowIndex].push(feature);
        this.featuresMap.set(feature, rowIndex);
        const rowRange = rowRanges[rowIndex];
        rowRanges[rowIndex] = {
          start: Math.min(rowRange.start, feature.start ?? -Infinity),
          end: Math.max(rowRange.end, feature.end ?? Infinity),
        };
      } else {
        // Create new row
        this.#rows.push([feature]);
        this.featuresMap.set(feature, this.#rows.length - 1);
        rowRanges[this.#rows.length - 1] = {
          start: feature.start ?? -Infinity,
          end: feature.end ?? Infinity,
        };
      }
    }
    const usableHeight = clamp(this.layoutHeight - this.margin.top - this.margin.bottom, 0, this.#rows.length * (this.maxHeight + this.gap));
    this.rowHeight = usableHeight / Math.max(this.#rows.length, 1);
    this.featureHeight = clamp(this.rowHeight - this.gap, this.minHeight, this.maxHeight);
    const center = 0.5 * (this.margin.top + this.layoutHeight - this.margin.bottom);
    this.topOffset = center - 0.5 * usableHeight;
  }

  getFeatureYPos(feature: Feature) {
    const rowIndex = this.featuresMap.get(feature) ?? 0;
    const center = this.topOffset + (rowIndex + 0.5) * this.rowHeight;
    return center - 0.5 * this.featureHeight;
  }

  getFeatureHeight() {
    return this.featureHeight;
  }
}
