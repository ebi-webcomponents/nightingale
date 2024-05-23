import { property } from "lit/decorators.js";
import NightingaleBaseElement, {
  Constructor,
} from "../../nightingale-base-element";

export declare class WithDimensionsInterface {
  width: number;
  height: number;
}

const withDimensions = <T extends Constructor<NightingaleBaseElement>>(
  superClass: T,
  options?: {
    width?: number;
    height?: number;
  },
) => {
  class WithDimensions extends superClass {
    // TODO: Making the width reflective makes the withResizable not responsive
    @property({ type: Number })
    width?: number = options?.width;
    @property({ type: Number, reflect: true })
    height?: number = options?.height;
  }
  return WithDimensions as Constructor<WithDimensionsInterface> & T;
};

export default withDimensions;
