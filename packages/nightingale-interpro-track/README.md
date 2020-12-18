# nightingale-interpro-track

[![Published on NPM](https://img.shields.io/npm/v/nightingale-interpro-track.svg)](https://www.npmjs.com/package/nightingale-interpro--track)

Interpro adpation of the track

## Usage

```html
<nightingale-interpro-track
  length="456"
  start="34"
  end="400"
></nightingale-interpro-track>
```

## API Reference

### Properties

#### `length: number`

The protein or nucleic acid sequence length.

#### `start: number (optional)`

The start position of the selected region.

#### `end: number (optional)`

The end position of the selected region.

#### `highlight: string (optional)`

A comma separated list of regions to highlight.

Each region follows the format: `[start]:[end]`, where both `[start]` and `[end]` are optional numbers.

### Events
