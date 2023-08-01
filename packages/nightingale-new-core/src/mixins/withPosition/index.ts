import NightingaleBaseElement, {
  Constructor,
} from "../../nightingale-base-element";
import { property } from "lit/decorators.js";

export interface withPositionInterface extends NightingaleBaseElement {
  "display-start"?: number;
  "display-end"?: number;
  length?: number;
}
export const WHOLE_SEQ = -1;
const defaultOptions = {
  "display-start": 1,
  "display-end": WHOLE_SEQ,
  length: 0,
};
const withPosition = <T extends Constructor<NightingaleBaseElement>>(
  superClass: T,
  options: {
    "display-start"?: number;
    "display-end"?: number;
    length?: number;
  } = {},
) => {
  class WithPosition extends superClass {
    #intitialOptions = { ...defaultOptions, ...options };
    #length: number = this.#intitialOptions.length;
    @property({ type: Number, reflect: true })
    get length() {
      return this.#length;
    }
    set length(value: number) {
      this.#length = value;
      if ((this["display-end"] || 0) > this.#length)
        this["display-end"] = this.length;
    }

    @property({ type: Number, reflect: true })
    "display-start"?: number = this.#intitialOptions["display-start"];
    @property({ type: Number, reflect: true })
    "display-end"?: number = this.#intitialOptions["display-end"];
  }
  return WithPosition as Constructor<withPositionInterface> & T;
};

export default withPosition;
