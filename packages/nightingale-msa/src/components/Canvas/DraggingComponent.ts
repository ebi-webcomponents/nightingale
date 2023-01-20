import { html } from "lit";
import { property, state } from "lit/decorators.js";
import NightingaleElement, {
  withDimensions,
} from "@nightingale-elements/nightingale-new-core";

import Mouse from "../../utils/mouse";
import { RawPosition } from "../../types/types";

// import FakeScroll from "./FakeScroll";

/**
Provides dragging support in a canvas for sub-classes.
Sub-classes are expected to implement:
- drawScene
- onPositionUpdate(oldPos, newPos)

*/
abstract class DraggingComponent extends withDimensions(NightingaleElement) {
  /**
   * The internal state is kept in:
   *
   * this.mouseMovePosition = [x, y]; // relative to the canvas
   * this.touchMovePosition = [x, y]; // relative to the canvas
   *
   * If no movement is happening, inInDragPhase is undefined
   */
  @property({
    type: Boolean,
    attribute: "disable-dragging",
  })
  disableDragging = false;

  @state()
  mouse = {
    isMouseWithin: false,
    cursorState: "grab",
  };

  protected uniqueId = `msa-${Math.round(Math.random() * 10000)}`;
  protected ctxBuffers: (CanvasRenderingContext2D | null)[] = [];
  protected ctx: CanvasRenderingContext2D | null = null;
  protected canvasBuffers: HTMLCanvasElement[] = [];
  protected container?: HTMLElement | null;
  protected currentContext = 1;

  protected isInDragPhase = false;
  protected mouseHasMoved = false;
  protected mouseMovePosition?: RawPosition = undefined;

  // constructor() {
  //   super();
  //   this.onMouseEnter = this.onMouseEnter.bind(this);
  //   this.onMouseLeave = this.onMouseLeave.bind(this);
  //   this.onMouseDown = this.onMouseDown.bind(this);
  //   this.onMouseUp = this.onMouseUp.bind(this);
  //   this.onMouseMove = this.onMouseMove.bind(this);
  //   this.onTouchStart = this.onTouchStart.bind(this);
  //   this.onTouchMove = this.onTouchMove.bind(this);
  //   this.onTouchEnd = this.onTouchEnd.bind(this);
  //   this.onTouchCancel = this.onTouchCancel.bind(this);

  //   // this.onClick = this.onClick.bind(this);
  //   // this.onDoubleClick = this.onDoubleClick.bind(this);
  //   // this.draw = this.draw.bind(this);
  //   // this.startDragPhase = this.startDragPhase.bind(this);
  //   // this.stopHoverPhase = this.stopHoverPhase.bind(this);
  //   // this.startDragPhase = this.startDragPhase.bind(this);
  //   // this.stopDragPhase = this.stopDragPhase.bind(this);
  // }

  /**
   * Called on every movement to rerender the canvas.
   */
  abstract drawScene(): void;

  /**
   * Called on every position update.
   */
  abstract onPositionUpdate(
    newPosition?: RawPosition,
    oldPosition?: RawPosition
  ): void;

  firstUpdated() {
    this.container = document.getElementById(this.uniqueId);
    this.canvasBuffers = [
      document.getElementById(`${this.uniqueId}-0`) as HTMLCanvasElement,
      document.getElementById(`${this.uniqueId}-1`) as HTMLCanvasElement,
    ];
    this.ctxBuffers = this.canvasBuffers.map(
      (buffer) =>
        buffer.getContext("2d", { alpha: "false" }) as CanvasRenderingContext2D
    );
    // init
    this.swapContexts();
    // this.container?.addEventListener("mouseenter", this.onMouseEnter);
    // this.container?.addEventListener("mouseleave", this.onMouseLeave);
    // this.container?.addEventListener("touchstart", this.onTouchStart);
    // this.container?.addEventListener("touchmove", this.onTouchMove);
    // this.container?.addEventListener("touchend", this.onTouchEnd);
    // this.container?.addEventListener("touchcancel", this.onTouchCancel);
    // this.container?.addEventListener("click", this.onClick);
    // this.container?.addEventListener("dblclick", this.onDoubleClick);
    // if (!this.disableDragging) {
    //   this.container?.addEventListener("mousedown", this.onMouseDown);
    //   this.container?.addEventListener("mouseup", this.onMouseUp);
    //   this.container?.addEventListener("mousemove", this.onMouseMove);
    // }
  }

