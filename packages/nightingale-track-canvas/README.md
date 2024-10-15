# nightingale-track-canvas

[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-track-canvas.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-track-canvas)

Alternative to `nightingale-track`, using HTML canvas for rendering instead of SVG graphics.

Canvas-based rendering can provide better performance, especially with large datasets (many features within a track or many parallel tracks). Some non-critical parts are still implemented via SVG (e.g. highlights).

Application interface for `nightingale-track-canvas` is the same as for `nightingale-track`. Some shapes might look slightly different. In case there are overlapping features, their order (z-index) might not be preserved.

## Usage

```html
<nightingale-track-canvas 
  id="my-track-id"
  length="223"
  height="100"
  display-start="1"
  display-end="50"
  layout="non-overlapping"
></nightingale-track-canvas>
```

#### Setting the data through property

```javascript
const track = document.querySelector("#my-track-id");
track.data = myDataObject;
```

## API Reference

This component inherits from `nigthingale-track` and has the same API.
