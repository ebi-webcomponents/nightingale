### withZoom

Adds the zoom capabilities to a track. It creates a D3 scale between the sequence coordinates (from 1 to the length of the sequence) and the space on screen( from 0 to the width of the component).

The scale get updated either by a zoom event over the component, or by a change on the attributes: `display-start` or `display-end`.

Once the scale gets updated the `super.render()` method is invoked triggering a rerender in your component.

##### Mixins

Implements the following mixins:

- `withDimensions` to be able to calculate values with `width` and `height`.
- `withMargin` to consider the lost margin space in the margins
- `withPosition` to re calculate the scale whe displayed coordinates(i.e. `display-start` and `display-end`) change.

##### Properties

###### `xScale?: ScaleLinear<number, number>;`

The scale function for the X axis where on the initial state, the domain goes from `1` to the lenght of the sequence, and the range goes from `0` to the width of the SVG component.

The domain gets updated when the zoom and panning levels change.

The range gets updated when the width is changed.

###### `svg?: Selection< SVGSVGElement, unknown, HTMLElement | SVGElement | null, unknown >`;

The D3 selection to the root `svg` element rendered in the component. The zooming events will be bind to this element.

##### Methods

###### `getSingleBaseWidth(): number`

Uses the current scale to calculate the width of a single base on the sequence.

###### `getXFromSeqPosition(position: number): number`

Gets the coordinates in the SVG for a given position in the sequence

###### `getSeqPositionFromX(position: number): number`

Inverse to `getXFromSeqPosition`

###### `updateScaleDomain(): void`

Call this method to trigger an update on the scale. This only will have an effect if `length`, `width` or `margin-*` have been modified manually.

##### Mixins

Implements the mixins: `withMargin`, `withPosition`, `withResizable`, and `withDimensions`
