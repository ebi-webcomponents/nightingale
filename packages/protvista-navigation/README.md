# protvista-navigation

[![Published on NPM](https://img.shields.io/npm/v/protvista-navigation.svg)](https://www.npmjs.com/package/protvista-navigation)

This custom element can be used to zoom and navigate along the sequence displayed in ProtVista. When a user interacts with the component, a `change` event is triggered which <protvista-manager> uses to change `displaystart` and `displayend` values on relevant custom elements.

[Demo](https://ebi-webcomponents.github.io/nightingale/#/navigation)

## Usage

```html
<protvista-navigation length="456" />
```

## API Reference

#### `length: number`

The protein or nucleic acid sequence length.

#### also see [protvista-zoomable](https://github.com/ebi-webcomponents/nightingale/blob/master/packages/protvista-zoomable/README.md#properties)
