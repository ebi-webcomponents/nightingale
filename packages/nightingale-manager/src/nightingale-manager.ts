import { customElement, property, state } from "lit/decorators.js";
import NightingaleElement from "@nightingale-elements/nightingale-new-core";

@customElement("nightingale-manager")
class NightingaleManager extends NightingaleElement {
  @property({
    attribute: "reflected-attributes",
    converter: {
      fromAttribute: (reflectedAttributesString): Map<string, null> | null => {
        if (!reflectedAttributesString) {
          return null;
        }
        const reflectedAttributes = reflectedAttributesString.split(",");
        if (reflectedAttributes.includes("type"))
          throw new Error("'type' can't be used as a Nightingale attribute");
        if (reflectedAttributes.includes("value"))
          throw new Error("'value' can't be used as a Nightingale attribute");
        return new Map(
          reflectedAttributes
            .filter(
              (attr: string) =>
                !NightingaleManager.observedAttributes.includes(attr)
            )
            .map((attr: string) => [attr, null])
        );
      },
    },
  })
  "reflectedAttributes"?: Map<string, null> = new Map();

  @property({ type: Number })
  length?: number;

  @property({ type: Number })
  "display-start"?: number;

  @property({ type: Number })
  "display-end"?: number;

  @property({ type: String })
  "highlight"?: string;

  @state()
  htmlElements = new Set<HTMLElement>();

  @state()
  propertyValues = new Map<string, string>();

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener("change", this.changeListener as EventListener);
    this.style.display = "block"; // check wherever we have a manager
  }

  override attributeChangedCallback(
    attr: string,
    previousValue: string | null,
    newValue: string | null
  ) {
    super.attributeChangedCallback(attr, previousValue, newValue);
    this.applyAttributes();
  }

  applyAttributes() {
    this.htmlElements.forEach((element: HTMLElement) =>
      this.applyAttributesOnElement(element)
    );
  }

  private applyAttributesOnElement(element: HTMLElement): void {
    this.reflectedAttributes?.forEach((value, type) => {
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
    this.htmlElements.add(element);
    this.applyAttributesOnElement(element);
  }

  unregister(element: NightingaleElement) {
    this.htmlElements.delete(element);
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
      this.htmlElements.forEach((element: HTMLElement) => {
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
    if (!this.reflectedAttributes) {
      return false;
    }
    return (
      [...this.reflectedAttributes.keys()].includes(attributeName) ||
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
          this.reflectedAttributes?.set(e.detail.type, e.detail.value);
        }
        Object.keys(e.detail).forEach((key) => {
          if (this.isRegisteredAttribute(key)) {
            this.reflectedAttributes?.set(key, e.detail[key]);
          }
        });
        this.applyAttributes();
    }
  }
}

export default NightingaleManager;
