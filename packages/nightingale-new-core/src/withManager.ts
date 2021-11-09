import NightingaleBaseElement, {
  Constructor,
} from "./nightingale-base-element";

const withManager = <T extends Constructor<NightingaleBaseElement>>(
  superClass: T
) => {
  class WithManager extends superClass {
    #manager: HTMLElement;

    connectedCallback() {
      if (this.closest("nightingale-manager")) {
        this.#manager = this.closest("nightingale-manager");
        if (this.#manager) {
          (this.#manager as any).register(this);
        }
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
  return WithManager as T;
};

export default withManager;
