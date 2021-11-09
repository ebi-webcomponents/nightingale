import NightingaleBaseElement, {
  Constructor,
} from "./nightingale-base-element";
import { property } from "lit/decorators.js";
import withDimensions from "./withDimensions";

export interface withMarginInterface extends NightingaleBaseElement {
  "margin-top": number;
  "margin-bottom": number;
  "margin-left": number;
  "margin-right": number;
  getWidthWithMargins: () => number;
  getHeightWithMargins: () => number;
}

const withMargin = <T extends Constructor<NightingaleBaseElement>>(
  superClass: T,
  options: {
    "margin-top": number;
    "margin-bottom": number;
    "margin-left": number;
    "margin-right": number;
  } = {
    "margin-top": 0,
    "margin-bottom": 0,
    "margin-left": 10,
    "margin-right": 10,
  }
) => {
  class WithMargin extends withDimensions(superClass) {
    @property()
    "margin-top": number = options["margin-top"];
    @property()
    "margin-bottom": number = options["margin-bottom"];
    @property()
    "margin-left": number = options["margin-left"];
    @property()
    "margin-right": number = options["margin-right"];

    getWidthWithMargins() {
      return this.width
        ? this.width - this["margin-left"] - this["margin-right"]
        : 0;
    }
    getHeightWithMargins() {
      return this.height
        ? this.height - this["margin-top"] - this["margin-bottom"]
        : 0;
    }
  }
  return WithMargin as Constructor<withMarginInterface> & T;
};

export default withMargin;
