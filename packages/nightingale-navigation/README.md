# nightingale-navigation

[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-navigation.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-navigation)

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

#### `ruler-start: number (default 1)`

The scale of coordinates will start from this value.

#### `ruler-padding: number (default 10)`

a horizontal padding to add on the ruler, to give the component a zooming efect even when the whole sequence is selected

#### `scale-factor: number (default 10)`

The quanity use to scale in or out when using the methods `zoomIn` or `zoomOut`

#### `show-highlight: boolean (default false)`

A shade representing a highlighted area can be added over the component.

### Methods

#### `locate(start: number, end: number)`

Locates the selected area of the navigation component triggering the events related to it.

#### `zoomIn()`

Reduces the selected area of the navigation component by the quantity specified in the `scale-factor` attribute.

#### `zoomOut()`

Extends the selected area of the navigation component by the quantity specified in the `scale-factor` attribute.

### Other attributes and parameters

This component inherits from `NightingaleElement`.

The component implements the following mixins: `withManager`, `withResizable`, `withMargin`, `withPosition`, `withDimensions`, `withHighlight`
