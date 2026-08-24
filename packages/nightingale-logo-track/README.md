# nightingale-logo-track

[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-logo-track.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-logo-track)

The `nightingale-logo-track` component renders a sequence logo from a multiple sequence alignment. It works with both nucleotide (RNA/DNA) and amino acid (protein) alignments — the sequence type is detected automatically from the data. Each column displays letters scaled by their information content (IC), computed as the reduction in Shannon entropy relative to the maximum possible entropy for the alphabet. Gap-heavy columns are scaled down proportionally by coverage. The most-conserved residue is rendered at the top of each stack.

**Nucleotide colour scheme (RNA/DNA — up to 2 bits per column)**

| Base | Colour |
|------|--------|
| A | Green `#00CC00` |
| C | Blue `#0000CC` |
| G | Amber `#FFB300` |
| U / T | Red `#CC0000` |

DNA thymine (T) is automatically treated as RNA uracil (U).

**Amino acid colour scheme (protein — up to ~4.32 bits per column)**

Colors follow the [WebLogo](https://weblogo.threeplusone.com) chemistry grouping:

| Group | Residues | Colour |
|-------|----------|--------|
| Hydrophobic | A G V L I P F M W | Orange `#FF8C00` |
| Polar uncharged | S T C Y N Q | Green `#00CC00` |
| Positively charged | K R H | Blue `#0000CC` |
| Negatively charged | D E | Red `#CC0000` |

As `nightingale-logo-track` implements `withManager`, `withZoom`, and `withSVGHighlight`, it will respond to zoom, pan, and highlight events propagated by `nightingale-manager` and emit change events when the user interacts with it.

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

Gets or sets the multiple sequence alignment data. Each entry is an object with a `name` string and a `sequence` string containing single-letter residue codes. Gap characters (`-`, `.`) and unrecognised characters are ignored when computing information content.

The sequence type is detected automatically when `sequences` is set: if more than 5 % of non-gap characters are amino-acid-specific letters (anything outside `A C G T U N`), the track switches to protein mode and applies the amino acid colour scheme and a 20-letter IC ceiling. Otherwise it operates in nucleotide mode and DNA thymine is treated as uracil.

```javascript
// RNA / DNA
track.sequences = [
  { name: "seq1", sequence: "AAAGUCGGGCUUAUGCAACCGGU" },
  { name: "seq2", sequence: "AAACCCGAGCUUAUGCAACCGGU" },
];

// Protein — type detected automatically
track.sequences = [
  { name: "prot1", sequence: "AMSMSVLKHHFDA" },
  { name: "prot2", sequence: "AMSMSVLRHHFDA" },
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

This component inherits from `NightingaleElement` and implements the following mixins: `withManager`, `withSVGHighlight` (which includes `withZoom`, `withHighlight`, `withMargin`, `withPosition`, `withResizable`, `withDimensions`).
