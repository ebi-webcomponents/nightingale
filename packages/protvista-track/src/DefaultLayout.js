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
    return Math.min(this._layoutHeight, this._minHeight) + this._padding;
  }

  getFeatureHeight() {
    console.log(this._layoutHeight, this._minHeight, this._padding);
    return Math.min(this._layoutHeight, this._minHeight) - this._padding;
  }
}
