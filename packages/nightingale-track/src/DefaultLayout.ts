import { Feature } from "./nightingale-track";

export type LayoutOptions = {
  layoutHeight: number;
  margin?: Margin;
  minHeight?: number;
};
type Margin = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export default class DefaultLayout {
  protected margin: Margin;
  protected minHeight: number;
  protected layoutHeight: number;

  features: Feature[];

  constructor({
    layoutHeight,
    margin = {
      top: 1,
      bottom: 1,
      left: 0,
      right: 0,
    },
    minHeight = 17,
  }: LayoutOptions) {
    this.margin = margin;
    this.minHeight = minHeight;
    this.layoutHeight = layoutHeight;
    this.features = [];
  }

  init(features: Feature[], ..._args: unknown[]) {
    this.features = features;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getFeatureYPos(feature?: Feature | string) {
    // Position right in the middle of the space between the margins
    const featureHeight = this.getFeatureHeight();
    return (
      this.margin.top +
      (this.layoutHeight - this.margin.top - this.margin.bottom) / 2 -
      featureHeight / 2
    );
  }

  getFeatureHeight(..._args: unknown[]) {
    return Math.max(
      this.minHeight,
      this.layoutHeight - this.margin.top - this.margin.bottom
    );
  }
}
