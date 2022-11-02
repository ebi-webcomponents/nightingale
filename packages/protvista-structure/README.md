# protvista-structure

[![Published on NPM](https://img.shields.io/npm/v/protvista-structure.svg)](https://www.npmjs.com/package/protvista-structure)

A native web component wrapper around Mol\*

## Usage

```html
<!-- With UniProt Accession -->
<protvista-structure accession="P06493" structureId="4YC3" />
<!-- With a specific PDBe entry selected and the entry table being hidden -->
<protvista-structure
  accession="P06493"
  highlight="209:220"
  structureId="4YC3"
  hide-table
/>
```

## API Reference

### Properties

#### `accession`

A UniProt protein accession.

#### `highlight`

This is a comma separated list of numerical ranges represented as a string e.g. "1-5,10-20". When available, it will highlight all the residues corresponding to the given sequence positions.

#### `structureId`

The id of the structure to display for the provided accession.

#### `height`

The optional height of both table -- if visible, and the 3D structure. By default the value is set to `480px`. This should be a string value, representing a valid CSS value for an element's height property.

#### `uniprot-mapping-url`

Optional custom URL for fetching the mapping from PDB to UniProt. The lowercase PDB ID is appended here.

#### `alphafold-mapping-url`

Optional custom URL for fetching the AlphaFold prediction metadata and mapping. The AlphaFold structure ID is appended here.

#### `use-ctrl-to-zoom`

Analogous to `protvista-zoomable`, use control key when scrolling to zoom the viewer
