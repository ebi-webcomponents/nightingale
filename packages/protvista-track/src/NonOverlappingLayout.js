import DefaultLayout from "./DefaultLayout";

const featuresOverlap = (feature1, feature2) => {
  return !(
    Number(feature2.start) > Number(feature1.end) ||
    Number(feature2.end) < Number(feature1.start)
  );
};

const featureOvelapsInRow = (feature, row) => {
  return row.some(rowFeature => featuresOverlap(feature, rowFeature));
};

export default class NonOverlappingLayout extends DefaultLayout {
  constructor(options) {
    super(options);
    this.featuresMap = new Map();
    this._rowHeight = 0;
    this._rows = new Array();
    this._minHeight = 15;
  }

  init(features) {
    const rows = new Array();
    features.forEach(feature => {
      const rowIndex = this._rows.findIndex(
        row => !featureOvelapsInRow(feature, row)
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

  getOffset() {
    // this offset is required for centering if the number of rows doesn't
    // fill the layout
    if (this._rows.length * this._rowHeight < this._layoutHeight) {
      return this._layoutHeight / 2 - (this._rows.length * this._rowHeight) / 2;
    }
    return 0;
  }

  getFeatureYPos(feature) {
    const rowNumber = this.featuresMap.get(feature);
    return this.getOffset() + this._rowHeight * rowNumber + 2 * this._padding;
  }

  getFeatureHeight() {
    return this._rowHeight - 2 * this._padding;
  }
}
