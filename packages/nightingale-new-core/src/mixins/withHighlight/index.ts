import { property } from "lit/decorators.js";
import NightingaleBaseElement, {
  Constructor,
} from "../../nightingale-base-element";
import Region from "../../utils/Region";

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
export const DEFAULT_HIGHLIGHT_COLOR = "#FFEB3B66";

const defaultOptions = {
  highlight: null,
  "highlight-color": DEFAULT_HIGHLIGHT_COLOR,
};
const withHighlight = <T extends Constructor<NightingaleBaseElement>>(
  superClass: T,
  options: {
    highlight?: string | null;
    "highlight-color"?: string | null;
  } = {},
) => {
  class WithHighlight extends superClass {
    #initialOptions = { ...defaultOptions, ...options };
    @property({ type: String, reflect: true })
    highlight = this.#initialOptions.highlight;
    @property({ type: String, reflect: true })
    "highlight-color" = this.#initialOptions["highlight-color"];

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
        combineRegions(this.highlight || "", this.#fixedHighlight || ""),
      );
      this.updateHighlight();
    }
    override attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null,
    ): void {
      super.attributeChangedCallback(name, oldValue, newValue);
      if (newValue === "null") newValue = null;
      if (oldValue !== newValue) {
        if (name === "length") {
          this.highlightedRegion.max = Number(newValue);
        }
        if (name === "highlight") {
          this.highlightedRegion.decode(
            combineRegions(newValue || "", this.#fixedHighlight || ""),
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
