import NightingaleBaseElement, {
  Constructor,
} from "./nightingale-base-element";
import { property } from "lit/decorators.js";

export interface withPositionInterface extends NightingaleBaseElement {
  "display-start"?: number;
  "display-end"?: number;
  length?: number;
}
const WHOLE_SEQ = -1;
const withPosition = <T extends Constructor<NightingaleBaseElement>>(
  superClass: T,
  options: {
    "display-start": number;
    "display-end": number;
    length: number;
  } = {
    "display-start": 1,
    "display-end": WHOLE_SEQ,
    length: 0,
  }
) => {
  class WithPosition extends superClass {
    @property({ type: Number })
    length?: number = options.length;
    @property({ type: Number })
    "display-start"?: number = options["display-start"];
    @property({ type: Number })
    "display-end"?: number = options["display-end"];

    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // constructor(...args: any[]) {
    //   super(...args);
    //   if (!this.length) this.length = 1;
    //   if (!this["display-start"]) this["display-start"] = 1;
    //   if (!this["display-end"]) this["display-end"] = this.length;
    // }
  }
  return WithPosition as Constructor<withPositionInterface> & T;
};

export default withPosition;
