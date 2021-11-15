import { customElement, property, state } from "lit/decorators.js";
import NightingaleElement from "@nightingale-elements/nightingale-new-core";

@customElement("nightingale-manager")
class NightingaleManager extends NightingaleElement {
  @property({
    converter: (value) => {
      if (!value) {
        return;
      }
      const attributes = value.split(" ");
      if (attributes.indexOf("type") !== -1)
        throw new Error("'type' can't be used as a protvista attribute");
      if (attributes.indexOf("value") !== -1)
        throw new Error("'value' can't be used as a protvista attribute");
      return new Map(
        attributes
          .filter(
            (attr: string) =>
              !NightingaleManager.observedAttributes.includes(attr)
          )
          .map((attr: string) => [attr, null])
      );
    },
  })
  name = "attributes";

  @property({ type: Number })
  length = "length";

  @property({ type: Number })
  displayStart = "displaystart";

  @property({ type: Number })
  displayEnd = "displayend";

  @property()
  highlight = "highlight";

  @state()
  protvistaElements = new Set();

  @state()
  propertyValues = new Map();

  // attributeChangedCallback(name, oldValue, newValue) {
  //   if (oldValue !== newValue) {
  //     if (name === "attributes") {
  //       this._attributes = newValue.split(" ");
  //       if (this._attributes.indexOf("type") !== -1)
  //         throw new Error("'type' can't be used as a protvista attribute");
  //       if (this._attributes.indexOf("value") !== -1)
  //         throw new Error("'value' can't be used as a protvista attribute");
  //       this.attributeValues = new Map(
  //         this._attributes
  //           .filter(
  //             (attr) => !NightingaleManager.observedAttributes.includes(attr)
  //           )
  //           .map((attr) => [attr, null])
  //       );
  //     } else {
  //       if (name === LENGTH) {
  //         this.length = newValue;
  //       }
  //       if (name === DISPLAY_START) {
  //         this.displaystart = newValue;
  //       }
  //       if (name === DISPLAY_END) {
  //         this.displayend = newValue;
  //       }
  //       if (name === HIGHLIGHT) {
  //         this.highlight = newValue;
  //       }
  //     }
  //     this.applyAttributes();
  //   }
  // }

  register(element: NightingaleElement) {
    this.protvistaElements.add(element);
    // this.applyAttributes();
  }

  unregister(element: NightingaleElement) {
    this.protvistaElements.delete(element);
  }

  // applyAttributes() {
  //   this.protvistaElements.forEach((element) => {
  //     this.attributeValues.forEach((value, type) => {
  //       if (value === false || value === null || value === undefined) {
  //         element.removeAttribute(type);
  //       } else {
  //         element.setAttribute(type, typeof value === "boolean" ? "" : value);
  //       }
  //     });
  //   });
  // }

  // applyProperties(forElementId) {
  //   if (forElementId) {
  //     const element = this.querySelector(`#${forElementId}`);
  //     this.propertyValues.forEach((value, type) => {
  //       element[type] = value;
  //     });
  //   } else {
  //     this.protvistaElements.forEach((element) => {
  //       this.propertyValues.forEach((value, type) => {
  //         /* eslint-disable no-param-reassign */
  //         element[type] = value;
  //       });
  //     });
  //   }
  // }

  // isRegisteredAttribute(attributeName: string) {
  //   return (
  //     [...this.attributes.keys()].includes(attributeName) ||
  //     NightingaleManager.observedAttributes.includes(attributeName)
  //   );
  // }

  // _changeListener(e) {
  //   if (!e.detail) {
  //     return;
  //   }
  //   switch (e.detail.handler) {
  //     case "property":
  //       this.propertyValues.set(e.detail.type, e.detail.value);
  //       this.applyProperties(e.detail.for);
  //       break;
  //     default:
  //       if (this.isRegisteredAttribute(e.detail.type)) {
  //         this.attributes.set(e.detail.type, e.detail.value);
  //       }
  //       Object.keys(e.detail).forEach((key) => {
  //         if (this.isRegisteredAttribute(key)) {
  //           this.attributes.set(key, e.detail[key]);
  //         }
  //       });
  //       this.applyAttributes();
  //   }
  // }

  connectedCallback() {
    //   this.addEventListener("change", this._changeListener);
  }
}

export default NightingaleManager;
