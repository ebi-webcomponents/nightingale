# `<protvista-structure>`

In progress - A native web component wrapper around LiteMol

## Usage

```html
<!-- With UniProt Accession -->
<protvista-structure accession="P06493" />
<!-- To highlight a position/range -->
<protvista-structure accession="P06493" highlight="209:220" />
<!-- With a specific PDBe entry selected and the entrie table being hidden -->
<protvista-structure
  accession="P06493"
  highlight="209:220"
  molecule="4YC3"
  hide-table
/>
```

## API Reference

### Properties

#### `accession`

A UniProt protein accession.

#### `highlight`

This is a numerical range, represented as a string e.g. "10-20". When available, it will highlight all the residues corresponding to the given sequence positions.

#### `hide-table`

It will prevent the PDBe entries table to render next to the 3D structure.

#### `molecule`

When available this PDBe structure will be selected, otherwise the first structure in the entry list that its `properties.method !== "Model"` will be selected and displayed.

#### `height`

The optional height of both table -- if visible, and the 3D structure. By default the value is set to `480px`. This should be a string value, representing a valid CSS value for an element's height property.

#### `hide-viewport-controls`

Optionally you can hide the viewport controls -- located on the top-right corner of the 3D visualisation, by passing this attribute. This can be particularly useful when the size of 3D visualisation doesn't allow for extra controls to be included.
