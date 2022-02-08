import { v1 } from "uuid";
import { NightingaleElement } from "data-loader";
import { ProtvistaTrackDatum } from "protvista-track";

type FeaturesAPI = {
  accession: string;
  entryName: string;
  sequence: string;
  sequenceChecksum: string;
  taxid: number;
  features: APIFeature[];
};

type APIFeature = {
  begin: string;
  end: string;
  molecule?: string;
  type?: string;
  category?: string;
  description?: string;
  evidences?: Evidence[];
  ftId?: string;
  alternativeSequence?: string;
};

type Evidence = {
  code: string;
  source?: Source;
};

type Source = {
  name: string;
  id: string;
  url: string;
  alternativeUrl?: string;
};

interface NightingaleElementWithData extends HTMLElement {
  data?: any;
}

interface NightingaleManager extends HTMLElement {
  register: (elt: HTMLElement) => void;
  unregister: (elt: HTMLElement) => void;
}

export const transformData = (data: FeaturesAPI): ProtvistaTrackDatum[] => {
  let transformedData: ProtvistaTrackDatum[] = [];
  const { features } = data;
  if (features && features.length > 0) {
    transformedData = features.map((feature) => {
      return {
        accession: data.accession,
        start: Number(feature.begin),
        end: Number(feature.end),
        type: feature.type,
        data: feature,
        protvistaFeatureId: v1(),
      };
    });
  }
  return transformedData;
};

class ProtvistaFeatureAdapter<
    DataType = ProtvistaTrackDatum[],
    APIDataType = FeaturesAPI
  >
  extends HTMLElement
  implements NightingaleElement
{
  protected _adaptedData: DataType;

  private _filters: string[];

  private _subscribers: string[];

  protected manager: NightingaleManager;

  constructor() {
    super();
    this._adaptedData = [] as unknown as DataType;
  }

  connectedCallback(): void {
    this.subscribers = this.getAttribute("subscribers");
    this._filters = this.getAttribute("filters")
      ? this.getAttribute("filters").split(",")
      : [];
    this._addLoaderListeners();
  }

  set data(data: APIDataType) {
    this._emitEvent(data);
  }

  set subscribers(subscribers: string) {
    if (!subscribers) {
      return;
    }
    this._subscribers = subscribers.split(",");
  }

  get subscribers(): string {
    return this._subscribers?.join(",");
  }

  parseEntry(data: APIDataType): void {
    this._adaptedData = transformData(
      data as unknown as FeaturesAPI
    ) as unknown as DataType;
  }

  filterData(): void {
    if (Array.isArray(this._adaptedData) && this._filters.length > 0) {
      this._adaptedData = this._adaptedData.filter((d) => {
        return this._filters.includes(d.data.type);
      }) as unknown as DataType;
    }
  }

  get adaptedData(): DataType {
    return this._adaptedData;
  }

  _setSubscriberData(): void {
    this._subscribers.forEach((subscriberId) => {
      const subscriberElt =
        document.querySelector<NightingaleElementWithData>(subscriberId);
      if (subscriberElt) {
        subscriberElt.data = this._adaptedData;
      } else {
        console.error(`Element with id '${subscriberId}' not found`);
      }
    });
  }

  _emitEvent(data: APIDataType): void {
    this.parseEntry(data);
    this.filterData();
    if (this.subscribers) {
      this._setSubscriberData();
    }
    this.dispatchEvent(
      new CustomEvent("load", {
        detail: {
          payload: this._adaptedData,
        },
        bubbles: true,
        cancelable: true,
      })
    );
  }

  _addLoaderListeners(): void {
    this.addEventListener("load", (e: CustomEvent) => {
      if (e.target !== this) {
        e.stopPropagation();
        try {
          if (e.detail.payload.errorMessage) {
            throw e.detail.payload.errorMessage;
          }
          this._emitEvent(e.detail.payload);
        } catch (error) {
          this.dispatchEvent(
            new CustomEvent("error", {
              detail: error,
              bubbles: true,
              cancelable: true,
            })
          );
        }
      }
    });
  }

  static get is(): string {
    return "protvista-feature-adapter";
  }
}

export default ProtvistaFeatureAdapter;
