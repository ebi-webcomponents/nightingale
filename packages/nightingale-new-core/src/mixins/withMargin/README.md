### withMargin

Defines attributes for the margin of the component. it has a helper method to render the margins on a given d3 selection; this method is not automatically called, and it's the component resposability to invoke it at the right time.

##### Mixins

Implements the mixin `withDimensions` to be able to calculate values with `width` and `height`.

##### Attributes

###### `margin-top: number (default: 0)`

Top margin in pixels

###### `margin-bottom: number (default: 0)`

Bottom margin in pixels

###### `margin-left: number (default: 10)`

Left margin in pixels

###### `margin-right: number (default: 10)`

Right margin in pixels

###### `margin-color?: string | null (default: #FFFFFFDD)`

The color to use when rendering the margin. It follows the web standard defined in https://developer.mozilla.org/en-US/docs/Web/CSS/color_value

##### Methods

###### `getWidthWithMargins(): number`

Substract the defined margins(left and right) from the width.

###### `getHeightWithMargins()`

Substract the defined margins(top and bottom) from the height.

###### `renderMarginOnGroup( g?: Selection<SVGGElement, unknown, HTMLElement | SVGElement | null, unknown>): void`

Given a D3 selection it renders rectangles in the position of the margins, filling them with `margin-color`
