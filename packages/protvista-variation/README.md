[![Published on NPM](https://img.shields.io/npm/v/protvista-variation.svg)](https://www.npmjs.com/package/protvista-variation)

## &lt;protvista-variation&gt;

This custom element displays a matrix of amino-acid changes at a given position on the protein sequence. The advantage of a matrix-based approach is that even with a large number of variants (every single amino-acid change per location) the space taken by the visualisation on the screen doesn't change.

[Demo](https://ebi-webcomponents.github.io/nightingale/#/variation)

## Usage
```html
<protvista-variation length="270"></protvista-variation>
```

#### Setting the data through property
```
const track = document.querySelector('#my-track-id');
track.data = myDataObject
```

#### Setting data through &lt;data-loader&gt;
```
<protvista-variation length="770">
    <protvista-variation-adapter>
        <data-loader>
          <source src="https://www.ebi.ac.uk/proteins/api/variation/P05067" />
        </data-loader>
    </protvista-variation-adapter>
</protvista-variation>
```

## API Reference
### Properties

#### `data: Object`
```
{
      sequence: string,
      variants: [{
          accession: String,
          start: Number,
          end: Number,
          color?: String,
          tooltipContent?: String
      }]
}
```

#### `height?: number (default 430)`
The height of the visualisation (in px).

#### also see [protvista-track](https://github.com/ebi-webcomponents/nightingale/blob/master/packages/protvista-track/README.md#properties)
