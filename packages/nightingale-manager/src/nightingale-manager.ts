import { customElement, property, state } from "lit/decorators.js";
import NightingaleElement from "@nightingale-elements/nightingale-new-core";

@customElement("nightingale-manager")
class NightingaleManager extends NightingaleElement {
  @property({
    converter: {
      fromAttribute: (value): Map<string, null> | null => {
        if (!value) {
          return null;
        }
        const attributes = value.split(",");
        if (attributes.indexOf("type") !== -1)
          throw new Error("'type' can't be used as a protvista attribute");
        if (attributes.indexOf("value") !== -1)
          throw new Error("'value' can't be used as a protvista attribute");
        const mapToReturn = new Map(
          attributes
            .filter(
              (attr: string) =>
                !NightingaleManager.observedAttributes.includes(attr),
            )
            .map((attr: string) => [attr, null]),
        );
        return mapToReturn;
      },
      toAttribute: (value: []) => {
        return value.join(",");
      },
    },
  })
  "reflected-attributes"?: Map<string, null> = new Map();

  @property({ type: Number })
  length?: number;

  @property({ type: Number })
  "display-start"?: number;

  @property({ type: Number })
  "display-end"?: number;

  @property({ type: String })
  "highlight"?: string;

  @state()
  protvistaElements = new Set<HTMLElement>();

  @state()
  propertyValues = new Map<string, string>();

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("change", this.changeListener as EventListener);
    this.style.display = "unset";
  }

  override attributeChangedCallback(
    attr: string,
    previousValue: string | null,
    newValue: string | null,
  ) {
    super.attributeChangedCallback(attr, previousValue, newValue);
    this.applyAttributes();
  }

  applyAttributes() {
    this.protvistaElements.forEach((element: HTMLElement) => this.applyAttributesOnElement(element));
  }

  private applyAttributesOnElement(element: HTMLElement): void {
    this["reflected-attributes"]?.forEach((value, type) => {
      if (value === false || value === null || value === undefined) {
        element.removeAttribute(type);
      } else {
        element.setAttribute(type, typeof value === "boolean" ? "" : value);
      }
    });
    // Default properties
    if (this.length) {
      element.setAttribute("length", `${this.length}`);
    }
    if (this["display-end"]) {
      element.setAttribute("display-end", `${this["display-end"]}`);
    }
    if (this["display-start"]) {
      element.setAttribute("display-start", `${this["display-start"]}`);
    }
    if (this.highlight) {
      element.setAttribute("highlight", this.highlight);
    }
  }

  register(element: NightingaleElement) {
    this.protvistaElements.add(element);
    this.applyAttributesOnElement(element);
  }

  unregister(element: NightingaleElement) {
    this.protvistaElements.delete(element);
  }

  applyProperties(forElementId: string) {
    if (forElementId) {
      const element = this.querySelector(`#${forElementId}`) as HTMLElement;
      if (!element) {
        return;
      }
      this.propertyValues.forEach((value, type) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (element as any)[type] = value;
      });
    } else {
      this.protvistaElements.forEach((element: HTMLElement) => {
        if (!element) {
          return;
        }
        this.propertyValues.forEach((value, type) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (element as any)[type] = value;
        });
      });
    }
  }

  isRegisteredAttribute(attributeName: string) {
    if (!this["reflected-attributes"]) {
      return false;
    }
    return (
      [...this["reflected-attributes"].keys()].includes(attributeName) ||
      NightingaleManager.observedAttributes.includes(attributeName)
    );
  }

  changeListener(e: CustomEvent) {
    if (!e.detail) {
      return;
    }
    switch (e.detail.handler) {
      case "property":
        this.propertyValues.set(e.detail.type, e.detail.value);
        this.applyProperties(e.detail.for);
        break;
      default:
        if (this.isRegisteredAttribute(e.detail.type)) {
          this["reflected-attributes"]?.set(e.detail.type, e.detail.value);
        }
        Object.keys(e.detail).forEach((key) => {
          if (this.isRegisteredAttribute(key)) {
            this["reflected-attributes"]?.set(key, e.detail[key]);
          }
        });
        this.applyAttributes();
    }
  }
}

export default NightingaleManager;
