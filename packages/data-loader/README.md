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

## API

To be completed

### Events

|event name|information|
|----------|-----------|
|`error`|Fired when none of the URL defined in the `source` elements is reachable nor returns a valid response|
|`load`|Fired when a URL returns a valid response|


## To-do

 - [ ] Finish writing README.md
    - [ ] Document polyfill usage
    - [ ] Document custom namespacing
 - [ ] Add tests
 - [ ] Add continuous integration
