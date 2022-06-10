import NightingaleBaseElement, {
  Constructor,
} from "./nightingale-base-element";

import { Selection } from "d3";

export const HIGHLIGHT_EVENT = "highlight-event";

type EventType = "click" | "mouseover" | "mouseout" | "reset";
interface FeatureInterface {
  feature?: FeatureInterface | null;
  fragments?: Array<{
    start: number;
    end: number;
  }>;
  start?: number;
  end?: number;
  protvistaFeatureId: string;
}
interface detailInterface {
  eventtype: EventType;
  // coords: null | [number, number];
  feature?: FeatureInterface | null;
  target?: HTMLElement;
  highlight?: string;
  selectedid?: string | null;
}

const withNightingaleEvents = <T extends Constructor<NightingaleBaseElement>>(
  superClass: T
) => {
  class WithNightingaleEvents extends superClass {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      this.resetEventHandler = this.resetEventHandler.bind(this);
    }
    private resetEventHandler(e: Event): void {
      if (!(e.target as Element).closest(".feature")) {
        this.dispatchEvent(
          WithNightingaleEvents.createEvent("reset", null, true)
        );
      }
    }

    static createEvent(
      type: EventType,
      feature: FeatureInterface | null = null,
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
      const detail: detailInterface = {
        eventtype: type,
        // TODO: add coordinates
        // coords: WithNightingaleEvents._getClickCoords(),
        feature,
        target,
      };
      if (withHighlight) {
        if (feature && feature.fragments) {
          detail.highlight = feature.fragments
            .map((fr) => `${fr.start}:${fr.end}`)
            .join(",");
          // TODO: Add highlight events
          // } else if (d3Event && d3Event.shiftKey && (this as any).highlight) {
          //   // If holding shift, add to the highlights
          //   detail.highlight = `${(this as any).highlight},${start}:${end}`;
          // } else {
          //   detail.highlight = start && end ? `${start}:${end}` : null;
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
    bindEvents(
      feature: Selection<HTMLElement, unknown, HTMLElement, unknown>,
      element: NightingaleBaseElement
    ) {
      feature
        .on("mouseover", function (event: Event, d: unknown) {
          const e = feature.nodes();
          const i = e.indexOf(this);
          console.log({ THIS: this, d, e, i });
          // TODO: reenable the code above considering the new method signature

          // (f: FeatureInterface, i: number, group: Array<HTMLElement>)
          //   element.dispatchEvent(
          //     WithNightingaleEvents.createEvent(
          //       "mouseover",
          //       f,
          //       element.getAttribute(HIGHLIGHT_EVENT) === "onmouseover",
          //       false,
          //       f.start,
          //       f.end,
          //       group[i]
          //     )
          //   );
        })
        .on("mouseout", () => {
          element.dispatchEvent(
            WithNightingaleEvents.createEvent(
              "mouseout",
              null,
              element.getAttribute(HIGHLIGHT_EVENT) === "onmouseover"
            )
          );
          // })
          // .on(
          //   "click",
          //   (f: FeatureInterface, i: number, group: Array<HTMLElement>) => {
          //     element.dispatchEvent(
          //       WithNightingaleEvents.createEvent(
          //         "click",
          //         f,
          //         element.getAttribute(HIGHLIGHT_EVENT) === "onclick",
          //         true,
          //         f.start,
          //         f.end,
          //         group[i]
          //       )
          //     );
        });
    }
  }
  return WithNightingaleEvents as T;
};

export default withNightingaleEvents;
