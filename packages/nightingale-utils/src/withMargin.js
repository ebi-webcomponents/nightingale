/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-body-style */
const sides = ["left", "right", "top", "bottom"];
const marginSides = sides.map((side) => `margin${side}`);

const withMargin = (
  Element,
  options = {
    initialValue: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  }
) => {
  // class ElementWithMargin extends Element {
  //   constructor() {
  //     super();
  //     this.margin = options.initialValue;
  //   }

  //   static get observedAttributes() {
  //     return [...super.observedAttributes, ...marginSides];
  //   }

  //   attributeChangedCallback(name, oldValue, newValue) {
  //     if (oldValue !== newValue) {
  //       if (marginSides.includes(name)) {
  //         this[name] = newValue;
  //       }
  //     }
  //     super.attributeChangedCallback(name, oldValue, newValue);
  //   }
  // }
  // for (const side of sides) {
  //   Object.defineProperty(ElementWithMargin.prototype, `margin${side}`, {
  //     get() {
  //       return this.margin[side] || 0;
  //     },
  //     set(value) {
  //       this.margin[side] = +value;
  //     },
  //   });
  // }
  // return ElementWithMargin;
  return Element;
};

export default withMargin;
