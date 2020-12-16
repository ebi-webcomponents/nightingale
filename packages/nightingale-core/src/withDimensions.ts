import NightingaleBaseElement from "./nightingale-base-element";

export const WITH_DIMENSION = "WITH_DIMENSION";

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

    get implements(): Array<string> {
      return super.implements.concat(WITH_DIMENSION);
    }

    // implements: Array<string> = super.implements.concat(WITH_DIMENSION);

    constructor() {
      super();
      this.width = options.width;
      this.height = options.height;
    }
  }
  return ElementWithDimensions;
};

withDimensions.__nType = WITH_DIMENSION;

export default withDimensions;
