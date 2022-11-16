### withHighlight

It adds the necessary properties to a component that is using highlight. Notice, this doesn't render the anything in your component. Rather it takes care of setting the parameters and react when they changes.

A component that wants to render a highlight needs to implement the `updateHighlight` method which will be called when the highlight attribute is updated.

It adds `highlight` and `highlight-color` as attributes.

##### Attributes

###### `highlight: string | null (default null)`

A string representing a set of regions that required to be highilghted. it is a comma separated list of regions and each region, has start and end separated by `:`.

For example, `1:5,10:20` represents 2 regions. The first region goes from position `1` to `5`, and the second region goes from `10` to `20`.

`null` represents no region needs to be highlighted.

###### `highlight-color: string (default #FFEB3B66)`

The color to use when rendering the highlight. It follows the web standard defined in https://developer.mozilla.org/en-US/docs/Web/CSS/color_value

##### Properties

###### `fixedHighlight: string | null (default null)`

Works similar to the `highlight` attribute. The idea is to have a way to define a region that is always highlighted independently of the changes of `highlight`. Used in interpro to highlight the coverage of a chain in a protein.

##### Methods

###### ` protected updateHighlight()`

This method is called when any the highlight regions changed. In this mixin is just a place holder, but a component using `withHighlight` is expected to implement the highlight rendering logic by overwriting this method.
