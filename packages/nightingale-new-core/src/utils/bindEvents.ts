import { BaseType, Selection } from "d3";
import { WithHighlightInterface } from "../mixins/withHighlight";
import NightingaleBaseElement from "../nightingale-base-element";

export const HIGHLIGHT_EVENT = "highlight-event";

type EventType = "click" | "mouseover" | "mouseout" | "reset";

type FeatureData = {
  accession: string;
  feature?: FeatureData | null;
  fragments?: Array<{
    start: number;
    end: number;
  }>;
  start?: number;
  end?: number;
};
type SequenceBaseData = {
  position: number;
  aa: string;
};
type BoxplotData = {
  type: "boxplot";
  /** Position in the sequence */
  position: number;
  /** Data for the boxplot at this position from all datasets (one item for each dataset) */
  data: Array<{
    /** Common properties of the whole dataset */
    dataset: {
      name: string;
      color: string;
    };
    /** Boxplot data at this position */
    datum: {
      /** Position in the sequence */
      position: number;
      /** All values of the independent variable at this position */
      values: Float32Array;
      median: number;
      boxLow: number;
      boxHigh: number;
      whiskerLow: number;
      whiskerHigh: number;
      minimum: number;
      maximum: number;
      outliersLow: Float32Array;
      outliersHigh: Float32Array;
    } | undefined;
  }>;
  /** Index into `data`, indicates which dataset is being pointed at */
  datasetIndex: number;
};

type EventDetail = {
  eventType: EventType;
  coords: null | [number, number];
  feature?: FeatureData | SequenceBaseData | BoxplotData | null;
  target?: HTMLElement;
  highlight?: string;
  selectedId?: string | null;
  parentEvent?: Event;
};

export function createEvent(
  type: EventType,
  feature: FeatureData | SequenceBaseData | BoxplotData | null = null,
  withHighlight = false,
  withId = false,
  start?: number,
  end?: number,
  target?: HTMLElement,
  event?: Event,
  element?: NightingaleBaseElement & WithHighlightInterface
): Event {
  // Variation features have a different shape
  if (feature) {
    // eslint-disable-next-line no-param-reassign
    feature = (feature as FeatureData)?.feature || feature;
  }

  const detail: EventDetail = {
    eventType: type,
    feature,
    target,
    parentEvent: event,
    coords:
      event && "pageX" in event && "pageY" in event
        ? [event.pageX as number, event.pageY as number]
        : null,
  };
  if (withHighlight) {
    if ((feature as FeatureData)?.fragments) {
      detail.highlight = ((feature as FeatureData)?.fragments || [])
        .map((fr) => `${fr.start}:${fr.end}`)
        .join(",");
    } else if ((event as KeyboardEvent)?.shiftKey && element?.highlight) {
      // If holding shift, add to the highlights
      detail.highlight = `${element.highlight},${start}:${end}`;
    } else {
      detail.highlight = start && end ? `${start}:${end}` : undefined;
    }
  }
  if (withId) {
    detail.selectedId = (feature as FeatureData)?.accession;
  }
  return new CustomEvent("change", {
    detail,
    bubbles: true,
    cancelable: true,
  });
}

export default function bindEvents<T extends BaseType>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  feature: Selection<T, any, any, any>,
  element: NightingaleBaseElement
) {
  feature
    .on("mouseover", function (event: Event, datum: unknown) {
      element.dispatchEvent(
        createEvent(
          "mouseover",
          datum as FeatureData | SequenceBaseData,
          element.getAttribute(HIGHLIGHT_EVENT) === "onmouseover",
          false,
          (datum as FeatureData).start ?? (datum as SequenceBaseData).position,
          (datum as FeatureData).end ?? (datum as SequenceBaseData).position,
          this as unknown as HTMLElement,
          event
        )
      );
    })
    .on("mouseout", () => {
      element.dispatchEvent(
        createEvent(
          "mouseout",
          null,
          element.getAttribute(HIGHLIGHT_EVENT) === "onmouseover"
        )
      );
    })
    .on("click", function (event: Event, datum: unknown) {
      element.dispatchEvent(
        createEvent(
          "click",
          datum as FeatureData | SequenceBaseData,
          element.getAttribute(HIGHLIGHT_EVENT) === "onclick",
          true,
          (datum as FeatureData).start ?? (datum as SequenceBaseData).position,
          (datum as FeatureData).end ?? (datum as SequenceBaseData).position,
          this as unknown as HTMLElement,
          event,
          element as NightingaleBaseElement & WithHighlightInterface
        )
      );
    });
}
