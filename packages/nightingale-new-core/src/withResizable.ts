import NightingaleBaseElement, {
  Constructor,
} from "./nightingale-base-element";
import withDimensions from "./withDimensions";

const withResizable = <T extends Constructor<NightingaleBaseElement>>(
  superClass: T
) => {
  class WithResizable extends withDimensions(superClass) {
    #observer?: ResizeObserver;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...rest: any[]) {
      super(...rest);
      this.onResize = this.onResize.bind(this);
      this.listenForResize = this.listenForResize.bind(this);
    }

    connectedCallback() {
      this.listenForResize();
      super.connectedCallback();
    }
    disconnectedCallback() {
      if (this.#observer) {
        this.#observer.unobserve(this);
      }
      super.disconnectedCallback();
    }

    private onResize() {
      this.width = this.offsetWidth;
    }

    private listenForResize() {
      this.#observer = new ResizeObserver(this.onResize);
      this.#observer.observe(this);
    }
  }
  return WithResizable as T;
};

export default withResizable;
