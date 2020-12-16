import { NightingaleElement } from "@nightingale-elements/types";

const defineElement = (Element: typeof NightingaleElement): void => {
  if ("customElements" in window) {
    const alreadyDefined = window.customElements.get(Element.is);
    if (!alreadyDefined) {
      customElements.define(Element.is, Element);
    } else if (alreadyDefined !== Element) {
      console.warn(`${Element.is} is already used by a different element.`);
    } // else this component is already defined with this name, all good
  }
};

export default defineElement;
