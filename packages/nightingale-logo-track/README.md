# nightingale-logo-track

[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-logo-track.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-logo-track)

The `nightingale-logo-track` component renders a sequence logo from a RNA (or DNA) multiple sequence alignment. Each column displays nucleotide letters scaled by their information content (IC), computed as the reduction in Shannon entropy relative to the maximum possible entropy for a 4-letter alphabet (2 bits). Gap-heavy columns are scaled down proportionally by coverage.

**Colour scheme:**

| Nucleotide | Colour |
|------------|--------|
| A | Green `#00CC00` |
| C | Blue `#0000CC` |
| G | Orange `#FFB300` |
| U / T | Red `#CC0000` |

DNA thymine (T) is automatically treated as RNA uracil (U).

As `nightingale-logo-track` implements `withManager`, `withZoom`, and `withHighlight`, it will respond to zoom and pan events propagated by `nightingale-manager` and emit change events when the user interacts with it.

## Usage

### Standalone

```html
<nightingale-logo-track
  id="logo"
  height="120"
  min-width="400"
  length="23"
  margin-top="10"
  margin-bottom="10"
  use-ctrl-to-zoom
></nightingale-logo-track>

<script type="module">
  import "@nightingale-elements/nightingale-logo-track";
  const track = document.querySelector("#logo");
  track.sequences = [
    { name: "seq1", sequence: "AAAGUCGGGCUUAUGCAACCGGU" },
    { name: "seq2", sequence: "AAACCCGGGCUUAUGCAACCGGU" },
    // ...
  ];
</script>
```

### With `nightingale-manager`

Placing the track inside a `nightingale-manager` synchronises zoom, pan, and highlight with any other registered nightingale components (navigation, MSA, sequence, etc.).

```html
<nightingale-manager>
  <nightingale-navigation
    id="nav"
    height="44"
    length="23"
  ></nightingale-navigation>

  <nightingale-logo-track
    id="logo"
    height="120"
    length="23"
    margin-top="10"
    margin-bottom="10"
    highlight-event="onmouseover"
    highlight-color="#EB3BFF22"
    use-ctrl-to-zoom
  ></nightingale-logo-track>
</nightingale-manager>

<script type="module">
  import "@nightingale-elements/nightingale-manager";
  import "@nightingale-elements/nightingale-navigation";
  import "@nightingale-elements/nightingale-logo-track";

  await customElements.whenDefined("nightingale-logo-track");
  document.querySelector("#logo").sequences = [
    { name: "seq1", sequence: "AAAGUCGGGCUUAUGCAACCGGU" },
    { name: "seq2", sequence: "AAACCCGGGCUUAUGCAACCGGU" },
    // ...
  ];
</script>
```

## API Reference

### Properties

#### `sequences: Array<{ name: string; sequence: string }>`

Gets or sets the multiple sequence alignment data. Each entry is an object with a `name` string and a `sequence` string containing single-letter nucleotide codes. Gap characters (`-`, `.`) and unrecognised characters are ignored when computing information content.

Sequences can be RNA (`A`, `C`, `G`, `U`) or DNA (`A`, `C`, `G`, `T`); thymine is automatically converted to uracil for display purposes.

```javascript
track.sequences = [
  { name: "seq1", sequence: "AAAGUCGGGCUUAUGCAACCGGU" },
  { name: "seq2", sequence: "AAACCCGAGCUUAUGCAACCGGU" },
];
```

### Attributes

All standard nightingale attributes are supported.

#### `height?: number`

Height of the track in pixels. Defaults to the element's CSS height.

#### `length?: number`

Total length of the aligned sequences (number of columns).

#### `display-start?: number (default: 1)`

First sequence position to display. Managed automatically by `nightingale-manager`.

#### `display-end?: number`

Last sequence position to display. Managed automatically by `nightingale-manager`.

#### `margin-top?: number (default: 0)`

Top margin in pixels.

#### `margin-bottom?: number (default: 0)`

Bottom margin in pixels.

#### `margin-left?: number (default: 10)`

Left margin in pixels.

#### `margin-right?: number (default: 10)`

Right margin in pixels.

#### `margin-color?: string (default: "#ffffffdd")`

Fill colour for the margin overlay rectangles.

#### `highlight-event?: "onmouseover" | "onclick"`

Which pointer interaction triggers highlighting. Propagated to other components via `nightingale-manager`.

#### `highlight-color?: string (default: "#EB3BFF22")`

Fill colour for highlighted regions.

#### `use-ctrl-to-zoom?: boolean`

When set, scrolling only zooms if Ctrl (or Cmd on macOS) is held. Without this flag, any scroll event on the track will zoom.

### Other attributes and properties

This component inherits from `NightingaleElement` and implements the following mixins: `withManager`, `withZoom`, `withHighlight`, `withMargin`, `withPosition`, `withResizable`, `withDimensions`.
