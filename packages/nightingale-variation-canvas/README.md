# nightingale-variation-canvas

[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-variation-canvas.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-variation-canvas)

Alternative to `nightingale-variation`, using HTML canvas for rendering instead of SVG graphics.

Canvas-based rendering scales much better with large variant datasets. The axes and the highlight overlay are still drawn in SVG.

## Usage

```html
<nightingale-variation-canvas
  protein-api
  id="variationId"
  height="500"
  length="123"
></nightingale-variation-canvas>
```

#### Setting the data through property

```javascript
const track = document.querySelector("#variationId");
track.data = myDataObject;
```

## API Reference

This component inherits from `nightingale-variation` and exposes the same attributes, properties, and events. See the [nightingale-variation README](../nightingale-variation/README.md) for the full API.

## Parity gaps

Two intentional differences versus `nightingale-variation`:

1. **Hover opacity affordance is not replicated.** In the SVG version, `circle { opacity: 0.6 }` is bumped to `1` on `:hover`. Canvas circles render at a constant `globalAlpha = 0.6` and do not brighten on hover.
2. **`VariationDatum.internalId` is no longer set as a render side effect.** The SVG render path writes `d.internalId = "var_${wildType}${start}${mutation}"` while drawing. The canvas draw path does not. The field remains on the `VariationDatum` type for consumers that set it themselves.

## Performance

See `dev/benchmarks/variation-canvas.html` for a reproducible benchmark comparing SVG vs canvas across variant counts.
