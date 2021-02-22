import { TrackHighlighter } from "@nightingale-elements/utils";
import NightingaleBaseElement from "./nightingale-base-element";
import Registry from "./registryWith";

export const HIGHLIGHT_EVENT = "highlight-event";

export interface WithHighlightI extends NightingaleBaseElement {
  highlight?: string;
}

const withHighlight = <T extends typeof NightingaleBaseElement>(
  Element: T
): WithHighlightI => {
  class ElementWithManager extends (Element as any) {
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
      this._highlightEvent = this.getAttribute(HIGHLIGHT_EVENT)
        ? this.getAttribute(HIGHLIGHT_EVENT)
        : "onclick";
      this.trackHighlighter.setAttributesInElement(this);
      super.connectedCallback();
    }

    set fixedHighlight(region: string) {
      this.trackHighlighter.setFixedHighlight(region);
    }

    static get observedAttributes() {
      return Element.observedAttributes.concat(["highlight"]);
    }

    get sequenceLength() {
      return (this as any)._length;
    }

    set sequenceLength(length: number) {
      (this as any)._length = length;
      (this as any)._length = length;
      this.trackHighlighter.max = length;
    }

    attributeChangedCallback(
      name: string,
      oldValue: string,
      newValue: string
    ): void {
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
