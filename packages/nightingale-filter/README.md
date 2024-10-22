# nightingale-filter

[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale--filter.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-filter)

A custom element to filter data

## Usage

```html
<nightingale-filter for="filtered-component-id"></nightingale-filter>
```

## API Reference

## Properties

#### `filters`: `Array`

The filter configuration

```js
[
  {
    name: "filter_name",
    type: {
      name: "group_name",
      text: "group_label"
    },
    options: {
      label: "filter_option_label",
      color: "#333"
    },
    filterData: item => {} // the filter function
  }
];
```

### Events

When an option is selected, a `change` event is emitted, with type `activefilters`. It contains an array of the selected filters, which contains callback function to apply to the data.
