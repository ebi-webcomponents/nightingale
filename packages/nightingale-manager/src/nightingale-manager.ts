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
                if (attributes.indexOf("type") !== -1) throw new Error("'type' can't be used as a protvista attribute");
                if (attributes.indexOf("value") !== -1) throw new Error("'value' can't be used as a protvista attribute");
                const mapToReturn = new Map(attributes.filter((attr: string) => !NightingaleManager.observedAttributes.includes(attr)).map((attr: string) => [attr, null]));
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
        document.addEventListener("click", this.handleDocumentClick.bind(this));
        this.style.display = "unset";
    }

    override attributeChangedCallback(attr: string, previousValue: string | null, newValue: string | null) {
        super.attributeChangedCallback(attr, previousValue, newValue);
        this.applyAttributes();
    }

    applyAttributes() {
        this.protvistaElements.forEach((element: HTMLElement) => {
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
        });
    }

    register(element: NightingaleElement) {
        this.protvistaElements.add(element);
        this.applyAttributes();
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
        return [...this["reflected-attributes"].keys()].includes(attributeName) || NightingaleManager.observedAttributes.includes(attributeName);
    }

    // This function is the click listener for the entire document - responsible for closing tooltips and de-highlighting
    handleDocumentClick(event: MouseEvent) {
        const isClickInsideFeatureOrTooltip = event.composedPath().some((element) => {
            const el = element as HTMLElement;
            return el.classList?.contains("outer-rectangle") || (el.nodeType === Node.ELEMENT_NODE && (el as HTMLElement).closest("nightingale-tooltip"));
        });

        // If click occurs outside of tooltip or feature track, remove and de-highlight
        if (!isClickInsideFeatureOrTooltip) {
            const tooltip = this.querySelector("nightingale-tooltip");
            if (tooltip) {
                const tooltipElement = tooltip.shadowRoot?.querySelector(".tooltip");
                if (tooltipElement && !tooltipElement.contains(event.target as Node)) {
                    (tooltip as any).hideTooltip();
                    this.highlight = "null";
                    this.applyAttributes();
                }
            }
        }
    }

    handleTrackClick(event: CustomEvent) {
        if (event.detail?.eventType === "click") {
            event.stopPropagation(); // Prevent event from bubbling up to document
            const tooltip = this.querySelector("nightingale-tooltip");

            if (!tooltip) {
                console.error("Tooltip element not found in the DOM.");
                return;
            }

            const [x, y] = event.detail.coords;

            // Ensure `showTooltip` exists on the element
            if (typeof (tooltip as any).showTooltip === "function") {
                let feature = event.detail.feature;
                if (feature) {
                    (tooltip as any).showTooltip(
                        x,
                        y,
                        {
                            description: feature.description || "Random description",
                            evidence: feature.evidence || "Random evidence",
                        },
                        feature.accession
                    );

                    this.highlight = event.detail.highlight;
                }
            } else {
                console.error("Tooltip element does not have a showTooltip method.");
            }
        }
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
                this.handleTrackClick(e);
                this.applyAttributes();
        }
    }
}

export default NightingaleManager;
