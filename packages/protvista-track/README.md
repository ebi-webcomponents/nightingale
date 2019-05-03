# `<protvista-track>`

Basic track type of the viewer

## Usage

```html
<protvista-track length="456" displaystart="34" displayend="400"></protvista-track>
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

#### `layout: overlapping(default)|non-overlapping(optional)`
The track layout. Non-overlapping uses a bumping algorhithm to make sure none of the features overlapp.

#### `displaystart: number (optional)`

The start position of the selected region.

#### `displayend: number (optional)`

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
