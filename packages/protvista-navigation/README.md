# `<protvista-navigation>`
A custom element allowing to navigate a protein/nucleic sequence.
See it running [Here](https://ebi-ppf.github.io/protvista-navigation/).

## Usage
```html
      <protvista-navigation length="456" start="34" end="400"></protvista-navigation>
```

## API Reference

### Properties
#### `length: number`
The protein or nucleic acid sequence length.

#### `start: number (optional)`
The start position of the selected region.

#### `end: number (optional)`
The end position of the selected region.

#### `highlightStart: number (optional)`
The start position of the highlighted region.

#### `highlightEnd: number (optional)`
The end position of the highlighted region.

### Events
#### `protvista-zoom`
Custom event containing `start` and `end` horizontal coordinates.
