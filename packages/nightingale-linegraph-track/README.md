# nightingale-linegraph-track

[![Published on NPM](https://img.shields.io/npm/v/nightingale-linegraph-track.svg)](https://www.npmjs.com/package/nightingale-linegraph-track)

Nightingale line graph track component is used to display multiple line graphs (either linear or d3 curves). It inherits from Protvista-track.

## Usage

```html
<nightingale-linegraph-track></nightingale-linegraph-track>
```

## API Reference

### Properties

#### `length: number`

The protein or nucleic acid sequence length.

#### `height: number (optional)`

The height of the track.

#### `data: Array`

The data expects the following structure.

```javascript
{
    name: String,
    range:[min, max],
    colour?: Any colour,
    area?: Produce a filled area chart (default false),
    lineCurve?: 'curveLinear'(default)|'curveBasis'|'curveCardinal'|'curveStep'|'curveNatural',
        (More curves - https://github.com/d3/d3-shape/blob/v2.0.0/README.md#curves)
    values: [
        {
            position: Number,
            value: Number
        }
    ]
}
```

#### also see [protvista-track](https://github.com/ebi-webcomponents/nightingale/blob/master/packages/protvista-track/README.md#properties)
