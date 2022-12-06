import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import NightingaleElement from "@nightingale-elements/nightingale-new-core";

@customElement("nightingale-overlay")
class NightingaleOverlay extends NightingaleElement {
  @property({ type: String })
  for = "";
  @property({ type: String })
  label = "Use [CTRL] + scroll to zoom";

  private overlay?: HTMLDivElement;

  private ticking = false;
  private over = false;
  private sizeObserver?: ResizeObserver;

  refreshOverlay(elementId: string) {
    const target = document.getElementById(elementId);
    return () => {
      if (!target || !this.overlay) return;
      const { height, width } = target.getBoundingClientRect();
      this.overlay.style.height = `${height}px`;
      this.overlay.style.width = `${width}px`;
      this.overlay.style.top = `${target.offsetTop}px`;
      this.overlay.style.left = `${target.offsetLeft}px`;
    };
  }

  observeSizeChangeOfTarget() {
    const target = document.getElementById(this.for);
    if (!target) return;
    this.sizeObserver = new ResizeObserver(this.refreshOverlay(this.for));
    this.sizeObserver.observe(target);
    this.sizeObserver.observe(document.body);
  }

  disconnectedCallback() {
    if (this.sizeObserver) {
      this.sizeObserver.disconnect();
    }
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

  render() {
    const target = document.getElementById(this.for);
    if (target) {
      const { height, width } = target.getBoundingClientRect();
      return html` <div
        style="
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: ${target.offsetTop}px;
        left: ${target.offsetLeft}px;
        height: ${height}px;
        width: ${width}px;
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
  }
  updated() {
    const target = document.getElementById(this.for);
    if (target) {
      this.observeSizeChangeOfTarget();

      this.overlay = this.getElementsByTagName("div")[0];
      this.ticking = false;

      document.addEventListener("mouseover", ({ pageX, pageY }) => {
        const { height, width } = target.getBoundingClientRect();
        const offsetTop = this.getOffsetTop(target);
        const offsetLeft = this.getOffsetLeft(target);
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
      });
      window.addEventListener("keydown", (event) => {
        if (event.ctrlKey) {
          if (this.overlay) this.overlay.style.visibility = "hidden";
        }
      });
      window.addEventListener("keyup", (event) => {
        if (event.ctrlKey) {
          if (this.overlay) this.overlay.style.display = "block";
        }
      });
      window.addEventListener("wheel", (event) => {
        if (!this.ticking && this.over) {
          window.requestAnimationFrame(() => {
            if (this.overlay)
              this.overlay.style.visibility = event.ctrlKey
                ? "hidden"
                : "visible";
            this.ticking = false;
          });
          this.ticking = true;
        }
      });
    }
  }
}

export default NightingaleOverlay;
