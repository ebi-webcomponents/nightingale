export default class DefaultLayout {
  constructor({ layoutHeight, padding = 1, minHeight = 17 }) {
    this._padding = padding;
    this._minHeight = minHeight;
    this._layoutHeight = layoutHeight;
  }

  init(features) {
    this._features = features;
  }

  getFeatureYPos() {
    // Position right in the middle
    const featureHeight = this.getFeatureHeight();
    return this._layoutHeight / 2 - featureHeight / 2;
  }

  getFeatureHeight() {
    return Math.min(this._layoutHeight, this._minHeight) - this._padding;
  }
}
