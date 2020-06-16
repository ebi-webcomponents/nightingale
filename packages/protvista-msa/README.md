# protvista-msa

A custom element that visualises multiple sequences alignments. It is basically a wrapper of [react-msa-viewer](https://github.com/ebi-webcomponents/react-msa-viewer) that plays along with other nightingale components.

It currently uses the `clustal` color scheme, and only displays the alignment, none of the other components includede in `react-msa-viewer`. it uses the scroll only to move vertically.

## Usage

```html
<protvista-msa
  id="msa-track"
  length="300"
  height="200"
  displaystart="10"
  displayend="30"
  use-ctrl-to-zoom
  labelWidth="100"
/>
```

This readme is been use as a road map. A 🚧 emoji indicates that this feature is under construction.

## Features

- ✅ Inherits from `protvista-zoomable` and supports updates from the `protvista-manager`
- ✅ Refreshes when the property `data` is updated
- ✅ Renders the sequence names if there is space assigned in the attribute `labelwidth`
- ✅ Forces the zoom to stay at a level thet there is at least a pixel per base.
- 🔲 Find an alternative to be able to zoom farther.
- 🔲 Changes in color schema
- 🔲 Highlights a region
- 🔲 Adding other components to the layout. eg. scale, conservancy plot, etc.

## API reference

### Parameters

##### `width`

The width assigned for the component, including anything reseved for the sequence names

type: `number`
defaultValue: calculated based onavailable space.

##### `height`

Height of the component

type: `number`

##### `labelwidth`

The space assigned for the sequence labels. This will be taken from the total `width`. Which means that if the `width` is `1000` and `labelwidth` is `200`, the alignment will be using `800`.

If a value of `0` is assigned, the rendering of labels will be avoided completely.

type: `number`
defaultValue: 0

##### Other inherit from `protvista-zoomable`

displaystart, displayend, length, highlight

See more [here](https://github.com/ebi-webcomponents/nightingale/tree/master/packages/protvista-zoomable)

### Properties

#### `data`

The sequences to be displayed. The should be in the following shape:

```javascript
[
  {
    name: "seq1",
    sequence: "MAMYDDEFDTKASDLTFSPWVEVE"
  }
  // ...
];
```

type: `array`
