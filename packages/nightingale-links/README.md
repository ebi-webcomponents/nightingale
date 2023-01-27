# nightingale-links

[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-links.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-links)

A node-link representation to visualize points of interaction between bases in a sequence

## Usage

```html
<nightingale-links id="link"></nightingale-links>
```

## API Reference

### Attributes

#### `min-distance: number (default: 0)`

#### `min-probability: number (default: 0.7)`

Width reserved to render the labels of the sequences. If the value is `0` the labels won't be rendered.

### Other attributes and parameters

The component implements the following mixins: `withManager`, `withMargin`, `withPosition`, `withDimensions`, `withHighlight`, and `withZoom`.
