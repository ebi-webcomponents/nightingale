import { html } from "lit";
import { property, state } from "lit/decorators.js";
import NightingaleElement, {
  withDimensions,
} from "@nightingale-elements/nightingale-new-core";

import { RawPosition } from "../../types/types";
import "./FakeScroll";
import object2style from "../../utils/object2style";

/**
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
  @state()
  fullWidth = 0;
  @state()
  fullHeight = 0;
  @state()
  x = 0;
  @state()
  y = 0;

  protected uniqueId = `msa-${Math.round(Math.random() * 10000)}`;
  protected ctxBuffers: (CanvasRenderingContext2D | null)[] = [];
  protected ctx: CanvasRenderingContext2D | null = null;
  protected canvasBuffers: HTMLCanvasElement[] = [];
  protected container?: HTMLElement | null;
  protected currentContext = 1;

  protected isInDragPhase = false;
  protected mouseHasMoved = false;
  protected mouseMovePosition?: RawPosition = undefined;

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

  render() {
    const style = {
      width: `${this.width}px`,
      height: `${this.height}px`,
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
        <fake-scroll
          overflowX="hidden"
          overflowY="initial"
          width=${this.width}
          height=${this.height}
          fullWidth=${this.fullWidth}
          fullHeight=${this.fullHeight}
          x=${this.x}
          y=${this.y}
        ></fake-scroll>
      </div>
    `;
  }
}

export default DraggingComponent;
