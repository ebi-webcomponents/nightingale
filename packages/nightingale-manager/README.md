# nightingale-manager

[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-manager.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-manager)

It is a container for all the tracks and other inner components (e.g. `nightingale-navigation`).

This component is in charge of capturing the events that its descendent trigger, and adjust registered element attributes accordingly.

The children should fire events of the type change, and the detail object should contain the attributes `type` and `value`.

Additionally, there are a set of pre-defined attributes which can be used with this component and will be propagated to descendents: `display-start`, `display-end`, `highlight` and `length`. This is useful if you want to control things like zoom level from outside, for instance directly from your application.

## Usage

```html
<nightingale-manager reflected-attributes="attr1 attr2">
  <other-nightingale-component attr1="X" attr2="Y" />
</nightingale-manager>
```

Here is an example of how the child components should fire the events:

```javascript
this.dispatchEvent(
  new CustomEvent("change", {
    detail: {
      value: "New value",
      type: "attr1",
    },
  }),
);
```

## API Reference

### Properties

#### `register(element: NightingaleElement)`:

Register an element with `nightingale-manager`. Only registered elements get their attributes updated.

#### `unregister(element: NightingaleElement)`:

Remove an element from the list of registered elements.

### Attributes

#### `reflected-attributes: string`:

Comma-separated list of attributes which should be reflected on the registered child components.
