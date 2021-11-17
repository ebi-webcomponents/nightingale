import NightingaleBaseElement, {
  Constructor,
} from "./nightingale-base-element";
import { property } from "lit/decorators.js";

export interface withPositionInterface extends NightingaleBaseElement {
  'display-start'?: number;
  'display-end'?: number;
  length?: number;
}

const withPosition = <T extends Constructor<NightingaleBaseElement>>(
  superClass: T,
  options: {
    'display-start': number;
    'display-end': number;
    length: number;
  } = {
    'display-start': 1,
    'display-end': 1,
    length: 0,
  }
) => {
  class WithPosition extends superClass {
    @property({ type: Number })
    'display-start': number = options['display-start'];
    @property({ type: Number })
    'display-end': number = options['display-end'];
    @property({ type: Number })
    length: number = options.length;
  }
  return WithPosition as Constructor<withPositionInterface> & T;
};

export default withPosition;
