import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import object2style from "../../utils/object2style";

/**
 * Creates a DOM element with absolute position that can have scrollbars.
 * However, no actual content is displayed by this element.
 */
@customElement("fake-scroll")
class FakeScroll extends LitElement {
  @property({ type: String })
  overflow: "hidden" | "auto" | "scroll" = "auto";
  @property({ type: String })
  overflowX: "hidden" | "auto" | "scroll" | "initial" = "initial";
  @property({ type: String })
  overflowY: "hidden" | "auto" | "scroll" | "initial" = "initial";
  @property({ type: Number })
  width = 0;
  @property({ type: Number })
  height = 0;
  @property({ type: Number })
  fullHeight = 0;
  @property({ type: Number })
  fullWidth = 0;
  @property({ type: String })
  positionX: "top" | "bottom" = "bottom";
  @property({ type: String })
  positionY: "left" | "right" = "right";

  el?: HTMLDivElement | null;

  _x = 0;
  set x(value: number) {
    this._x = Number(value);
    if (this.el) {
      this.el.scrollLeft = this.x;
    }
  }
  @property()
  get x() {
    return this._x;
  }
  _y = 0;
  set y(value: number) {
    this._y = Number(value);
    if (this.el) {
      this.el.scrollTop = this._y;
    }
  }
  @property()
  get y() {
    return this._y;
  }

  onScroll = (e: Event) => {
    const { showX, showY } = this.shouldShow();
    const movement = {
      xMovement: (this.el?.scrollLeft || 0) - (showX ? this.x : 0),
      yMovement: (this.el?.scrollTop || 0) - (showY ? this.y : 0),
    };

    if (movement.xMovement !== 0 || movement.yMovement !== 0)
      this.dispatchEvent(
        new CustomEvent("fake-scroll", {
          bubbles: true,
          detail: {
            movement,
            sourceEvent: e,
          },
        }),
      );
  };

  checkOverflow(
    overflow: "hidden" | "auto" | "scroll",
    { withX = false, withY = false },
  ) {
    let show = false;
    switch (overflow) {
      case "auto":
        if (withX) {
          show = this.fullWidth > this.width;
        }
        if (withY) {
          show = this.fullHeight > this.height;
        }
        break;
      case "hidden":
        show = false;
        break;
      case "scroll":
        show = true;
        break;
      default:
    }
    return show;
  }

  shouldShow() {
    const withX = { withX: true };
    const withY = { withY: true };
    const overflowX =
      this.overflowX === "initial" ? this.overflow : this.overflowX;
    const overflowY =
      this.overflowY === "initial" ? this.overflow : this.overflowY;
    const showX =
      this.checkOverflow(overflowX, withX) &&
      this.checkOverflow(this.overflow, withX);
    const showY =
      this.checkOverflow(overflowY, withY) &&
      this.checkOverflow(this.overflow, withY);
    return { showX, showY };
  }

  override render() {
    const style = {
      position: "absolute",
      "overflow-x": "auto",
      "overflow-y": "auto",
      width: `${this.width}px`,
      height: `${this.height}px`,
      transform: "",
    };
    const { showX, showY } = this.shouldShow();
    const childStyle = {
      height: "1px",
      width: "1px",
    };
    if (!showY && !showX) {
      return html`<div />`;
    }
    if (showX) {
      childStyle.width = `${this.fullWidth}px`;
      style["overflow-x"] = "scroll";
      if (this.positionX === "top") {
        style.transform += "rotateX(180deg)";
      }
    }
    if (showY) {
      childStyle.height = `${this.fullHeight}px`;
      style["overflow-y"] = "scroll";
      if (this.positionY === "left") {
        style.transform += "rotateY(180deg)";
      }
    }
    return html`<div style=${object2style(style)} id="fakescroll">
      <div style=${object2style(childStyle)}></div>
    </div> `;
  }
  protected override updated(): void {
    const fakescroll = this.renderRoot.querySelector("#fakescroll");
    if (fakescroll !== this.el) {
      this.el = fakescroll as HTMLDivElement;
      if (this.el) {
        this.el.addEventListener("scroll", this.onScroll);
      }
    }
  }
}

export default FakeScroll;
