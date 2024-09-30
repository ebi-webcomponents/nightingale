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
  protected rowHeight: number;
  featuresMap = new Map();
  #rows: Feature[][];

  constructor(options: LayoutOptions) {
    super(options);
    this.rowHeight = 0;
    this.minHeight = 15;
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
    this.rowHeight = Math.min(
      this.layoutHeight / this.#rows.length,
      this.minHeight,
    );
  }

  getOffset() {
    // this offset is required for centering if the number of rows doesn't
    // fill the layout
    if (this.#rows.length * this.rowHeight < this.layoutHeight) {
      return this.layoutHeight / 2 - (this.#rows.length * this.rowHeight) / 2;
    }
    return 0;
  }

  getFeatureYPos(feature: Feature) {
    const rowNumber = this.featuresMap.get(feature);
    return (
      this.getOffset() +
      this.rowHeight * rowNumber +
      this.margin.top +
      this.margin.bottom
    );
  }

  getFeatureHeight() {
    return this.rowHeight - this.margin.top - this.margin.bottom;
  }
}
