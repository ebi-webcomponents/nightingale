# nightingale-interpro-track

[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-interpro-track.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-interpro-track)

InterPro extension of the track component

## Usage

```html
<nightingale-interpro-track
  id="track"
  width="600"
  length="490"
  display-start="1"
  display-end="490"
  highlight="20:50,40:80"
  shape="roundRectangle"
  expanded
></nightingale-interpro-track>
```

## API Reference

### Attributes

#### `expanded: boolean (default: false)`

When `true` the children of the main track (if any), will be displayed. `false` indicates they should be hidden.

#### `"show-label": boolean (default: false)`

Set to `true` if a label should be rendered over each feature.

#### `label: string | null (default: null)`

Defines what to displays as label.

- If this is not set, but `show-label` is true, the component will render the `accession` of the feature as label.
- If is set, and starts with `"."` it will use its value as a selector in the feature object, for instance if `label=".feature.name"` it will try to get the value of `feature.name` for each particular feature, if the property doesn't exist, it won't render anything as label.
- If is set with a string that doesn't start with `"."` this string will be used as label.

### Other attributes and parameters

This component inherits from `nigthingale-track`.

The component implements the following mixins: `withManager`, `withResizable`, `withMargin`, `withPosition`, `withDimensions`, `withHighlight`, and `withZoom`.
