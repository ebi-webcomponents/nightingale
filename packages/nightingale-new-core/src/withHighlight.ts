import { property } from "lit/decorators.js";
import NightingaleBaseElement, {
  Constructor,
} from "./nightingale-base-element";
import Region from "./utils/Region";

const combineRegions = (region1: string, region2: string): string => {
  if (!region1) return region2;
  if (!region2) return region1;
  return `${region1},${region2}`;
};

export declare class WithHighlightInterface {
  highlight: string;
  "highlight-color": string;
  highlightedRegion: Region;
}
const DEFAULT_HIGLIGHT_COLOR = "#FFEB3B66";

const withHighlight = <T extends Constructor<NightingaleBaseElement>>(
  superClass: T,
  options: {
    highlight?: string | null;
    "highlight-color"?: string | null;
  } = {
    highlight: null,
    "highlight-color": DEFAULT_HIGLIGHT_COLOR,
  }
) => {
  class WithHighlight extends superClass {
    @property({ type: String })
    highlight = options.highlight;
    @property({ type: String })
    "highlight-color" = options["highlight-color"];

    highlightedRegion: Region;
    #fixedHighlight: string | null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      this.highlightedRegion = new Region({ min: 1 });
      this.#fixedHighlight = null;
    }
    set fixedHighlight(value: string | null) {
      this.#fixedHighlight = value;
      this.highlightedRegion.decode(
        combineRegions(this.highlight || "", this.#fixedHighlight || "")
      );
      this.updateHighlight();
    }
    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ): void {
      super.attributeChangedCallback(name, oldValue, newValue);
      if (newValue === "null") newValue = null;
      if (oldValue !== newValue) {
        if (name === "length") {
          this.highlightedRegion.max = Number(newValue);
        }
        if (name === "highlight") {
          this.highlightedRegion.decode(
            combineRegions(newValue || "", this.#fixedHighlight || "")
          );
        }
      }
    }
    protected updateHighlight() {
      return;
    }
  }
  return WithHighlight as Constructor<WithHighlightInterface> & T;
};

export default withHighlight;
