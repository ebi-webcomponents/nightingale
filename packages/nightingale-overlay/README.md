[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-overlay.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-overlay)

## &lt;nightingale-overlay&gt;

The `nightingale-overlay` component is used to create a layer over a component (specified by ID).
The layer will be visible while a `scroll` or `wheel` event is detected.

[Demo](https://ebi-webcomponents.github.io/nightingale/?path=/story/components-manager--manager)

## Usage

#### Basic

```html
<nightingale-saver for="element-id"> </nightingale-saver>
```

## API Reference

### Attributes

#### `for: string`

The Id of the component that the overlay will cover.

#### `label: string`

The text to appear in the middle of the overlay
