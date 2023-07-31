import DefaultLayout, { LayoutOptions } from "./DefaultLayout";
import { Feature } from "./nightingale-track";

const featuresOverlap = (feature1: Feature, feature2: Feature) =>
  !(
    Number(feature2.start) > Number(feature1.end) ||
    Number(feature2.end) < Number(feature1.start)
  );

const featureOvelapsInRow = (feature: Feature, row: Feature[]) =>
  row.some((rowFeature) => featuresOverlap(feature, rowFeature));

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
    features.forEach((feature) => {
      const rowIndex = this.#rows.findIndex(
        (row) => !featureOvelapsInRow(feature, row),
      );
      if (rowIndex >= 0) {
        this.#rows[rowIndex].push(feature);
        this.featuresMap.set(feature, rowIndex);
      } else {
        this.#rows.push([feature]);
        this.featuresMap.set(feature, this.#rows.length - 1);
      }
    });
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