  /**
   * We buffer the canvas to display and allow to be redrawn while not being visible.
   * Only after it has been drawn, the canvas element will be flipped to a visible state.
   * In other words, we have two canvas elements (1 visible, 1 hidden) and
   * a new `draw` happens on the hidden one. After a `draw` operation these canvas
   * elements are "swapped" by this method.
   *
   * This method swaps the visibility of the DOM nodes and sets `this.ctx`
   * to the hidden canvas.
   */
  swapContexts() {
    const current = this.currentContext;
    // show the pre-rendered buffer
    this.canvasBuffers[current].style.visibility = "visible";

    // and prepare the next one
    const next = (this.currentContext + 1) % 2;
    this.canvasBuffers[next].style.visibility = "hidden";
    this.currentContext = next;
    this.ctx = this.ctxBuffers[next];
  }

  /**
   * Starts a draw operation by essentially:
   * - clearing the current context (the hidden canvas)
   * - calling `drawScene` to render the current canvas
   * - swapping canvas contexts with `swapContexts`
   */
  draw() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.drawScene();
    this.swapContexts();
  }

  /**
  // TODO: should we react do window resizes dynamically?
  onResize = (e) => {
  }
  */

  /**
   * To be implemented by its childs.
   */
  // abstract onClick(e: MouseEvent): void;

  /**
   * To be implemented by its childs.
   */
  // abstract onDoubleClick(e: MouseEvent): void;

  // onMouseDown(e: MouseEvent) {
  //   console.log("mouse down");
  //   this.startDragPhase(e);
  // }

  // onMouseMove(e: MouseEvent | TouchEvent) {
  //   if (!this.isInDragPhase) return;
  //   console.log("mouse move");
  //   this.mouseHasMoved = true;
  //   const pos = Mouse.absolute(e);
  //   // TODO: use global window out and not this container's out for better dragging
  //   //if (!this.isEventWithinComponent(e)) {
  //   //this.stopDragPhase();
  //   //return;
  //   //}
  //   const oldPos = this.mouseMovePosition;
  //   requestAnimationFrame(() => {
  //     // already use the potentially updated mouse move position here
  //     this.mouseMovePosition = pos;
  //     this.onPositionUpdate(oldPos, this.mouseMovePosition);
  //   });
  // }

  // onMouseUp() {
  //   console.log("mouse up");
  //   this.stopDragPhase();
  // }

  // onMouseEnter() {
  //   this.mouse = {
  //     ...this.mouse,
  //     isMouseWithin: true,
  //   };
  // }

  // onMouseLeave(event: MouseEvent) {
  //   // TODO: use global window out and not this container's out for better dragging
  //   this.stopHoverPhase();
  //   this.stopDragPhase();
  // }

  // onTouchStart(e: TouchEvent) {
  //   this.startDragPhase(e);
  // }

  // onTouchMove(e: TouchEvent) {
  //   if (!this.isInDragPhase) return;

  //   // TODO: can call mouse move with changedTouches[$-1], but it's reversed moving
  //   this.onMouseMove(e);
  // }

  // onTouchEnd() {
  //   this.stopDragPhase();
  // }

  // onTouchCancel() {
  //   this.stopDragPhase();
  // }

  // /**
  //  * Called at the start of a drag action.
  //  */
  // startDragPhase(e: MouseEvent | TouchEvent) {
  //   this.mouseMovePosition = Mouse.absolute(e);
  //   this.mouseHasMoved = false;
  //   this.isInDragPhase = true;

  //   this.mouse = {
  //     ...this.mouse,
  //     cursorState: "grabbing",
  //   };
  // }

  // /**
  //  * Called whenever the mouse leaves the canvas area.
  //  */
  // stopHoverPhase() {
  //   this.mouse = {
  //     ...this.mouse,
  //     isMouseWithin: false,
  //   };
  // }

  // /**
  //  * Called at the end of a drag action.
  //  */
  // stopDragPhase() {
  //   this.isInDragPhase = false;
  //   this.mouse = {
  //     ...this.mouse,
  //     cursorState: "grab",
  //   };
  // }

  // /**
  //  * Unregisters all event listeners and stops the animations.
  //  */
  // disconnectedCallback() {
  //   super.disconnectedCallback();
  //   this.container?.removeEventListener("mouseenter", this.onMouseEnter);
  //   this.container?.removeEventListener("mouseleave", this.onMouseLeave);
  //   this.container?.removeEventListener("click", this.onClick);
  //   this.container?.removeEventListener("dblclick", this.onDoubleClick);
  //   this.container?.removeEventListener("touchstart", this.onTouchStart);
  //   this.container?.removeEventListener("touchend", this.onTouchEnd);
  //   this.container?.removeEventListener("touchcancel", this.onTouchCancel);
  //   this.container?.removeEventListener("touchmove", this.onTouchMove);
  //   if (!this.disableDragging) {
  //     this.container?.removeEventListener("mouseup", this.onMouseUp);
  //     this.container?.removeEventListener("mousedown", this.onMouseDown);
  //     this.container?.removeEventListener("mousemove", this.onMouseMove);
  //   }
  //   this.stopDragPhase();
  // }

  render() {
    // TODO: adapt to parent height/width
    const style = {
      width: `${this.width}px`,
      height: `${this.height}px`,
      // ...this.props.style,
      cursor: this.mouse.cursorState,
      position: "relative",
      flexShrink: 0,
    };
    const canvasStyle = {
      position: "absolute",
      left: 0,
      top: 0,
    };
    return html`
      <div id=${this.uniqueId} style=${object2style(style)}>
        <canvas
          style=${object2style(canvasStyle)}
          id=${`${this.uniqueId}-0`}
          width=${this.width}
          height=${this.height}
        >
          Your browser does not seem to support HTML5 canvas.
        </canvas>
        <canvas
          style=${object2style(canvasStyle)}
          id=${`${this.uniqueId}-1`}
          width=${this.width}
          height=${this.height}
        >
          Your browser does not seem to support HTML5 canvas.
        </canvas>
        <!-- <FakeScroll
          overflow={this.props.overflow}
          overflowX={this.props.overflowX}
          overflowY={this.props.overflowY}
          positionX={this.props.scrollBarPositionX}
          positionY={this.props.scrollBarPositionY}
          width={this.props.width}
          height={this.props.height}
          fullWidth={this.props.fullWidth}
          fullHeight={this.props.fullHeight}
        /> -->
      </div>
    `;
  }
}

const object2style = (object: Record<string, any>): string =>
  Object.entries(object)
    .map(([k, v]) => `${k}: ${v};`)
    .join(" ");

// DraggingComponent.defaultProps = {
//   overflow: "auto",
//   overflowX: "initial",
//   overflowY: "initial",
//   scrollBarPositionX: "bottom",
//   scrollBarPositionY: "right",
//   scrollBarWidth: 5,
//   showModBar: true,
//   engine: "canvas",
// };

// DraggingComponent.propTypes = {
//   overflow: PropTypes.oneOf(["hidden", "auto", "scroll"]),
//   overflowX: PropTypes.oneOf(["hidden", "auto", "scroll", "initial"]),
//   overflowY: PropTypes.oneOf(["hidden", "auto", "scroll", "initial"]),
//   width: PropTypes.number.isRequired,
//   height: PropTypes.number.isRequired,
//   fullHeight: PropTypes.number.isRequired,
//   fullWidth: PropTypes.number.isRequired,
//   scrollBarPositionX: PropTypes.oneOf(["top", "bottom"]),
//   scrollBarPositionY: PropTypes.oneOf(["left", "right"]),
//   showModBar: PropTypes.bool,
//   engine: PropTypes.string,
// };

export default DraggingComponent;
