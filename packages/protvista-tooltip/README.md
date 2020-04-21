# protvista-tooltip

[![Published on NPM](https://img.shields.io/npm/v/protvista-tooltip.svg)](https://www.npmjs.com/package/protvista-tooltip)

A custom element allowing to navigate a protein/nucleic sequence.

## Usage

```html
<protvista-tooltip title="My tooltip" visible x="10" y="20">
  Content of the tooltip (in <code>html</code> too)
</protvista-tooltip>
```

## API Reference

### Properties

#### `name: title`

The title to be displayed.

#### `name: x`

The x position, in pixels, of the target of the tooltip.

#### `name: y`

The y position, in pixels, of the target of the tooltip.

#### `name: visible`

Flag denoting if the tooltip should be visible or not.

#### `name: container`

Selector to get the container of the tooltip (for edge calculations). Default to
the main html element of the current document.

### overridable custom properties

#### `name: --z-index`

z-index of the tooltip, defaults to `50000`.

#### `name: --title-color`

color of the tooltip title background, defaults to `black`.

#### `name: --text-color`

color of the tooltip text, defaults to `white`.

#### `name: --body-color`

color of the tooltip body background, defaults to `#616161`.

#### `name: --triangle-width`

width of the triangle pointing the tooltip towards its target, in pixels,
defaults to `16px`.

#### `name: --triangle-height`

height of the triangle pointing the tooltip towards its target, in pixels,
defaults to `10px`.
