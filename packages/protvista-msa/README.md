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
  colorscheme="clustal"
/>
```

This readme is been use as a road map. A 🚧 emoji indicates that this feature is under construction.

## Features

- ✅ Inherits from `protvista-zoomable` and supports updates from the `protvista-manager`
- ✅ Refreshes when the property `data` is updated
- ✅ Renders the sequence names if there is space assigned in the attribute `labelwidth`
- ✅ Forces the zoom to stay at a level thet there is at least a pixel per base.
- 🔲 Find an alternative to be able to zoom farther.
- ✅ Changes in color schema
- 🔲 Highlights a region
- 🔲 Adding other components to the layout. eg. scale, conservancy plot, etc.
- ✅ Calculates conservation of the alignment. This calculations runs as in a separate web worker.
- ✅ Can use the conservation either as a colorscheme or as an overlay of the current colorscheme.

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

##### `colorscheme`

The colour scheme to use when painting the alignment tiles.

Note: The conservation color scheme has to calculate some values. The current approach is to do the calculation in a web worker, if the component requests using the `'conservation'` scheme before the calculation is completed, it paint all the background in white, and repaints it once the calculations are done.

type: `enum('buried_index'|'clustal'|'clustal2'|'cinema'|'helix_propensity'|'hydro'|'lesk'|'mae'|'nucleotide'|'purine_pyrimidine'|'strand_propensity'|'taylor'|'turn_propensity'|'zappo'|'conservation')`
defaultValue: `'clustal'`

##### `text-font`

The font for the bases in the alignment. It should be in the format `"[size]px [font]"`. Where `[size]` is a number and `[font]` should be a valid font name.

type: `string`
default: `'18px Arial'`

##### `calculate-conservation`

A flag that enable the calculation of the conservation values per base in the alignment.

The calculation is executed on a web worker to avoid any interrruption on the main thread.

type: `boolean`
defaultValue: `false`

##### Other inherit from `protvista-zoomable`

displaystart, displayend, length, highlight

See more [here](https://github.com/ebi-webcomponents/nightingale/tree/master/packages/protvista-zoomable)

##### `overlay-conservation`

It uses the calculated conservation to define opacity values for the background of the residues.
This way highly conservated areas will be full coloured, while mutations will have a white background.

type: `boolean`
defaultValue: `false`

##### `sample-size-conservation`

If present, the value given here indicates how many sequences will be considered when calculating the conservation.
This way alignments with many sequences won't require a full analysis of the conservation, but it will be estimated based on a sample.
If not present, the conservation analysis will be executed with the all the sequences in the alignment.

type: `number`
defaultValue: `undefined`

### Properties

#### `data`

The sequences to be displayed. The should be in the following shape:

```javascript
[
  {
    name: "seq1",
    sequence: "MAMYDDEFDTKASDLTFSPWVEVE",
  },
  // ...
];
```

type: `array`

### Methods

#### `getColorMap()`

Return an object that contains the name of the current colorscheme in usage, and a map, that is a dictionary indicating the colorMapping used. For example the default scheme `'clustal'` would return something like:

```javascript
{
  name: 'clustal',
  map: {
    A: "orange",
    B: "#fff",
    C: "green",
    D: "red",
    E: "red",
    F: "blue",
    G: "orange",
    H: "red",
    I: "green",
    J: "#fff",
    K: "red",
    L: "green",
    M: "green",
    N: "#fff",
    O: "#fff",
    P: "orange",
    Q: "#fff",
    R: "red",
    S: "orange",
    T: "orange",
    U: "#fff",
    V: "green",
    W: "blue",
    X: "#fff",
    Y: "blue",
    Z: "#fff",
    Gap: "#fff"
  }
}
```

### Events

#### `conservationProgress`

It notifies progress at calculating the conservation. The detail of the event is an event with the progress, and the current count of bases per position in the current sequence.
When the progress is equal to 1, then the current values of the sum is divided by the number of sequences.

```javascript
// in the middle of the calculation
{
  progress: 0.5,
  conservation: [
    {M:5, A:3},
    {E:4, S:4},
  ]
}

//When the conservation calculation has been completed
{
  progress: 1,
  conservation: [
    {M:0.5, A:0.375, P:0.125},
    {E:0.375, S:0.375, -:0.5},
  ]
}

```

#### `drawCompleted`

Evrytime the component redraws the alignment this event is raised. There are multiple actions to redraw the alignment, for instance, changes in the props, or dragging the viewport.

It doesn't have any data in the details.
