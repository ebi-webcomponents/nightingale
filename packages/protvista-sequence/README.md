# protvista-sequence

[![Published on NPM](https://img.shields.io/npm/v/protvista-sequence.svg)](https://www.npmjs.com/package/protvista-sequence)

This custom element displays the sequence in the selected region if the zoom level allows it, otherwise it displays the axis legend of the selected region. As it inherits from <protvista-zoomable>, it supports highlighting.

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
<protvista-sequence length="456" sequence="RFQAEGSLKK..." />
```

## API Reference

### Properties

#### `sequence: string`

The sequence to display

#### `length: number`

The protein or nucleic acid sequence length.

#### `numberofticks: number`

The number of ticks in the displayed sequence.

#### also see [protvista-zoomable](https://github.com/ebi-webcomponents/nightingale/blob/master/packages/protvista-zoomable/README.md#properties)
