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
    width: 0,
    height: 0,
  }
) => {
  class WithDimensions extends superClass {
    @property()
    width: number = options.width;
    @property()
    height: number = options.height;
  }
  return WithDimensions as Constructor<WithDimensionsInterface> & T;
};

export default withDimensions;
