# protvista-structure

[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-structure.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-structure)

A native web component wrapper around Mol\*

## Usage

```html
<!-- With UniProt Accession -->
<nightingale-structure protein-accession="P06493" structure-id="4YC3" />
<!-- With a specific PDBe entry selected and the entry table being hidden -->
<nightingale-structure
  protein-accession="P06493"
  highlight="209:220"
  structure-id="4YC3"
  hide-table
/>
```

## API Reference

### Properties

#### `protein-accession`

A UniProt protein accession.

#### `structure-id`

The id of the structure to display for the provided accession.

#### `highlight`

This is a comma separated list of numerical ranges represented as a string e.g. "1-5,10-20". When available, it will highlight all the residues corresponding to the given sequence positions.

#### `custom-download-url`

Optional custom URL for downloading cif structure files. The lowercase PDB ID is appended to it, including `.cif` suffix.

### CSS custom properties

#### `--custom-structure-height`

The optional height of the 3D structure. By default the value is set to `480px`. This should be a valid CSS value for an element's height property.
