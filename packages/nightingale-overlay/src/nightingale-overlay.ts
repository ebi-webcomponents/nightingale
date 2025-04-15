import { html, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import NightingaleElement from "@nightingale-elements/nightingale-new-core";

@customElement("nightingale-overlay")
class NightingaleOverlay extends NightingaleElement {
  @property({ type: String })
  for?: string = "";
  @property({ type: String })
  label?: string = "Use [CTRL] + scroll to zoom";

  private overlay?: HTMLDivElement;

  private ticking = false;
  private over = false;
  private sizeObserver?: ResizeObserver;
  private currentTarget: HTMLElement | null = null;

  refreshOverlay() {
    if (!this.currentTarget || !this.overlay) return;
    const { height, width } = this.currentTarget.getBoundingClientRect();
    this.overlay.style.height = `${height}px`;
    this.overlay.style.width = `${width}px`;
    this.overlay.style.top = `${this.currentTarget.offsetTop}px`;
    this.overlay.style.left = `${this.currentTarget.offsetLeft}px`;
  }

  observeSizeChangeOfTarget() {
    if (!this.currentTarget) return;
    this.sizeObserver = new ResizeObserver(this.refreshOverlay);
    this.sizeObserver.observe(this.currentTarget);
    this.sizeObserver.observe(document.body);
  }

  override connectedCallback() {
    super.connectedCallback();
    if (this.for as string) {
      this.currentTarget = document.getElementById(this.for as string);
    }
    this.addEventListeners();
  }

  override disconnectedCallback() {
    this.removeEventListeners();
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("for")) {
      this.removeEventListeners();
      this.currentTarget = document.getElementById(this.for as string);
      this.addEventListeners();
    }
  }

  addEventListeners() {
    this.observeSizeChangeOfTarget();
    this.currentTarget?.addEventListener("mouseover", this.handleMouseOver);
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("wheel", this.handleWheel);
  }

  removeEventListeners() {
    if (this.sizeObserver) {
      this.sizeObserver.disconnect();
    }
    this.currentTarget?.removeEventListener("mouseover", this.handleMouseOver);
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("wheel", this.handleWheel);
  }

  getOffsetTop(element: HTMLElement): number {
    if (element === null || element.offsetParent === null) return 0;
    return (
      element.offsetTop + this.getOffsetTop(element.offsetParent as HTMLElement)
    );
  }

  getOffsetLeft(element: HTMLElement): number {
    if (element === null || element.offsetParent === null) return 0;
    return (
      element.offsetLeft +
      this.getOffsetLeft(element.offsetParent as HTMLElement)
    );
  }

  override render() {
    const rect = this.currentTarget?.getBoundingClientRect();
    return html` <div
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: ${this.currentTarget?.offsetTop || 0}px;
        left: ${this.currentTarget?.offsetLeft || 0}px;
        height: ${rect?.height || 0}px;
        width: ${rect?.width || 0}px;
        background: rgba(0,0,0,0.3);
        pointer-events: none;
        visibility: hidden;
      "
    >
      <header
        style="
          text-align: center;
          color: white;
          font-size: 1.3em;
          text-shadow: 1px 1px 1px darkslategrey;
        "
      >
        ${this.label}
      </header>
    </div>`;
  }

  override updated() {
    this.overlay = this.getElementsByTagName("div")[0];
    this.ticking = false;
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey) {
      if (this.overlay) this.overlay.style.visibility = "hidden";
    }
  };

  handleKeyUp = (event: KeyboardEvent) => {
    if (event.ctrlKey) {
      if (this.overlay) this.overlay.style.display = "block";
    }
  };

  handleMouseOver = (event: MouseEvent) => {
    const { pageX, pageY } = event;
    if (this.currentTarget) {
      const { height, width } = this.currentTarget.getBoundingClientRect();
      const offsetTop = this.getOffsetTop(this.currentTarget);
      const offsetLeft = this.getOffsetLeft(this.currentTarget);
      if (
        pageX > offsetLeft &&
        pageX < offsetLeft + width &&
        pageY > offsetTop &&
        pageY < offsetTop + height
      ) {
        this.over = true;
      } else {
        this.over = false;
        if (this.overlay) this.overlay.style.visibility = "hidden";
      }
    }
  };

  handleWheel = (event: WheelEvent) => {
    if (!this.ticking && this.over && Math.abs(event.deltaX) < Math.abs(event.deltaY)) {
      window.requestAnimationFrame(() => {
        if (this.overlay)
          this.overlay.style.visibility = event.ctrlKey ? "hidden" : "visible";
        this.ticking = false;
      });
      this.ticking = true;
    }
  };
}

export default NightingaleOverlay;
