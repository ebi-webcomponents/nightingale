import { clamp } from "lodash-es";
import DefaultLayout, { LayoutOptions } from "./DefaultLayout";
import { Feature } from "./nightingale-track";


export default class NonOverlappingLayout extends DefaultLayout {
  /** Height of a row, including gap between rows */
  protected rowHeight: number = 0;
  /** Height of a feature, excluding gap between rows */
  protected featureHeight: number = 0;
  /** Y coordinate of the top of the first row */
  protected topOffset: number = 0;

  /** Mapping of feature to row index */
  featuresMap = new Map<Feature, number>();

  constructor(options: LayoutOptions) {
    super({
      ...options,
      maxHeight: options.maxHeight ?? 15,
    });
  }

  override init(features: Feature[]) {
    const { featuresMap, rows } = placeFeaturesIntoRows(features);
    this.featuresMap = featuresMap;
    const usableHeight = clamp(this.layoutHeight - this.margin.top - this.margin.bottom, 0, rows.length * (this.maxHeight + this.gap));
    this.rowHeight = usableHeight / Math.max(rows.length, 1);
    this.featureHeight = clamp(this.rowHeight - this.gap, this.minHeight, this.maxHeight);
    const center = 0.5 * (this.margin.top + this.layoutHeight - this.margin.bottom);
    this.topOffset = center - 0.5 * usableHeight;
  }

  override getFeatureYPos(feature: Feature) {
    const rowIndex = this.featuresMap.get(feature) ?? 0;
    const center = this.topOffset + (rowIndex + 0.5) * this.rowHeight;
    return center - 0.5 * this.featureHeight;
  }

  override getFeatureHeight() {
    return this.featureHeight;
  }
}


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

function placeFeaturesIntoRows(features: Feature[]) {
  const featuresMap = new Map<Feature, number>();
  const rows: Feature[][] = [];
  const rowRanges: Record<number, Range> = {}; // For better performance, would also work without this
  for (const feature of features) {
    const rowIndex = rows.findIndex(
      (row, i) => !overlap(feature, rowRanges[i]) || !overlapInRow(feature, row),
    );
    if (rowIndex >= 0) {
      // Add to existing row
      rows[rowIndex].push(feature);
      featuresMap.set(feature, rowIndex);
      const rowRange = rowRanges[rowIndex];
      rowRanges[rowIndex] = {
        start: Math.min(rowRange.start, feature.start ?? -Infinity),
        end: Math.max(rowRange.end, feature.end ?? Infinity),
      };
    } else {
      // Create new row
      rows.push([feature]);
      featuresMap.set(feature, rows.length - 1);
      rowRanges[rows.length - 1] = {
        start: feature.start ?? -Infinity,
        end: feature.end ?? Infinity,
      };
    }
  }
  return { rows, featuresMap };
}
