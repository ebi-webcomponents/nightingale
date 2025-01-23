import NightingaleBaseElement, {
  Constructor,
} from "../../nightingale-base-element";

const withManager = <T extends Constructor<NightingaleBaseElement>>(
  superClass: T,
) => {
  class WithManager extends superClass {
    manager?: HTMLElement | null;

    override connectedCallback() {
      if (this.closest("nightingale-manager")) {
        customElements.whenDefined("nightingale-manager").then(() => {
          this.manager = this.closest("nightingale-manager");
          if (this.manager) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.manager as any).register(this);
          }
        });
      }
      super.connectedCallback();
    }

    override disconnectedCallback() {
      if (this.manager) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.manager as any).unregister(this);
      }
      super.disconnectedCallback();
    }
  }
  return WithManager as T;
};

export default withManager;
