# data-loader

A standard Custom Element fetching data declaratively.

It follows the current v1 draft.

Will load the data at the URL defined in the `src` property of a
`source` element that it contains.

It can also parse JSON from the content of a script tag of type
`application/json`.

## Usage

### Example

```html
<data-loader>
  <source src="https://www.example.com/some/data" />
</data-loader>
```

See it running [Here](https://ebi-ppf.github.io/data-loader/).

### Use with custom namespace

Only needed if the `data-loader` name clashes with an other existing
Custom Element.

```js
import DataLoader from "data-loader";

// Register the Custom Elements
customElements.define("namespaced-data-loader", DataLoader);
```

And then in the HTML, use like so:

```html
<namespaced-data-loader>
  <source src="https://www.example.com/some/data" />
</namespaced-data-loader>
```

## Compatibility

This element assumes support for at least ES2015.
To support older browsers you might need to transpile the code you use
down to the version you are planning on supporting.

You might need to use a polyfill for browsers not supporting Custom
Elements **v1** (not v0).
See [webcomponents.js](https://github.com/webcomponents/webcomponentsjs) or
[SkateJS Web Components](https://github.com/skatejs/web-components).

## API

To be completed

### Properties

| name       | default value | information                                                                                             | DOM attribute | writable |
| ---------- | ------------- | ------------------------------------------------------------------------------------------------------- | ------------- | -------- |
| `data`     | `null`        | data loaded by the component (same than the data dispatched in the `load` event)                        | no            | no       |
| `loaded`   | `false`       | flag informing if data is currently loaded                                                              | no            | no       |
| `selector` | `null`        | selector to extract data from the payload (see [lodash.get documentation](https://lodash.com/docs#get)) | yes           | no       |

### Events

| event name | information                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------------- |
| `error`    | Fired when none of the URL defined in the `source` elements is reachable nor returns a valid response |
| `load`     | Fired when a URL returns a valid response, contains the data loaded (same as `data` property)         |
