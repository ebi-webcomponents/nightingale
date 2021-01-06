import { event as d3Event } from "d3";

import Registry from "./registryWith";
import { ElementWithDimensions } from "./withDimensions";

const withEventBinder = (
  Element: typeof ElementWithDimensions
  // options: {} = {
  // }
): any => {
  class ElementWithEvents extends Element {
    constructor() {
      super();
      // this.createEvent = this.createEvent.bind(this);
      this._resetEventHandler = this._resetEventHandler.bind(this);
    }

    get implements(): Array<keyof typeof Registry> {
      return super.implements.concat(Registry.withEventBinder);
    }

    connectedCallback() {
      this.addEventListener("error", (e) => {
        console.error(e);
      });
      this.addEventListener("click", this._resetEventHandler);
      super.connectedCallback();
    }

    disconnectedCallback() {
      this.removeEventListener("click", this._resetEventHandler);
      super.disconnectedCallback();
    }

    _resetEventHandler(e) {
      if (!e.target.closest(".feature")) {
        this.dispatchEvent(ElementWithEvents.createEvent("reset", null, true));
      }
    }

    static createEvent(
      type: "click" | "mouseover" | "mouseout",
      feature = null,
      withHighlight = false,
      withId = false,
      start,
      end,
      target
    ) {
      // Variation features have a different shape
      if (feature) {
        // eslint-disable-next-line no-param-reassign
        feature = feature.feature ? feature.feature : feature;
      }
      const detail = {
        eventtype: type,
        coords: ElementWithEvents._getClickCoords(),
        feature,
        target,
        highlight: undefined,
      };
      if (withHighlight) {
        if (feature && feature.fragments) {
          detail.highlight = feature.fragments
            .map((fr) => `${fr.start}:${fr.end}`)
            .join(",");
        } else if (d3Event && d3Event.shiftKey && this._highlight) {
          // If holding shift, add to the highlights
          detail.highlight = `${this._highlight},${start}:${end}`;
        } else {
          detail.highlight = start && end ? `${start}:${end}` : null;
        }
      }
      if (withId) {
        detail.selectedid = feature && feature.protvistaFeatureId;
      }
      return new CustomEvent("change", {
        detail,
        bubbles: true,
        cancelable: true,
      });
    }

    // eslint-disable-next-line class-methods-use-this
    bindEvents(feature, element) {
      feature
        .on("mouseover", (f, i, group) => {
          element.dispatchEvent(
            ElementWithEvents.createEvent(
              "mouseover",
              f,
              element._highlightEvent === "onmouseover",
              false,
              f.start,
              f.end,
              group[i]
            )
          );
        })
        .on("mouseout", () => {
          element.dispatchEvent(
            ElementWithEvents.createEvent(
              "mouseout",
              null,
              element._highlightEvent === "onmouseover"
            )
          );
        })
        .on("click", (f, i, group) => {
          element.dispatchEvent(
            ElementWithEvents.createEvent(
              "click",
              f,
              element._highlightEvent === "onclick",
              true,
              f.start,
              f.end,
              group[i]
            )
          );
        });
    }

    static _getClickCoords() {
      if (!d3Event) {
        return null;
      }
      // const boundingRect = this.querySelector("svg").getBoundingClientRect();
      // Note: it would be nice to also return the position of the bottom left of the feature
      return [d3Event.pageX, d3Event.pageY];
    }
  }
  return ElementWithEvents;
};

export default withEventBinder;
