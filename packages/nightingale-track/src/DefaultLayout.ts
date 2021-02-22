import { Feature } from "./types";

export type DefaultConstructorProps = {
  layoutHeight: number;
  padding: number;
  minHeight: number;
};

export default class DefaultLayout {
  _padding: number;

  _minHeight: number;

  _layoutHeight: number;

  _features?: Feature[];

  constructor({
    layoutHeight,
    padding = 1,
    minHeight = 17,
  }: DefaultConstructorProps) {
    this._padding = padding;
    this._minHeight = minHeight;
    this._layoutHeight = layoutHeight;
  }

  init(features: Feature[]): void {
    this._features = features;
  }

  getFeatureYPos(feature: Feature): number {
    // Position right in the middle
    const featureHeight = this.getFeatureHeight(feature);
    return this._layoutHeight / 2 - featureHeight / 2;
  }

  getFeatureHeight(_: Feature): number {
    return Math.min(this._layoutHeight, this._minHeight) - this._padding;
  }
}
