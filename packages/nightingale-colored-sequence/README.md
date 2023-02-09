# nightingale-colored-sequence

[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-colored-sequence.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-colored-sequence)

Use this component to paint a track that uses the sequence to paint a color depending on each residue.

Useful to display hydrophobicity, isoelectric points, or any feature where a color can represent a residue.

## Usage

```html
<nightingale-colored-sequence
  sequence="EXAMPLESEQUENCE"
  width="800"
  height="40"
  length="15"
  display-start="7"
  display-end="13"
  highlight="3:10"
  scale="hydrophobicity-scale"
></nightingale-colored-sequence>
```

## API Reference

### Properties

#### `data: string`

The sequence to use for the track. As an alternative to the `sequence` attribute inherited from `nightingale-sequence`

#### `scale: string`

The scale attribute is the mapping between a residue and a numeric value.

The value of this parameter could be either one of the predifined scales, or a custom scale indicating the values.

The list of predefined scales:

- hydrophobicity-scale
- hydrophobicity-interface-scale
- hydrophobicity-octanol-scale
- isoelectric-point-scale

The format for the custom scale is a comma separated list of pairs. Where each pair is a [KEY]:[VALUE].
For example:

`A:0.5,M:-3,P:3`

If a residue in the sequence is not defined in the used scale, the value used will be 0.

#### `color-range: string`

The color range attribute allow to define the colors to use when painting the values.

The component will use this range to create a scale that can be interpolated.

The default color_range is `#ffdd00:-2,#0000FF:2` indicating that a value of `-2` should be painted Yellow (`#ffdd00`) and
a value of `2` should be blue (`#0000FF`). And values in between will be interpolated.

The format requires at least 2 points, and if more than 2 are given, the interpolation would be calculated in between segments.
For example, `#ffdd00:-2,white:0,#0000FF:2` where `white` is now representing the value`0`.

Notice that HTML color names are also supported, as in the example above.

### Other attributes and parameters

This component inherits from `NightingaleSequence`.
