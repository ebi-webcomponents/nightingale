# `<protvista-structure>`

In progress - A native web component wrapper around LiteMol

## Usage

```html
<!-- Basic usage -->
<protvista-structure id="1AAP" />
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

#### `accession: UniProt accession`

A protein accession

#### `highlightresidues`

By default highlights are applied to sequences. This attribute, when available, switches to highlight only the residues.

#### `hide-table`

It will prevent the PDBe entries table to render next to the 3D structure.

#### `molecule: A PDBe entry ID`

When available this PDBe structure will be selected, otherwise the first structure in the entry list that its `properties.method !== "Model"` will be selected and displayed.
