data-loader
===========

_in development_

A standard Custom Element fetching data declaratively.

It follows the current v1 draft.

Will load the data at the URL defined in the `src` property of a
`source` element that it contains.

## Usage

```html
<data-loader>
  <source src="https://www.example.com/some/data">
</data-loader>
```

## Compatibility

This element assumes support for at least ES2016.
To support older browsers you might need to transpile the code you use
down to the version you are planning on supporting.

You might need to use a polyfill for browser not supporting Custom
Elements.
[webcomponents.js](https://github.com/webcomponents/webcomponentsjs) is
recommended (`webcomponents-lite.js` is enough)

## API

To be completed

### Properties


|name|default value|information|DOM attribute|writable|
|----|-------------|-----------|-------------|--------|
|`data`|`null`|data loaded by the component (same than the data dispatched in the `load` event)|no|no|
|`loaded`|`false`|flag informing if data is currently loaded|no|no|

### Events

|event name|information|
|----------|-----------|
|`error`|Fired when none of the URL defined in the `source` elements is reachable nor returns a valid response|
|`load`|Fired when a URL returns a valid response, contains the data loaded (same as `data` property)|


## To-do

 - [ ] Finish writing README.md
    - [ ] Document custom namespacing
 - [ ] Add tests
 - [ ] Add continuous integration
 - [ ] Add data transformation through a `selector` property
 - [ ] Add bundle in `dist` folder for older browsers (but not before what is supported by the webcomponentjs polyfill)
