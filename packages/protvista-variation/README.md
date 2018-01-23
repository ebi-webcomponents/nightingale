## Usage
```html
      <protvista-variation accession="P05067"></protvista-variation>
```

See it running [Here](https://ebi-webcomponents.github.io/protvista-variation/).

## API Reference
### Attributes
#### `accession: string`
The UniProt accession number for which to load the data.

#### `width: number (optional)`
The width of the viewer. If ommited the viewer will take up the width of its container.

### Properties

#### `width: number`
The width of the viewer.

#### `start: number (optional)`
The zoomed view starting point.

#### `end: number (optional)`
The zoomed view ending point.

#### `highlightStart: number (optional)`
The highlighted start position.

#### `highlightEnd: number (optional)`
The highlighted end position.

### Events
#### `protvista-filter-variants`
When a filter is selected.
