# nightingale-sunburst

[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-sunburst.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-sunburst)

A custom element that creates a sunburst visualization for a taxonomy tree.

## Usage

```html
<nightingale-sunburst
  id="sunburst"
  side="600"
  weight-attribute="numSequences"
  name-attribute="node"
  max-depth="7"
  font-size="10"
  show-tooltip
></nightingale-sunburst>
```

## API reference

### Attributes

#### `side: number (default: 500)`

This will be used as `width` and `height` of the canvas and as the diameter of the biggest circle in the sunburst.

#### `weight-attribute: string (default: "value")`

The attribute in the `data` nodes that will be used to calculate the proportions of the segments in the sunburst.

Note: All the nodes in the `data` parameter should have an attribute named as indicated in this attribute.

#### `name-attribute: string (default: "name")`

The attribute in the `data` nodes that will be used to for the labels of each segment.

Note: All the nodes in the `data` parameter should have an attribute named as indicated in this attribute.

#### `id-attribute: string (default: "id")`

The attribute in the `data` nodes that will be used as a unique ID for each node.

Note: All the nodes in the `data` parameter should have an attribute named as indicated in this attribute.

#### `max-depth: number (default: Infinity)`

The number of levels that the sunburst tree will be displayed.
If not included the component will go through the whole hierarchy.

#### `font-size: number (default: 10)`

Font size for the labels drawn over the segments.

#### `show-tooltip: boolean (default: false)`

If `true` the canvas will include a tooltip on the top-left corner with the information of the current segment. The current segment is the last one the user clicked on, or if none, it would be the segment where the mouse is hovering.

#### `weight-attribute-label: string (default: 'Value')`

Label to show in the labels. Only relevant if `show-tooltip` is `true`

### Properties

#### `data: Object`

The hierarchy that will be represented in the sunburst. It should be an object representing the root `Node` with an attribute `children` as an array of other `Node` objects.

- Each `Node` should have a unique identifier in the property indicated in the attribute `id-attribute`.
- Each `Node` should have a name tag in the property indicated in the attribute `name-attribute`, used to generate the labels.
- Each `Node` should have a numerical value in the property indicated in the attribute `weight-attribute` representing the weight of that node in the tree.

#### `activeSegment: Node` **_[Read-Only]_**

The `Node` of the segment that is currently hovered, or which has been clicked lastly.

#### `holdSegment: Boolean` **_[Read-Only]_**

Indicates if the `activeSegment` is being held from a recent click, and therefore is ignoring any other segment that has been currently hovered.

##### `topOptions Array<String>`

The list of options used on the first level of the sunburst, which define the color of its children segments.

default: `["bacteria", "viruses", "archaea", "eukaryota", null]`

### Methods

##### `getColorBySuperKingdom(name: String): String`

Returns a string representing the RGB color that is used for the given superkingdom string or any of its children.

##### `renderCanvas(): void`

You can use this method to manually trigger a render of the canvas.

### Events

##### `taxon-hover`

Is dispatched when a segment is hovered or clicked onto. It includes the `activeSegment` data as its `detail`

Usage example:

```js
sunburstElement.addEventListener("taxon-hover", (evt) => {
  console.log(evt.detail);
});
```

### Other attributes and parameters

This comoponent inherits from [LitElement](https://lit.dev/docs/api/LitElement/) and therefore all the methods and properties from LitElements are also available here.
