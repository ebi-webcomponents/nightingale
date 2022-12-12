### withResizable

Uses a `ResizeObserver` to detect changes in the size of the component, and sets the `width` and `height` propertes.

##### Attributes

###### `min-height: number (default 10)`

The minimum height of the track as a numeric value in pixels.

###### `min-width: number (default 10)`

The minimum width of the track as a numeric value in pixels.

##### Methods

###### ` protected onDimensionsChange(): void`

Override this method if there is anything to be done when the dimensions change after the component is resized.

##### Mixins

Implements the mixin `withDimensions` to be able to set the values of `width` and `height` of the component.
