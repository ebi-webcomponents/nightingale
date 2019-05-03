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

#### also see [protvista-track](https://github.com/ebi-webcomponents/nightingale/blob/master/packages/protvista-zoomable/README.md#properties)
