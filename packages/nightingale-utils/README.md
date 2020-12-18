# `nightingale-utils`

This is a utility package that groups several classes and method that are used by other `nightingale` elements.

Here is the description anf reference for the utilities expose in this package.

## `ColorScaleParser`

## `Region`

## `ScrollFilter`

## `withMargin`

It's a way to extend nightingale components to include the logic related with dealing with a property margin that follows the shape:

```javascript
{
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
}
```

The embedded logic takes care of exposing the following attributes in the webcomponent:

- `margintop`
- `marginbottom`
- `marginleft`
- `marginright`

The attributes are added to the `observedAttributes` of the element, so a change in the dom will trigger the `attributeChangedCallback` method.

The element is also extended to have `getters` and `setters` for properties with the same name.

The approach of this implementations is similar to Higher order components in React.
