# nightingale-links

[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-links.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-links)

A node-link representation to visualize points of interaction between bases in a sequence

## Usage

```html
<nightingale-links
  id="links"
  height="50"
  length="100"
  min-distance="3"
  min-probability="0.99"
></nightingale-links>
```

## API Reference

### Attributes

#### `min-distance: number (default: 0)`

It filters out the links between bases that are closer than the given minimum distance.

#### `min-probability: number (default: 0.7)`

It filters out the links that have less probability than the given one.

### Other attributes and parameters

The component implements the following mixins: `withManager`, `withMargin`, `withPosition`, `withDimensions`, `withHighlight`, and `withZoom`.
