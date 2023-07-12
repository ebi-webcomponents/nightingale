# nightingale-heatmap

[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-heatmap.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-heatmap)

Nightingale Heatmap component is used to generate a heatmap visualisation.

## Usage

The below example is using residues contacts data based on the distance.

```html
<nightingale-heatmap
  id="heatmap"
  width="400"
  height="400"
  bottom-color="black"
  top-color="white"
  margin-left="50"
  margin-bottom="50"
  symmetric
></nightingale-heatmap>
```

## API Reference

### Properties

#### `symmetric: boolean (default: false)`

It supports symmetric matrix.

#### `top-color: string (default: 'yellow')`

The heatmap can interpolate colors from the bottom value (`0.0`) to its top (`1.0`).
This attribute defines the color to paint the **top (`1.0`)** value.

It follows the web standard defined in https://developer.mozilla.org/en-US/docs/Web/CSS/color_value

#### `bottom-color: string (default: "darkblue")`

The heatmap can interpolate colors from the bottom value (`0.0`) to its top (`1.0`).
This attribute defines the color to paint the **bottom (`0.0`)** value.

It follows the web standard defined in https://developer.mozilla.org/en-US/docs/Web/CSS/color_value

#### `x-label: string (default: "Residue")`

Label to the legend in the X axix

#### `y-label: string (default: "Residue")`

Label to the legend in the X axix

### Properties

#### `data: Array`

The data array is of the HeatmapData structure.

```typescript
type HeatmapData = Array<
  [
    number, //   X coordinate starting on 1
    number, //   Y coordinate starting on 1
    number, //    Value in that position. Between 0 and 1
  ]
>;
```

For instance:

```javascript
[
  [1, 1, 0.2],
  [1, 2, 0.8],
  [2, 2, 0.5],
];
```

### Events

##### `change`

Is dispatched when hovering over a point in the heatmap.

The `detail` of the event is a `HeatmapPoint`:

```typescript
type HeatmapPoint = {
  xPoint: number;
  yPoint: number;
  value: number | null;
};
```

Usage example:

```js
heatmapElement.addEventListener("change", (evt) => {
  console.log(evt.detail);
});
```
