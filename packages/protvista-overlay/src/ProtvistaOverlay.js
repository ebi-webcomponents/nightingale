import ResizeObserver from "resize-observer-polyfill";

class ProtvistaOverlay extends HTMLElement {
  connectedCallback() {
    this.for = this.getAttribute("for");
    this.renderWhenForElementIsReady();
  }

  static get observedAttributes() {
    return ["for"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === "for") {
        this.for = newValue;
      }
      this.renderWhenForElementIsReady();
    }
  }

  refreshOverlay(elementId) {
    const target = document.getElementById(elementId);
    return () => {
      if (!target) return;
      const { height, width } = target.getBoundingClientRect();
      this.overlay.style.height = `${height}px`;
      this.overlay.style.width = `${width}px`;
      this.overlay.style.top = `${target.offsetTop}px`;
      this.overlay.style.left = `${target.offsetLeft}px`;
    };
  }

  observeSizeChangeOfTarget() {
    const target = document.getElementById(this.for);
    this.sizeObserver = new ResizeObserver(this.refreshOverlay(this.for));
    this.sizeObserver.observe(target);
    this.sizeObserver.observe(document.body);
  }

  renderWhenForElementIsReady() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.observer = new MutationObserver(() => {
      if (document.getElementById(this.for)) {
        this.render();
        this.observeSizeChangeOfTarget();
        this.observer.disconnect();
      }
    });
    this.observer.observe(document, {
      attributes: false,
      childList: true,
      characterData: false,
      subtree: true
    });
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.sizeObserver) {
      this.sizeObserver.disconnect();
    }
  }

  render() {
    let html = "";
    const target = document.getElementById(this.for);
    if (target) {
      const { height, width } = target.getBoundingClientRect();
      html = `
      <div style="
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
      ">
        <header style="
          text-align: center;
          color: white;
          font-size: 1.3em;
          text-shadow: 1px 1px 1px darkslategrey;
        ">
          Use [CTRL] + scroll to zoom
        </header>
      </div>`;
    }
    this.innerHTML = html;

    // eslint-disable-next-line prefer-destructuring
    this.overlay = this.getElementsByTagName("div")[0];
    this.ticking = false;

    document.addEventListener("mouseover", ({ pageX, pageY }) => {
      const { height, width } = target.getBoundingClientRect();
      if (
        pageX > target.offsetLeft &&
        pageX < target.offsetLeft + width &&
        pageY > target.offsetTop &&
        pageY < target.offsetTop + height
      ) {
        this.over = true;
      } else {
        this.over = false;
        this.overlay.style.visibility = "hidden";
      }
    });
    window.addEventListener("keydown", event => {
      if (event.ctrlKey) {
        this.overlay.style.visibility = "hidden";
      }
    });
    window.addEventListener("keyup", event => {
      if (event.keyCode === 17) {
        this.overlay.style.display = "block";
      }
    });
    window.addEventListener("wheel", event => {
      if (!this.ticking && this.over) {
        window.requestAnimationFrame(() => {
          this.overlay.style.visibility = event.ctrlKey ? "hidden" : "visible";
          this.ticking = false;
        });
        this.ticking = true;
      }
    });
  }
}

export default ProtvistaOverlay;
