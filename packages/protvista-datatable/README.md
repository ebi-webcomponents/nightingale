[![Published on NPM](https://img.shields.io/npm/v/protvista-datatable.svg)](https://www.npmjs.com/package/protvista-datatable)

## &lt;protvista-datatable&gt;

This component can be used to display a table of features.

Wrapping it within `<protvista-manager>` will allow highlighting of features as well as hidding features which are out of the display when zooming.

[Demo](https://ebi-webcomponents.github.io/nightingale/#/datatable)

## Usage

```html
<protvista-datatable />
```

## Styling

`--protvista-datatable__hover`: the background color of a row on mouse over

`--protvista-datatable__active`: the background color of a row within a highlighted region

`--protvista-datatable__active--clicked`: the background color of a clicked row

## API Reference

### Properties

#### `data: Object`

The data to display.

#### `columns: Object`

The definition used to display columns. It takes the following form:

```Javascript
const columns = {
  column1: {
    label: "My first column",
    resolver: d => d["column_name"] //this is used to resolve what to display in the column
  }
};
```

#### `displaystart: number (optional)`

The start position of the selected region.

#### `displayend: number (optional)`

The end position of the selected region.

#### `highlight: string (optional)`

A comma separated list of regions to highlight.

Each region follows the format: `[start]:[end]`, where both `[start]` and `[end]` are optional numbers.
