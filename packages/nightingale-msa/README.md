# nightingale-msa

[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-msa.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-msa)

Multiple Sequence Alignment viewer. This component is a stripped-out version of https://github.com/plotly/react-msa-viewer. This version follows the same principle of nightingale, is written in TypeScript using Lit elements with nightingale mixins. However all the optimizations to handle the canvas were taken from the original project above.

## Usage

```html
<nightingale-msa
  id="msa"
  height="200"
  width="600"
  color-scheme="clustal"
  label-width="200"
></nightingale-msa>
```

## API Reference

### Attributes

#### `color-scheme: string (default: "clustal2")`

Color Scheme to paint the bases in the alignment. Available options:
`aliphatic, aromatic, buried, buried_index, charged, cinema, clustal2, clustal, helix, helix_propensity, hydro, lesk, mae, negative, nucleotide, polar, positive, purine, purine_pyrimidine, serine_threonine, strand, strand_propensity, taylor, turn, turn_propensity, zappo,, conservation`

#### `label-width: number(default: 0)`

Width reserved to render the labels of the sequences. If the value is `0` the labels won't be rendered.

#### `tile-height: number (default: 20)`

Height of each base (AKA tile).

#### `active-label: string (default: "")`

Label to highlight as if selected

#### `conservation-sample-size: number (default: 20)`

One of the color-schemes is `conservation` this requires a precalculation that runs on an inline web worker. The conservation calculation can be sampled to just the first `n` sequences. Which is defined by this parameter.

#### `overlay-conservation: boolean(default: false)`

When this flag is enable the conservation data is used to modify the color of each base.

### Methods

#### `getColorMap()`

Return an object that contains the name of the current colorscheme in usage, and a map, that is a dictionary indicating the colorMapping used. For example the default scheme 'clustal' would return something like:

```javascript
{
 "name": "clustal2",
 "map": {
  "A": "#80a0f0",
  "R": "#f01505",
  "N": "#00ff00",
  "D": "#c048c0",
  "C": "#f08080",
  "Q": "#00ff00",
  "E": "#c048c0",
  "G": "#f09048",
  "H": "#15a4a4",
  "I": "#80a0f0",
  "L": "#80a0f0",
  "K": "#f01505",
  "M": "#80a0f0",
  "F": "#80a0f0",
  "P": "#ffff00",
  "S": "#00ff00",
  "T": "#00ff00",
  "W": "#80a0f0",
  "Y": "#15a4a4",
  "V": "#80a0f0",
  "B": "#fff",
  "X": "#fff",
  "Z": "#fff"
 }
}
```

### Other attributes and parameters

The component implements the following mixins: `withManager`, `withMargin`, `withPosition`, `withDimensions`, `withHighlight`, and `withZoom`.
