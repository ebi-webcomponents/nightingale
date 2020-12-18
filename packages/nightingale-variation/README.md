# nightingale-variation

[![Published on NPM](https://img.shields.io/npm/v/nightingale-variation.svg)](https://www.npmjs.com/package/nightingale-variation)

This custom element displays a matrix of amino-acid changes at a given position on the protein sequence. The advantage of a matrix-based approach is that even with a large number of variants (every single amino-acid change per location) the space taken by the visualisation on the screen doesn't change.

[Demo](https://ebi-webcomponents.github.io/nightingale/#/variation)

## Usage

```html
<nightingale-variation length="270"></nightingale-variation>
```

#### Setting the data through property

```
const track = document.querySelector('#my-track-id');
track.data = myDataObject
```

#### Setting data through &lt;data-loader&gt;

```
<nightingale-variation length="770">
    <nightingale-variation-adapter>
        <data-loader>
          <source src="https://www.ebi.ac.uk/proteins/api/variation/P05067" />
        </data-loader>
    </nightingale-variation-adapter>
</nightingale-variation>
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

#### also see [nightingale-track](https://github.com/ebi-webcomponents/nightingale/blob/master/packages/nightingale-track/README.md#properties)
