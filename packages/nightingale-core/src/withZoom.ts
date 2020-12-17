import NightingaleBaseElement from "./nightingale-base-element";
import Registry from "./registryWith";

const withZoom = (
  Element: typeof NightingaleBaseElement
  // options: {} = {}
): any => {
  class ElementWithZoom extends Element {
    container: HTMLElement;

    get implements(): Array<keyof typeof Registry> {
      return super.implements.concat(Registry.withZoom);
    }

    get dependencies(): Array<keyof typeof Registry> {
      return super.dependencies.concat(Registry.withDimensions);
    }

    constructor() {
      super();
      console.log("zoom");
    }
  }
  return ElementWithZoom;
};

export default withZoom;
