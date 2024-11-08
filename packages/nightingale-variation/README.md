# nightingale-variation

[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-variation.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-variation)

This custom element displays a matrix of amino acid changes at a given position on the protein sequence. The advantage of a matrix-based approach is that even with a large number of variants (every single amino acid change per location) the space taken by the visualisation on the screen doesn't change.

<!-- [Demo](https://ebi-webcomponents.github.io/nightingale/#/variation) -->

## Usage

```html
<nightingale-variation
  protein-api
  id="variationId"
  height="500"
  length="123"
></nightingale-variation>
```

#### Setting the data through property

```javascript
const track = document.querySelector("#variationId");
track.data = myDataObject;
```

## API Reference

### Atributes

#### `protein-api?: boolean (default: false)`

Indicates that the data provided follows the format of the [UniProt Protein API](https://www.ebi.ac.uk/proteins/api/doc/#/variation).

See more details in the typescript definition on [this file](https://github.com/ebi-webcomponents/nightingale/blob/main/packages/nightingale-variation/src/proteinAPI.ts).

#### `row-height?: number (default: undefined)`

The height per row of amino acids. If this value is undefined it will be calculated spliting the value given in `height` among the aminoacids to display. Notice the number of amino acids might vary if the `condensed-view` is enabled.

**Note:** If neither `row-height` nor `height` is set, it will used the track default height wich is likely set to `10` and probably not how you want to display this moponent as it will overlap rows.

#### `condensed-view?: boolean (default: false)`

If enabled, only displays a row for amino acids with at least one variant.

### Properties

#### `data: VariationData|ProteinsAPIVariation`

Data to be loaded in the component. It uses one of two formats:

1. If the `protein-api` attribute is present, it uses the format defined in the UniProt Protein API, described in Typescript as:

   ```typescript
   type ProteinsAPIVariation = {
     accession: string;
     entryName: string;
     proteinName: string;
     geneName: string;
     organismName: string;
     proteinExistence: string;
     sequence: string;
     sequenceChecksum: string;
     sequenceVersion: number;
     taxid: number;
     features: Variant[];
   };
   ```

2. The format used internally in the component.

   ```typescript
   export type VariationDatum = {
     accession: string;
     variant: string;
     start: number;
     size?: number;
     xrefNames: string[];
     hasPredictions: boolean;
     tooltipContent?: string;
     alternativeSequence?: string;
     internalId?: string;
     wildType?: string;
     color?: string;
   };

   export type VariationData = {
     sequence: string;
     variants: VariationDatum[];
   };
   ```

#### `colorConfig: (v: VariationDatum) => string;`

A function that receives a variation datapoint and returns an HTML valid color. For example:

```typescript
const track = document.querySelector("#variationId");
track.colorConfig = (v: VariationDatum) => {
  if (v.hasPredictions) return "green";
  return "#DD2121";
};
```
