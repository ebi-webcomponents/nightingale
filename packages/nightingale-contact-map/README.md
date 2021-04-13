# nightingale-contact-map

[![Published on NPM](https://img.shields.io/npm/v/nightingale-contact-map.svg)](https://www.npmjs.com/package/nightingale-contact-map)

Nightingale Contact Map component is used to generate a heatmap visualisation for residues contacts data based on the distance.

## Usage

```html
<nightingale-contact-map></nightingale-contact-map>
```

## API Reference

### Properties

#### `dimension: number`

The dimension specifies the width and height of the heat map. Here width and height are equal as it is a square matrix.

#### `data: Array`

The data array is of the following structure.

```javascript
[
  [1, 1, 0.2],
  [1, 2, 0.8],
  [2, 2, 0.5],
];
```
