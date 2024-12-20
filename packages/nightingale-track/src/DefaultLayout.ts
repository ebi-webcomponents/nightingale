import { clamp } from "lodash-es";
import { Feature } from "./nightingale-track";


export type LayoutOptions = {
  /** Height of the whole track */
  layoutHeight: number;
  /** Empty space at the top/bottom/left/right of the track */
  margin?: Margin;
  /** Minimum feature height (excluding gap) */
  minHeight?: number;
  /** Maximum feature height (excluding gap) */
  maxHeight?: number;
  /** Gap between two rows in non-overlapping layout.
   * Rectangle stroke protrudes into this gap, so the default value 2 means 1px of white space between rows.
   * When there are to many rows, gap will be reduced. */
  gap?: number;
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
  protected maxHeight: number;
  protected gap: number;
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
    minHeight = 0.1, // Using a non-zero value to keep SVG shapes targetable with cursor
    maxHeight = Infinity,
    gap = 2,
  }: LayoutOptions) {
    this.margin = margin;
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;
    this.gap = gap;
    this.layoutHeight = layoutHeight;
    this.features = [];
  }

  init(features: Feature[], ..._args: unknown[]) {
    this.features = features;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getFeatureYPos(feature?: Feature | string) {
    // Position right in the middle of the space between the margins
    const center = 0.5 * (this.margin.top + this.layoutHeight - this.margin.bottom);
    return center - 0.5 * this.getFeatureHeight();
  }

  getFeatureHeight(..._args: unknown[]) {
    return clamp(this.layoutHeight - this.margin.top - this.margin.bottom - this.gap, this.minHeight, this.maxHeight);
  }
}
