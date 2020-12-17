# nightingale-datatable

[![Published on NPM](https://img.shields.io/npm/v/nightingale-datatable.svg)](https://www.npmjs.com/package/nightingale-datatable)

This component can be used to display a table of features.

Wrapping it within `<nightingale-manager>` will allow highlighting of features as well as hidding features which are out of the display when zooming.

[Demo](https://ebi-webcomponents.github.io/nightingale/#/datatable)

## Usage

```html
<nightingale-datatable />
```

## Styling

`--nightingale-datatable__hover`: the background color of a row on mouse over

`--nightingale-datatable__active`: the background color of a row within a highlighted region

`--nightingale-datatable__active--clicked`: the background color of a clicked row

## API Reference

### Properties

#### `data: Object`

The data to display. `protvistaFeatureId` can be used as an attribute of the `data` object to provide an id for each row. To sort rows by position the `data` object must have either `start` or `begin` as attributes.

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

### `selectedid: string (optional)`

The row id to select. Row ids are attributed based on the `protvistaFeatureId` attribute in each data point. These are added to the data in the various adapters.

### `height: number (optional)`

The height of the table (in `rem`)

### `rowClickEvent: function (optional)`

A callback which will fire when a row is clicked. The data object for the clicked row will be provided in the callback.

### `noScrollToRow: boolean (false)`

Don't scroll to row if it has been selected

### `noDeselect: boolean (false)`

Don't de-select row if clicking outside of table
