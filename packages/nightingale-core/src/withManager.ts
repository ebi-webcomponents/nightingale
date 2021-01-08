import NightingaleBaseElement from "./nightingale-base-element";
import Registry from "./registryWith";

const withManager = (Element: typeof NightingaleBaseElement): any => {
  class ElementWithManager extends Element {
    #manager: HTMLElement;

    get implements(): Array<keyof typeof Registry> {
      return super.implements.concat(Registry.withManager);
    }

    connectedCallback() {
      if (((this as unknown) as HTMLElement).closest("nightingale-manager")) {
        this.#manager = ((this as unknown) as HTMLElement).closest(
          "nightingale-manager"
        );
        (this.#manager as any).register(this);
      }
      super.connectedCallback();
    }

    disconnectedCallback() {
      if (this.#manager) {
        (this.#manager as any).unregister(this);
      }
      super.disconnectedCallback();
    }
  }
  return ElementWithManager;
};
export default withManager;
