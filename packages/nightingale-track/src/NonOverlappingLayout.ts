import DefaultLayout, { DefaultConstructorProps } from "./DefaultLayout";
import { Feature } from "./types";

const featuresOverlap = (feature1, feature2) =>
  !(
    Number(feature2.start) > Number(feature1.end) ||
    Number(feature2.end) < Number(feature1.start)
  );

const featureOvelapsInRow = (feature, row) =>
  row.some((rowFeature) => featuresOverlap(feature, rowFeature));

export default class NonOverlappingLayout extends DefaultLayout {
  featuresMap: Map<Feature, number>;

  _rowHeight: number;

  _rows: Array<Array<Feature>>;

  constructor(options: DefaultConstructorProps) {
    super(options);
    this.featuresMap = new Map();
    this._rowHeight = 0;
    this._rows = [];
    this._minHeight = 15;
  }

  init(features: Feature[]): void {
    features.forEach((feature) => {
      const rowIndex = this._rows.findIndex(
        (row) => !featureOvelapsInRow(feature, row)
      );
      if (rowIndex >= 0) {
        this._rows[rowIndex].push(feature);
        this.featuresMap.set(feature, rowIndex);
      } else {
        this._rows.push([feature]);
        this.featuresMap.set(feature, this._rows.length - 1);
      }
    });
    this._rowHeight = Math.min(
      this._layoutHeight / this._rows.length,
      this._minHeight
    );
  }

  getOffset(): number {
    // this offset is required for centering if the number of rows doesn't
    // fill the layout
    if (this._rows.length * this._rowHeight < this._layoutHeight) {
      return this._layoutHeight / 2 - (this._rows.length * this._rowHeight) / 2;
    }
    return 0;
  }

  getFeatureYPos(feature: Feature): number {
    const rowNumber = this.featuresMap.get(feature);
    return this.getOffset() + this._rowHeight * rowNumber + 2 * this._padding;
  }

  getFeatureHeight(): number {
    return this._rowHeight - 2 * this._padding;
  }
}
