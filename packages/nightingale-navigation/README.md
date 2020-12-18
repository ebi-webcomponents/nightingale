# nightingale-navigation

[![Published on NPM](https://img.shields.io/npm/v/nightingale-navigation.svg)](https://www.npmjs.com/package/nightingale-navigation)

This custom element can be used to zoom and navigate along the sequence displayed in Nightingale. When a user interacts with the component, a `change` event is triggered which <nightingale-manager> uses to change `displaystart` and `displayend` values on relevant custom elements.

[Demo](https://ebi-webcomponents.github.io/nightingale/#/navigation)

## Usage

```html
<nightingale-navigation
  length="456"
  displaystart="143"
  displayend="400"
  highlight="23:45"
  rulerstart="50"
/>
```

## API Reference

#### `length: number`

The protein or nucleic acid sequence length.

#### `displaystart: number (optional)`

The start position of the selected region.

#### `displayend: number (optional)`

The end position of the selected region.

#### `highlight: string (optional)`

A comma separated list of regions to highlight.

Each region follows the format: `[start]:[end]`, where both `[start]` and `[end]` are optional numbers.

#### `rulerstart: number (optional)`

The starting coordinate of the ruler.

#### also see [nightingale-zoomable](https://github.com/ebi-webcomponents/nightingale/blob/master/packages/nightingale-zoomable/README.md#properties)
