import { Feature } from "./nightingale-track";

export type LayoutOptions = {
  layoutHeight: number;
  padding?: number;
  minHeight?: number;
};

export default class DefaultLayout {
  protected padding: number;
  protected minHeight: number;
  protected layoutHeight: number;

  features: Feature[];

  constructor({ layoutHeight, padding = 1, minHeight = 17 }: LayoutOptions) {
    this.padding = padding;
    this.minHeight = minHeight;
    this.layoutHeight = layoutHeight;
    this.features = [];
  }

  init(features: Feature[], ..._args: unknown[]) {
    this.features = features;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getFeatureYPos(feature?: Feature | string) {
    // Position right in the middle
    const featureHeight = this.getFeatureHeight();
    return this.layoutHeight / 2 - featureHeight / 2;
  }

  getFeatureHeight(..._args: unknown[]) {
    return Math.min(this.layoutHeight, this.minHeight) - this.padding;
  }
}
