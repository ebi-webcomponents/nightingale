[![Published on NPM](https://img.shields.io/npm/v/protvista-sequence.svg)](https://www.npmjs.com/package/protvista-sequence)
## &lt;protvista-sequence&gt;

Displays the sequence in the selected region if there is enough space for the characters.
Displays the axis legend of the selected region.

[Demo](https://ebi-webcomponents.github.io/nightingale/#/sequence)


## Usage

#### Setting sequence through property
```html
<protvista-sequence length="456" />
```
```
const protvistaSequence = document.querySelectAll('#my-protvista-sequence-id');
protvistaSequence.sequence = proteinSequence;
```

#### Setting sequence through attribute
```html
<protvista-sequence length="456" sequence="RFQAEGSLKK..."/>
```

## API Reference

### Properties

#### `sequence: string`
The sequence to display

#### `length: number`
The protein or nucleic acid sequence length.

#### also see [protvista-zoomable](https://github.com/ebi-webcomponents/nightingale/blob/master/packages/protvista-zoomable/README.md#properties)
