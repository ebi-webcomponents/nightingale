import { event as d3Event } from "d3";

import Registry from "./registryWith";
import { ElementWithDimensions } from "./withDimensions";

type EventType = "click" | "mouseover" | "mouseout" | "reset";
interface FeatureI {
  feature?: FeatureI;
  fragments?: Array<{
    start: number;
    end: number;
  }>;
  start?: number;
  end?: number;
}
interface detailI {
  eventtype: EventType;
  coords: null | [number, number];
  feature?: FeatureI;
  target?: HTMLElement;
  highlight?: string;
  selectedid?: string;
}
const withEventBinder = (
  Element: typeof ElementWithDimensions
  // options: {} = {
  // }
): any => {
  class ElementWithEvents extends Element {
    constructor() {
      super();
      // this.createEvent = this.createEvent.bind(this);
      this.resetEventHandler = this.resetEventHandler.bind(this);
    }

    get implements(): Array<keyof typeof Registry> {
      return super.implements.concat(Registry.withEventBinder);
    }

    connectedCallback() {
      this.addEventListener("error", (e) => {
        console.error(e);
      });
      this.addEventListener("click", this.resetEventHandler);
      super.connectedCallback();
    }

    disconnectedCallback() {
      this.removeEventListener("click", this.resetEventHandler);
      super.disconnectedCallback();
    }

    private resetEventHandler(e: Event): void {
      if (!(e.target as Element).closest(".feature")) {
        this.dispatchEvent(ElementWithEvents.createEvent("reset", null, true));
      }
    }

    static createEvent(
      type: EventType,
      feature: FeatureI = null,
      withHighlight = false,
      withId = false,
      start?: number,
      end?: number,
      target?: HTMLElement
    ): Event {
      // Variation features have a different shape
      if (feature) {
        // eslint-disable-next-line no-param-reassign
        feature = feature.feature ? feature.feature : feature;
      }
      const detail: detailI = {
        eventtype: type,
        coords: ElementWithEvents._getClickCoords(),
        feature,
        target,
      };
      if (withHighlight) {
        if (feature && feature.fragments) {
          detail.highlight = feature.fragments
            .map((fr) => `${fr.start}:${fr.end}`)
            .join(",");
        } else if (d3Event && d3Event.shiftKey && this.highlight) {
          // If holding shift, add to the highlights
          detail.highlight = `${this.highlight},${start}:${end}`;
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
    bindEvents(feature: any, element: HTMLElement) {
      feature
        .on(
          "mouseover",
          (f: FeatureI, i: number, group: Array<HTMLElement>) => {
            element.dispatchEvent(
              ElementWithEvents.createEvent(
                "mouseover",
                f,
                element.highlightEvent === "onmouseover",
                false,
                f.start,
                f.end,
                group[i]
              )
            );
          }
        )
        .on("mouseout", () => {
          element.dispatchEvent(
            ElementWithEvents.createEvent(
              "mouseout",
              null,
              element.highlightEvent === "onmouseover"
            )
          );
        })
        .on("click", (f: FeatureI, i: number, group: Array<HTMLElement>) => {
          element.dispatchEvent(
            ElementWithEvents.createEvent(
              "click",
              f,
              element.highlightEvent === "onclick",
              true,
              f.start,
              f.end,
              group[i]
            )
          );
        });
    }

    static _getClickCoords(): null | [number, number] {
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
