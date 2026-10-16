# nightingale-structure

[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-structure.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-structure)

A native web component wrapper around [PDBe Mol\*](https://github.com/molstar/pdbe-molstar)
(the PDBe-maintained distribution of Mol\*) for displaying protein 3D structures
from the PDB and AlphaFold DB, linked to the rest of the Nightingale components.

## Usage

```html
<!-- A PDB entry for a UniProt accession -->
<nightingale-structure
  protein-accession="P05067"
  structure-id="1AAP"
  highlight="290:315"
></nightingale-structure>

<!-- An AlphaFold model (pLDDT confidence colouring is applied automatically) -->
<nightingale-structure
  protein-accession="P05067"
  structure-id="AF-P05067-F1"
  highlight="290:315"
></nightingale-structure>

<!-- The same model, coloured by AlphaMissense pathogenicity -->
<nightingale-structure
  protein-accession="P05067"
  structure-id="AF-P05067-F1"
  color-theme="alphamissense"
></nightingale-structure>
```

## API Reference

### Properties

#### `protein-accession`

A UniProt protein accession. Required for AlphaFold ids, whose model is looked up
by it, and for UniProt numbering of `highlight` and `change` (see [Residue
numbering](#residue-numbering)).

#### `structure-id`

The id of the structure to display. Can be a PDB ID (e.g. `1AAP`), loaded from
PDBe, or an AlphaFoldDB ID (e.g. `AF-P05067-F1`), which must be one of
`protein-accession`'s models. AlphaFold ids (prefixed with `AF-`) are coloured by
pLDDT confidence, or by AlphaMissense pathogenicity (see
[`color-theme`](#color-theme)). An AlphaFold model is loaded from the BinaryCIF
file (`bcifUrl`) of its AlphaFold DB prediction, or from its mmCIF file
(`cifUrl`) if the prediction has no BinaryCIF file.

#### `color-theme`

How AlphaFold models are coloured:

- `alphafold` (the default): by pLDDT confidence, as pdbe-molstar colours
  AlphaFold models.
- `alphamissense`: by AlphaMissense pathogenicity. Each residue is coloured by
  the mean `am_pathogenicity` of all the amino acid substitutions at it, on the
  `amColorScale` scale (blue: likely benign, through light grey, to red: likely
  pathogenic). Residues without scores are mid-grey. Hovering a residue shows
  its mean score.

Any other value, or none, means `alphafold`. Only AlphaFold models loaded by
`structure-id` are affected; other structures ignore `color-theme`.

The scores come from the AlphaMissense file (`amAnnotationsUrl`, e.g.
`AF-P05067-F1-aa-substitutions.csv`) of the model's prediction in the AlphaFold
DB API response the model is looked up in. Residues are matched to scores by
residue number (`auth_seq_id`): the AlphaFold models that have an AlphaMissense
file, whole-sequence UniProt models such as `AF-P05067-F1`, number their
residues by UniProt position, as the file does. The file is fetched only once `alphamissense` is set
and the model has loaded, and each element fetches a file at most once (a failed
fetch is retried the next time it is needed). Changing `color-theme` re-colours
the model without reloading it.

If the prediction has no AlphaMissense file (AlphaFold DB has none for some
models, e.g. isoforms such as `AF-P05067-2-F1`), or the file can't be fetched or
read, the model stays coloured by pLDDT confidence and an error message is shown.

#### `highlight`

A comma-separated list of numerical ranges, e.g. `"1:5,10:20"`. The matching
structure residues are highlighted and focused. Positions are UniProt or author
residue numbers, depending on the structure: see [Residue
numbering](#residue-numbering).

#### `highlight-color`

CSS hex colour for the highlight (e.g. `#FFEB3B`). An alpha channel, if present,
is ignored.

#### `model-url`

A direct URL to a structure file to load instead of a PDB/AlphaFold entry. The
format is inferred from the extension: `.bcif` (binary mmCIF), `.pdb` or `.ent`
(PDB), otherwise mmCIF. Loaded through pdbe-molstar's `customData`. Don't set it
together with `structure-id`: if both are set, nothing is loaded.

Unless the file has SIFTS mapping (most models don't), `highlight` and `change`
use its author residue numbers, whether or not `protein-accession` is set. That
lines up with your other tracks when the model is numbered by UniProt position,
as models served through 3D-Beacons are.

#### `custom-download-url`

Optional base URL for downloading a custom cif structure file for a PDB
`structure-id`. The lowercase PDB id and a `.cif` suffix are appended, and the
result is loaded through pdbe-molstar's `customData`. wwPDB archive files (such
as `https://www.ebi.ac.uk/pdbe/entry-files/download/<id>.cif`) have no SIFTS
mapping, so `highlight` and `change` use their author residue numbers.

### Residue numbering

`highlight` and the `change` event use **UniProt coordinates of
`protein-accession`** when `protein-accession` is set and the loaded file carries
SIFTS mapping (the `atom_site.pdbx_sifts_xref_db_*` columns). PDB entries loaded
from PDBe by `structure-id` have it; pdbe-molstar's SIFTS mapping translates the
positions to the structure's residues.

Otherwise they use the file's **author residue numbers** (`auth_seq_id`), matched
in every chain: for PDB entries without `protein-accession`, and for `model-url`
and `custom-download-url` files without SIFTS mapping, such as wwPDB archive files
and most models. This assumes the file numbers its residues by UniProt position.
AlphaFold models do, as do models served through 3D-Beacons (e.g. SwissModel's: a
model of residues 30–189 is numbered 30–189), so their positions are UniProt
coordinates either way; for other files they won't line up with your other
tracks.

### CSS custom properties

#### `--custom-structure-height`

The optional height of the 3D structure viewer. Defaults to `480px`. Must be a
valid CSS length.

### Events

#### `change`

Dispatched when the user clicks a residue. `event.detail.highlight` is the
clicked residue as a single range (e.g. `"305:305"`), numbered like `highlight`
(see [Residue numbering](#residue-numbering)), so it can be propagated to other
Nightingale tracks via `nightingale-manager`. With UniProt numbering, a click on a
residue that isn't part of `protein-accession`'s sequence (e.g. a chain of
another protein in the entry) dispatches nothing and shows an out-of-range
message instead.

## Migrating from v5

See also the repo-wide [v6 migration guide](../../MIGRATING-v6.md).

This component was rebuilt on top of [pdbe-molstar](https://github.com/molstar/pdbe-molstar)
instead of wrapping [molstar](https://github.com/molstar/molstar) directly. The
following were removed:

| Removed | Replacement |
| --- | --- |
| `StructureData`, `PDBData` and `position-mapping` type exports | Gone. Residue mapping is pdbe-molstar's built-in SIFTS mapping. |
| `selectedMolecule`, `loadPDBEntry()`, `loadAFEntry()`, `selectMolecule()` | Gone. Set the attributes; the element loads the structure itself. |

`color-theme` still takes `alphafold` and `alphamissense`. AlphaMissense
colouring now reads the file's URL from the AlphaFold DB API (the prediction's
`amAnnotationsUrl`) rather than building it from the model's entry id, and
matches residues to scores by residue number rather than by their index in the
model, which differ when a model's numbering doesn't start at 1 or has gaps.
When there is no AlphaMissense data, the model stays coloured by pLDDT
confidence and an error message is shown. The hover label now reads
`Mean AlphaMissense pathogenicity: 0.92`.

`updateHighlight()` now takes pdbe-molstar's click payload (`StructureClickEvent`)
instead of an array of `{ chain, position }`; set `highlight` to highlight residues
from your own code.

`hide-table` appeared in this README's usage example before v6 but was never
implemented — there was no such property and no table was rendered — so there is
nothing to migrate.

`highlight` values for PDB entries with `protein-accession` set, and for AlphaFold
models, are still UniProt coordinates. Structures loaded through
`custom-download-url` are now numbered by author residue number unless the file
has SIFTS mapping; 5.x applied PDBe's UniProt mapping to them. See [Residue
numbering](#residue-numbering).
