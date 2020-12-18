# nightingale-sequence

[![Published on NPM](https://img.shields.io/npm/v/nightingale-sequence.svg)](https://www.npmjs.com/package/nightingale-sequence)

This custom element displays the sequence in the selected region if the zoom level allows it, otherwise it displays the axis legend of the selected region. As it inherits from <nightingale-zoomable>, it supports highlighting.

[Demo](https://ebi-webcomponents.github.io/nightingale/#/sequence)

## Usage

#### Setting sequence through property

```html
<nightingale-sequence length="456" />
```

```
const nightingaleSequence = document.querySelectAll('#my-nightingale-sequence-id');
nightingaleSequence.sequence = proteinSequence;
```

#### Setting sequence through attribute

```html
<nightingale-sequence length="456" sequence="RFQAEGSLKK..." />
```

## API Reference

### Properties

#### `sequence: string`

The sequence to display

#### `length: number`

The protein or nucleic acid sequence length.

#### also see [nightingale-zoomable](https://github.com/ebi-webcomponents/nightingale/blob/master/packages/nightingale-zoomable/README.md#properties)
