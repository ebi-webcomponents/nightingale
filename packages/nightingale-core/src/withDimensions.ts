import NightingaleBaseElement from "./nightingale-base-element";
import Registry from "./registryWith";

const withDimensions = (
  Element: typeof NightingaleBaseElement,
  options: {
    width: number;
    height: number;
  } = {
    width: 0,
    height: 0,
  }
): any => {
  class ElementWithDimensions extends Element {
    width: number;

    height: number;

    get implements(): Array<keyof typeof Registry> {
      return super.implements.concat(Registry.withDimensions);
    }

    constructor() {
      super();
      this.width = options.width;
      this.height = options.height;
    }
  }
  return ElementWithDimensions;
};

export default withDimensions;
