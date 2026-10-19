# Migrating to Nightingale v6

v6's breaking changes are all in `@nightingale-elements/nightingale-structure`.
Every other package is functionally identical to its latest 5.x release — they
carry a major version only because this repository versions all packages together.

Most applications need to do nothing beyond bumping versions.

## 1. Upgrade the whole family at once

All packages move from 5.x to `6.0.0`, and their dependencies on each other
move to `^6.0.0`. A 5.x package will not accept a 6.x `nightingale-new-core`, so
mixing the two lines does not work:

```bash
npm install @nightingale-elements/nightingale-track@6 \
            @nightingale-elements/nightingale-new-core@6
# ...and any other @nightingale-elements/* packages you depend on
```

If your lockfile ends up with both 5.x and 6.x copies of `nightingale-new-core`,
custom element registration will run twice and components will fail to upgrade.
Check with `npm ls @nightingale-elements/nightingale-new-core`.

## 2. `nightingale-structure` is rebuilt on PDBe Mol\*

The component now wraps [pdbe-molstar](https://github.com/molstar/pdbe-molstar)
rather than driving [molstar](https://github.com/molstar/molstar) directly. PDBe
Mol\* provides the PDBe integration — notably the UniProt↔PDB residue mapping —
that this component previously reimplemented.

If you only use the element through its attributes and its `change` event, the
things to check are `color-theme="alphamissense"` (see [Changed](#changed)),
how [residues are numbered](#residue-numbering) for `custom-download-url`
structures, and the
[behaviour changes](#behaviour-changes-worth-checking) below.

### Removed

| Removed | What to do |
| --- | --- |
| `StructureData` and `PDBData` types | No replacement. `PDBData` described the PDBe mappings API response that 5.x fetched for every PDB entry; v6 no longer calls that API. `StructureData` was not used by the component. |
| Types from `position-mapping` (`Mapping`, `TranslatedPosition`, `Direction`, `PositionMappingError`) | No replacement. Residue mapping is now pdbe-molstar's built-in SIFTS mapping, not a module this package maintains. |
| `selectedMolecule` property; `loadPDBEntry()`, `loadAFEntry()` and `selectMolecule()` methods | Set the attributes instead: the element loads the structure itself whenever they change. |

`hide-table` appeared in the package README's usage example before v6 but was never
implemented, so there is nothing to migrate.

### Changed

- **`updateHighlight()`** takes pdbe-molstar's click payload (the exported
  `StructureClickEvent`) instead of an array of `{ chain, position }` PDB
  positions. It is the element's click handler; to highlight residues from your
  own code, set the `highlight` attribute.
- **`isAF()`** returns `boolean` rather than `boolean | undefined`.
- **`color-theme="alphamissense"`** colours AlphaFold models as before, by
  AlphaMissense pathogenicity on the `amColorScale` scale, but:
  - only AlphaFold models loaded by `structure-id` are coloured: 5.x also
    coloured an AlphaFold model file loaded by `model-url`, which now ignores
    `color-theme`;
  - the AlphaMissense file's URL is the `amAnnotationsUrl` of the model's
    prediction in the AlphaFold DB API response, rather than one built from the
    model's entry id;
  - each residue is coloured by the mean score of the substitutions at its
    residue number (which these AlphaFold models number by UniProt position),
    rather than at its index in the model, which differs when a model's
    numbering doesn't start at 1 or has gaps;
  - if the prediction has no AlphaMissense file, or it can't be fetched or
    read, the model stays coloured by pLDDT confidence and an error message is
    shown;
  - the file is fetched only once `alphamissense` is set and the model has
    loaded, at most once per file for each element;
  - the hover label reads `Mean AlphaMissense pathogenicity: 0.92`.
- **`highlightChain()`** also applies the [entry
  emphasis](#behaviour-changes-worth-checking). Without a `highlight` it frames
  the emphasized part rather than resetting the camera as 5.x did; it resets
  the camera only when it clears a previous selection and leaves nothing
  selected.

The type declarations 5.x shipped for its internal modules, reachable by deep
import from `dist/` (e.g. `dist/position-mapping`), are gone too, and
`dist/structure-viewer` now declares an unrelated API.

### Unchanged

These work as they did in 5.x, apart from the [residue numbering](#residue-numbering)
differences below, so existing markup keeps working:

- `protein-accession`, `structure-id`, `custom-download-url`, `model-url`
- `color-theme`: `alphafold` (the default, pLDDT confidence) or `alphamissense`,
  for AlphaFold models loaded by `structure-id` (see [Changed](#changed) for
  how AlphaMissense colouring now differs)
- `highlight` and `highlight-color` — same format; positions are still UniProt
  coordinates for PDB entries with `protein-accession` and for AlphaFold models
  (but see [behaviour changes](#behaviour-changes-worth-checking) for how
  they now look)
- the `--custom-structure-height` CSS custom property
- the `change` event: still `detail.highlight`, a single `"N:N"` position, still
  bubbling and cancelable
- the exported `AlphaFoldPayload` type, field for field
- the `amColorScale` export (the AlphaMissense pathogenicity colour scale)

(`model-url` is not new in v6 — it existed in 5.x but was undocumented.)

### Added

`nightingale-structure` now also exports `AlphaFoldPrediction` (the element type of
`AlphaFoldPayload`) and the viewer types: `StructureViewer`, `LoadSource`,
`StructureViewerOptions`, `StructureColorTheme`, `StructureClickEvent`,
`QueryParam` and `SelectItem`.

New attributes control the [entry
emphasis](#behaviour-changes-worth-checking), which is on by default:
`hide-entry-emphasis`, `entry-chains` and `entry-emphasis-opacity`.

A PDB `structure-id` now loads without `protein-accession`; 5.x displayed nothing
unless both were set. AlphaFold ids still need `protein-accession`, which is how
the model is looked up.

### Residue numbering

`highlight` and the `change` event's `detail.highlight` use one of two numberings:

- **UniProt positions of `protein-accession`**, when `protein-accession` is set
  and the loaded file carries SIFTS mapping (the `atom_site.pdbx_sifts_xref_db_*`
  columns). PDB entries loaded by `structure-id` come from PDBe, whose files have
  it. pdbe-molstar maps the positions to the structure. A click on a residue
  SIFTS doesn't map to `protein-accession` — e.g. a chain of another protein in
  the entry — emits no `change` and shows an out-of-range message, as 5.x did.
- **Author residue numbers** (`auth_seq_id`) otherwise, matched in every chain.
  This assumes the file numbers its residues by UniProt position, as AlphaFold
  models and models served through 3D-Beacons (e.g. SwissModel's) do: a model of
  residues 30–189 is numbered 30–189. For other files, positions won't line up
  with your other tracks.

| Structure | Numbering in v6 | In 5.x |
| --- | --- | --- |
| PDB `structure-id` with `protein-accession` | UniProt, via SIFTS | UniProt |
| PDB `structure-id` without `protein-accession` | author | nothing was loaded |
| AlphaFold `structure-id` | author, i.e. UniProt | UniProt |
| `custom-download-url` | author, unless the file carries SIFTS mapping | **UniProt** |
| `model-url` | author, unless the file carries SIFTS mapping | highlights and clicks did nothing |

**`custom-download-url` is the one that changes.** 5.x fetched PDBe's UniProt
mapping for the `structure-id` and applied it to whatever file it downloaded.
wwPDB archive mmCIF files — including PDBe's own
`https://www.ebi.ac.uk/pdbe/entry-files/download/<id>.cif` — have no SIFTS
columns, so with them `highlight` is now read as author numbers. If you set
`custom-download-url` and rely on UniProt numbering, remove it so the entry loads
from PDBe, or serve files that include the SIFTS columns.

### Behaviour changes worth checking

**Structures are shown with the current entry emphasized, without any markup
change.** When a non-AlphaFold structure with SIFTS mapping loads with a
`protein-accession` set, the residues SIFTS maps to that accession keep their
colours and are focused by the camera (unless a `highlight` is set, which takes
the focus), while everything else is dimmed (opacity `0.3`, configurable via the
new `entry-emphasis-opacity` attribute). This is per residue: parts of the
entry's own chains that map elsewhere or nowhere — fusion partners, tags,
linkers — and their ligands and waters are dimmed too. Structures without SIFTS
mapping — wwPDB archive files from `custom-download-url` and most `model-url`
models (see [Residue numbering](#residue-numbering)) — are shown undimmed unless
the new `entry-chains` attribute names the entry's chains, which are then
emphasized whole (it also takes precedence over SIFTS); so is a structure in
which nothing matches the accession or `entry-chains`. AlphaFold models are never
emphasized. Set the new `hide-entry-emphasis` boolean attribute to turn the
emphasis off; this restores the 5.x appearance except for AlphaFold highlights
(next paragraph).

**AlphaFold highlights keep the model's colours.** On AlphaFold models, a
`highlight` no longer overpaints the range with `highlight-color`: it keeps its
pLDDT (or `color-theme="alphamissense"`) colours, and is shown by dimming the
rest of the model instead (to `entry-emphasis-opacity`), whether or not
`hide-entry-emphasis` is set.

**A stylesheet is now added to `document.head`.** On first render the component
appends `<style id="nightingale-pdbe-molstar-styles">` (~80 KB, pdbe-molstar's
stylesheet) to the document head, once per page. 5.x added nothing global.

All 591 style rules in it are namespaced under `.msp-*` and none target bare
elements, so collisions with application styles are unlikely; it also defines a
global `@keyframes dash`. If you serve a strict Content-Security-Policy, note that
this is an inline `<style>` element and needs `style-src 'unsafe-inline'` (or a
nonce/hash strategy that covers it).

**Structures that can't be loaded no longer leave "Loading" on screen.** An
AlphaFold id that `protein-accession` has no model for shows
`No AF entry "<id>" for <accession>`, and a structure that fails to download or
parse shows `Couldn't load structure "<id>"`. Either way the viewer is left
empty. The message overlay now also appears for structures loaded by
`model-url`; 5.x only showed it when `structure-id` was set.

**AlphaFold models are downloaded as BinaryCIF.** 5.x loaded the mmCIF file
(`cifUrl`) of the model's AlphaFold DB prediction; v6 loads its BinaryCIF file
(`bcifUrl`, e.g. `AF-P05067-F1-model_v6.bcif`), and falls back to `cifUrl` only
when the prediction has no `bcifUrl`. Both are served from
`https://alphafold.ebi.ac.uk/files/`; if you proxy, mock or allow-list those
files, include the `.bcif` ones.

**More attribute changes take effect.** 5.x reloaded only when
`structure-id` or `model-url` changed. Now changing `custom-download-url` reloads
too, and changing `protein-accession` reloads an AlphaFold model (looking up the
new protein's model) or, for any other structure, re-applies the current
`highlight` in the new protein's numbering and the entry emphasis for it.
An element removed from the page and added back gets a new viewer; in 5.x it
stayed blank.

### Dependencies

`pdbe-molstar@^3.12.0` is added, and `molstar` moves from 3.44.0 to 5.8.0, the
exact version `pdbe-molstar@3.12.0` depends on, so the bundle contains a single
copy of Mol\*. As in 5.x, Mol\* is bundled into `dist/index.js`, which imports
nothing from these packages at runtime, so they need not match versions used
elsewhere in your app. `d3` and `dompurify` are unchanged.

The bundle grows from 2.55 MB (0.70 MB gzipped) in 5.11.0 to 4.69 MB (1.28 MB
gzipped).

## 3. `nightingale-msa` no longer emits an unresolved import

`nightingale-msa` used `lodash-es` without declaring it, so the published bundle
contained a bare `import ... from "lodash-es"` that your bundler had to satisfy —
it resolved only if something else in your tree happened to provide `lodash-es`.
That import is gone: `lodash-es` is now declared and bundled, and the only external
left in the bundle is `@nightingale-elements/nightingale-new-core`.

If you added `lodash-es` to your own dependencies purely to make
`nightingale-msa` work, you can drop it.

## 4. Packages are much smaller

JavaScript sourcemaps are no longer published, and the bundles no longer reference
them. `src/` is still included in every package, and the small declaration maps
(`.d.ts.map`) do ship, so your editor's go-to-definition lands on the TypeScript
source.

`nightingale-structure` goes from **13.0 MB to 4.7 MB** unpacked. Across all
packages this removes about 25 MB of `node_modules`. The bundle your users actually
download is unchanged in kind: `nightingale-structure`'s `dist/index.js` is 4.69 MB
raw, 1.28 MB gzipped.

## Known issue, not new in v6

`nightingale-saver`'s bundle contains `import ... from "url"` — a Node built-in
pulled in through `rasterizehtml` — which fails in a browser unless your bundler
polyfills it. This is present in 5.x as well and is tracked separately.
