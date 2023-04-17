# nightingale-linegraph-track

[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-linegraph-track.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-linegraph-track)

Nightingale line graph track component is used to display multiple line graphs (either linear or d3 curves).

## Usage

- Include the componet in your HTML:

  ```html
  <nightingale-linegraph-track
    id="track"
    width="600"
    length="5"
  ></nightingale-linegraph-track>
  ```

- Set the `data` in the component:

  ```javascript
  await customElements.whenDefined("nightingale-linegraph-track");
  const track = document.getElementById("track");
  if (track) {
    (track as any).data = tinyData;
  }
  ```

## API Reference

### Properties

#### `data: Array`

The data expects the following structure.

```javascript
{
    name: String,
    range:[min, max],
    color?: Line color,
        (color will be assigned if not provided. Use "none" for no line color)
    fill?: Create area plot using given fill color (default "none"),
    lineCurve?: 'curveLinear'(default)|'curveBasis'|'curveCardinal'|'curveStep'|'curveNatural',
        (More curves - https://github.com/d3/d3-shape/blob/v2.0.0/README.md#curves)
    values: [
        {
            position: Number,
            value: Number
        }
    ]
}
```

### Other attributes and parameters

This component inherits from `NightingaleElement`.

The component implements the following mixins: `withManager`, `withZoom`, `withResizable`, `withMargin`, `withPosition`, `withDimensions`, `withHighlight`
