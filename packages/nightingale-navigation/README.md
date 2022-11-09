# nightingale-navigation

[![Published on NPM](https://img.shields.io/npm/v/nightingale-navigation.svg)](https://www.npmjs.com/package/nightingale-navigation)

This custom element can be used to zoom and navigate along the sequence displayed in Nightingale. When a user interacts with the component, a `change` event is triggered which <nightingale-manager> uses to change `display-start` and `display-end` values on relevant custom elements.

## Usage

```html
<nightingale-navigation
  length="456"
  display-start="143"
  display-end="400"
  highlight="23:45"
  rulerstart="1"
/>
```

## API Reference

### Attributes

#### `rulerstart: number (default 1)`

The scale of coordinates will start from this value.

#### `show-highlight: boolean (default false)`

A shade representing a highlighted area can be added over the component.

### Other attributes and parameters

This component inherits from `NightingaleElement`.

The component implements the following mixins: `withManager`, `withResizable`, `withMargin`, `withPosition`, `withDimensions`, `withHighlight`
