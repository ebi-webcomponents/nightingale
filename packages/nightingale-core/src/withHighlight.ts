import { TrackHighlighter, ScrollFilter } from "@nightingale-elements/utils";
import NightingaleBaseElement from "./nightingale-base-element";
import Registry from "./registryWith";

const withHighlight = (Element: typeof NightingaleBaseElement): any => {
  class ElementWithManager extends Element {
    trackHighlighter: TrackHighlighter;

    _highlightEvent: string;

    constructor() {
      super();
      this.trackHighlighter = new TrackHighlighter({ element: this, min: 1 });
    }

    get implements(): Array<keyof typeof Registry> {
      return super.implements.concat(Registry.withHighlight);
    }

    connectedCallback() {
      this._highlightEvent = this.getAttribute("highlight-event")
        ? this.getAttribute("highlight-event")
        : "onclick";
      this.trackHighlighter.setAttributesInElement(this);
      super.connectedCallback();
    }

    set fixedHighlight(region) {
      this.trackHighlighter.setFixedHighlight(region);
    }

    static get observedAttributes() {
      return Element.observedAttributes.concat(["highlight"]);
    }

    set length(length) {
      super._length = length;
      this.trackHighlighter.max = length;
    }

    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback(name, oldValue, newValue);
      if (
        name === "highlight" &&
        typeof newValue === "string" &&
        oldValue !== newValue
      ) {
        this.trackHighlighter.changedCallBack(name, newValue);
      }
    }
  }
  return ElementWithManager;
};
export default withHighlight;
