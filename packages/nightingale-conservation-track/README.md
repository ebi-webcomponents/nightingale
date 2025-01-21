# nightingale-conservation-track

[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-conservation-track.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-conservation-track)

The `nightingale-conservation-track` component is used to display sequence conservation across a set of sequences. It displays a column for each sequence position, which is divided into rectangles based on probabilities of individual amino acids occurring on this position. Each rectangle contains a label with one-letter code of the amino acid (if space allows). Rectangles are colored based on amino acid groups (aromatic, hydrophobic, polar, positive, negative, proline, cysteine, glycine). The input sequence conservation data can be provided via the `data` property.

As `nightingale-conservation-track` implements from `withZoom` and `withHighlight`, it will respond to zooming changes, highlight events and emit events when interacting with features (helpful if you want to display tooltips).

Most of the rendering is implemented via HTML canvas, but some non-critical parts are implemented via SVG (e.g. highlights).

## Usage

```html
<nightingale-conservation-track
  id="my-track-id"
  height="200"
  min-width="200"
  letter-order="default"
  font-family="Helvetica,sans-serif"
  min-font-size="6"
  fade-font-size="12"
  max-font-size="24"
  length="486"
  highlight-event="onmouseover"
  highlight-color="#EB3BFF22"
  margin-color="#ffffffdd"
  margin-left="10"
  margin-right="10"
  margin-top="10"
  margin-bottom="10"
  use-ctrl-to-zoom
></nightingale-conservation-track>
```

#### Setting the data through property

```javascript
const track = document.querySelector('#my-track-id');
track.data = {
    index: [1, 2, 3, 4, 5],
    probabilities: {
        A: [0.1, 0.1, 0, 0.2, 0.3],
        C: [0, 0.05, 0.1, 0.1, 0],
        // other amino acids go here
    },
};
```

## API Reference

### Atributes

#### `letter-order?: "default" | "probability" (default: "default")`

Order of amino acids within a column (top-to-bottom).
- "default" - fixed order based on amino acid groups
- "probability" - on every position sort by descending probability

#### `font-family?: string (default: "Helvetica,sans-serif")`

Font family for labels (can be a list of multiple font families separated by comma, like in CSS).

#### `min-font-size?: number (default: 6)`

Font size below which labels are hidden.

#### `fade-font-size?: number (default: 12)`

Column width below which labels are shown with lower opacity. If you do not want this fade-out effect, set `fade-font-size` equal to `min-font-size`.

#### `max-font-size?: number (default: 24)`

Maximum font size for labels. Set equal to `min-font-size` to keep font size constant.

### Properties

#### `data: { index: number[], probabilities: { [letter: string]: number[] } }`

Gets or sets sequence conservation data. See example above.

The keys in the `probabilities` object are typically one-letter amino acid codes but can be arbitrary strings (e.g. nucleotides: A, C, G, T).

### Other attributes and properties

This component inherits from `NightingaleElement`.

The component implements the following mixins: `withManager`, `withResizable`, `withMargin`, `withPosition`, `withDimensions`, `withHighlight`.
