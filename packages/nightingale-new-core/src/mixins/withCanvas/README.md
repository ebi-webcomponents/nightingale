### withCanvas

This mixin manages a `<canvas>` node within the element. This includes automatic resizing and adjusting canvas scale.

The base class must implement `NightingaleBaseElement` and `WithResizableInterface` and it must render a `<canvas>` element, e.g.:

```ts
render() {
  return html`
    <div class="container">
      <div style="position: relative; z-index: 0;">
        <canvas style="position: absolute; left: 0; top: 0; z-index: -1;"></canvas>
        <svg></svg>
      </div>
    </div>
  `;
}
```

##### Properties

###### `canvas?: Selection<HTMLCanvasElement, unknown, HTMLElement, unknown>`

D3 selection with this element's `<canvas>` node. Is automatically set to the first ancestor `<canvas>` node when the element is first rendered.

###### `canvasCtx?: CanvasRenderingContext2D`

Canvas rendering context.

###### `canvasScale: number`

Ratio of canvas logical size versus canvas display size (device pixel ratio).

##### Methods

###### `adjustCanvasCtxLogicalSize(): void`

Adjust width and height of `this.canvasCtx` based on canvas size and scale if needed (clears canvas content!). Subclass should call this method just before redrawing the canvas.

###### `onCanvasScaleChange(): void`

Runs when device pixel ratio (`this.canvasScale`) changes, e.g. when browser zoom is changed or browser window is moved to a different screen. Subclasses can override this to run custom code whenever `this.canvasScale` changes.
