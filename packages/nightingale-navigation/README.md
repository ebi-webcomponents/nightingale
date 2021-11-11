# nightingale-navigation

[![Published on NPM](https://img.shields.io/npm/v/nightingale-navigation.svg)](https://www.npmjs.com/package/nightingale-navigation)

This custom element can be used to zoom and navigate along the sequence displayed in Nightingale. When a user interacts with the component, a `change` event is triggered which <nightingale-manager> uses to change `display-start` and `display-end` values on relevant custom elements.

[Demo](https://ebi-webcomponents.github.io/nightingale/#/navigation)

## Usage

```html
<nightingale-navigation
  length="456"
  display-start="143"
  display-end="400"
  highlightStart="23"
  highlightEnd="45"
  rulerstart="50"
/>
```

## API Reference

#### `length: number`

The protein or nucleic acid sequence length.

#### `display-start: number (optional)`

The start position of the selected region.

#### `display-end: number (optional)`

The end position of the selected region.

#### `highlightStart: number (optional)`

The start position of the highlighted region.

#### `highlightEnd: number (optional)`

The end position of the highlighted region.

#### `rulerstart: number (optional)`

The starting coordinate of the ruler.

#### also see [nightingale-zoomable](https://github.com/ebi-webcomponents/nightingale/blob/master/packages/nightingale-zoomable/README.md#properties)
