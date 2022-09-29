import { property } from "lit/decorators.js";
import NightingaleBaseElement, {
  Constructor,
} from "./nightingale-base-element";

export declare class WithDimensionsInterface {
  width: number;
  height: number;
}

const withDimensions = <T extends Constructor<NightingaleBaseElement>>(
  superClass: T,
  options: {
    width: number;
    height: number;
  } = {
    width: 800,
    height: 100,
  }
) => {
  class WithDimensions extends superClass {
    @property({ type: Number })
    width: number = options.width;
    @property({ type: Number })
    height: number = options.height;
  }
  return WithDimensions as Constructor<WithDimensionsInterface> & T;
};

export default withDimensions;
