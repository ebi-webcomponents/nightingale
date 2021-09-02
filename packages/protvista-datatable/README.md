# protvista-datatable

[![Published on NPM](https://img.shields.io/npm/v/protvista-datatable.svg)](https://www.npmjs.com/package/protvista-datatable)

This component can be used to display a table of features.

Wrapping it within `<protvista-manager>` will allow highlighting of features as well as hidding features which are out of the display when zooming.

[Demo](https://ebi-webcomponents.github.io/nightingale/#/datatable)

## Usage

```html
<protvista-datatable>
  <table>
    <thead>
      <tr>
        <th>Col 1</th>
        <th>Col 2</th>
        <th>Col 3</th>
        <th>Col 4</th>
      </tr>
    </thead>
    <tbody>
      <tr data-id="row1">
        <td>Lorem</td>
        <td>ipsum</td>
        <td>dolor</td>
        <td>sit</td>
      </tr>
      <tr data-id="row2">
        <td>Lorem</td>
        <td>ipsum</td>
        <td>dolor</td>
        <td>sit</td>
      </tr>
      <tr data-group-for="row2">
        <td>amet, consectetur adipiscing elit</td>
      </tr>
    </tbody>
  </table>
</protvista-datatable>
```

## Styling

`--protvista-datatable__hover`: the background color of a row on mouse over

`--protvista-datatable__active`: the background color of a row within a highlighted region

`--protvista-datatable__active--clicked`: the background color of a clicked row

## Data attributes

#### `data-id`

The row id. Also passed in the "change" event triggered on row click

#### `data-group-for`

A grouped row is collapsed by default, and a trigger is added to the row with the corresponding `data-id` to collapse/expand it.

#### `data-filter`

Generate a dropdown filter for a given column. A select menu will be populated with values defined in `data-filter-value`. `data-filter` should be set on both the column header cell and the corresponding cells and have the same value to allow mapping.

#### `data-filter-value`

A value used to populate the `data-filter` select menu content. The value should reflect the content of the cell.

## API Reference

### Properties

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

### `noScrollToRow: boolean (false)`

Don't scroll to row if it has been selected

### `noDeselect: boolean (false)`

Don't de-select row if clicking outside of table
