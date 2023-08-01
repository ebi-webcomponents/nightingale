# nightingale-sequence

[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-sequence.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-sequence)

This custom element displays the sequence in the selected region if the zoom level allows it, otherwise it displays the axis legend of the selected region. As it inherits from <nightingale-zoomable>, it supports highlighting.

## Usage

#### Setting sequence through property

```html
<nightingale-sequence
  sequence="SEQUENCESEQUENCESEQUENCESEQUENCE"
  width="800"
  height="40"
  length="32"
  display-start="10"
  display-end="20"
  highlight="3:15"
  id="my-nightingale-sequence-id"
></nightingale-sequence>
```

Alternatively the sequence can be set as a parameter once the component is loaded.

```javascript
const nightingaleSequence = document.querySelectAll(
  "#my-nightingale-sequence-id",
);
nightingaleSequence.sequence = proteinSequence;
```

## API Reference

### Attributes

#### `sequence?: string|null (default null)`

The sequence to display can be set via this attribute.

### Property

#### `data?: string|null (default null)`

For compatibility purposes with other components the sequence can also be set using this property.

### Other attributes and parameters

This component inherits from `NightingaleElement`.

The component implements the following mixins: `withManager`, `withResizable`, `withMargin`, `withPosition`, `withDimensions`, `withHighlight`
