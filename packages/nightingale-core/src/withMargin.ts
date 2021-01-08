// eslint-disable-next-line max-classes-per-file
// import NightingaleBaseElement from "./nightingale-base-element";
import Registry from "./registryWith";
import NightingaleBaseElement from "./nightingale-base-element";

const sides = ["left", "right", "top", "bottom"];
const marginSides = sides.map((side) => `margin${side}`);

export interface WithMarginI {
  margin: MarginType;
}

type MarginType = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

const withMargin = (
  Element: typeof NightingaleBaseElement,
  options: {
    initialValue: MarginType;
  } = {
    initialValue: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  }
): any => {
  class ElementWithMargin extends Element implements WithMarginI {
    margin: MarginType;

    constructor() {
      super();
      this.margin = options.initialValue;
    }

    get implements(): Array<keyof typeof Registry> {
      return super.implements.concat(Registry.withMargin);
    }

    get dependencies(): Array<keyof typeof Registry> {
      return super.dependencies.concat(Registry.withDimensions);
    }

    static get observedAttributes() {
      return [...super.observedAttributes, ...marginSides];
    }

    getWidthWithMargins() {
      return (this as any).width
        ? (this as any).width - this.margin.left - this.margin.right
        : 0;
    }

    attributeChangedCallback(
      name: string,
      oldValue: string,
      newValue: string
    ): void {
      if (oldValue !== newValue) {
        if (marginSides.includes(name)) {
          (this as any)[name] = newValue;
        }
      }
      super.attributeChangedCallback(name, oldValue, newValue);
    }
  }
  for (const side of sides) {
    Object.defineProperty(ElementWithMargin.prototype, `margin${side}`, {
      get() {
        return this.margin[side] || 0;
      },
      set(value) {
        this.margin[side] = +value;
      },
    });
  }
  return ElementWithMargin;
};

export default withMargin;
