# `<protvista-navigation>`
It is a container for all the tracks and other inner components (e.g. protvista-navigation).

This component is in charge of capturing the events that its children trigger, and adjust element attributes accordingly.

The children should fire events of the type change, and the detail object should contain the attributes `type` and `value`.

## Usage
```html
      <protvista-manager attributes="attr1 attr2"></protvista-manager>
```

Here is an example of how the child components should fire the events:
```this.dispatchEvent(new CustomEvent("change", {
  detail: {
    value: 'New value',
    type: 'attr1'
  }
}));
```

## API Reference

### Properties
#### `attributes: string`
List of attributes that this component will be propagating.
