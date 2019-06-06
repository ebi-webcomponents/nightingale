export default class DefaultLayout {
  constructor({ layoutHeight, padding = 1, minHeight = 17 }) {
    this._padding = padding;
    this._minHeight = minHeight;
    this._layoutHeight = layoutHeight;
  }
  init(features) {
    this._features = features;
  }
  getFeatureYPos(feature) {
    return Math.min(this._layoutHeight, this._minHeight);
  }
  getFeatureHeight(feature) {
    return Math.min(this._layoutHeight, this._minHeight);
  }
}
