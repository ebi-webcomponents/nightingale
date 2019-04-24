# `<protvista-track>`

Basic track type of the viewer
See it running [Here](https://ebi-webcomponents.github.io/protvista-track/).

## Usage

```html
<protvista-track length="456" start="34" end="400"></protvista-track>
```

## API Reference

### Properties

#### `length: number`

The protein or nucleic acid sequence length.

#### `data: Array`

Array items take the following shape:
```
{
    accession: String,
    start: Number,
    end: Number,
    color?: String,
    shape?: rectangle|bridge|diamnond|chevron|catFace|triangle|wave|hexagon|pentagon|circle|arrow|doubleBar,
    tooltipContent?: String
}
```

#### `start: number (optional)`

The start position of the selected region.

#### `end: number (optional)`

The end position of the selected region.

#### `highlight: string (optional)`

A comma separated list of regions to highlight.

Each region follows the format: `[start]:[end]`, where both `[start]` and `[end]` are optional numbers.

Examples:

- `10:20` Highlight from base 10 to 20 including both.
- `10:20,30:40` Highlight from base 10 to 20, and from 30 to 40.
- `:20` Highlight from the first base (1) to 20.
- `10:` Highlight from base 10 to the end of the sequence.
- `:` Highlight the whole sequence.

#### `highlightStart: number (optional)` **[DEPRECATED]**

The start position of the highlighted region.
Deprecated: Use `highlight` instead.

#### `highlightEnd: number (optional)` **[DEPRECATED]**

The end position of the highlighted region.
Deprecated: Use `highlight` instead.

### Events
