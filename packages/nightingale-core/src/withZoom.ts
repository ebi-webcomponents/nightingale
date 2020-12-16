import NightingaleBaseElement from "./nightingale-base-element";
import { WITH_DIMENSION } from "./withDimensions";

const WITH_ZOOM = "WITH_ZOOM";

const withZoom = (
  Element: typeof NightingaleBaseElement
  // options: {} = {}
): any => {
  class ElementWithZoom extends Element {
    container: HTMLElement;

    get implements(): Array<string> {
      return super.implements.concat(WITH_ZOOM);
    }

    get dependencies(): Array<string> {
      return super.dependencies.concat(WITH_DIMENSION);
    }

    constructor() {
      super();
      console.log("zoom");
    }
  }
  return ElementWithZoom;
};

withZoom.__nType = WITH_ZOOM;

export default withZoom;
