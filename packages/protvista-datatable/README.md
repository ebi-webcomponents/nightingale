# `<protvista-datatable>`

Use this component to display table of features alongside a track. Wrapping it within `<protvista-manager>` will allow highlighting of features as well as hidding features which are out of the display when zooming.

## Usage

```html
<protvista-datatable length="456" start="34" end="400"></protvista-datatable>
```

## API Reference

### Properties

#### `data: Object`

The data to display.

#### `columns: Object`

The definition used to display columns. It takes the following form:

```Javascript
{
  column1: {
    label: "My first column",
    resolver: d => d["column_name"] //this is used to resolve what to display in the column
  },
  ...
}
```

#### `start: number (optional)`

The start position of the selected region.

#### `end: number (optional)`

The end position of the selected region.

#### `highlight: string (optional)`

A comma separated list of regions to highlight.

Each region follows the format: `[start]:[end]`, where both `[start]` and `[end]` are optional numbers.

### Events

#### Listens to

`protvista-datatable` listens to the `load` event so can be used with `data-loader` or protvista dataloaders.

#### Emits

`change` event with highlight start and end in the payload

### Styling

`--protvista-datatable__hover`: the background color of a row on mouse over

`--protvista-datatable__active`: the background color of a row within a highlighted region

`--protvista-datatable__active--clicked`: the background color of a clicked row
