# nightingale-heatmap

[![Published on NPM](https://img.shields.io/npm/v/nightingale-contact-map.svg)](https://www.npmjs.com/package/nightingale-contact-map)

Nightingale Heatmap component is used to generate a heatmap visualisation.

## Usage

The below example is using residues contacts data based on the distance.

```html
<nightingale-heatmap></nightingale-heatmap>
```

## API Reference

### Properties

#### `width: number`

The width specifies the width of the heat map.

#### `height: number`

The height specifies the height of the heat map.

#### `symmetric: boolean`

It supports symmetric matrix.

#### `data: Array`

The data array is of the following structure.

```javascript
[
  [1, 1, 0.2],
  [1, 2, 0.8],
  [2, 2, 0.5],
];
```
