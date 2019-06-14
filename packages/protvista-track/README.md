[![Published on NPM](https://img.shields.io/npm/v/protvista-track.svg)](https://www.npmjs.com/package/protvista-track)

## &lt;protvista-track&gt;

The `protvista-track` component is used to display protein features. These features have `start` and `end` positions (these can be the same if the feature only spans one amino-acid), a specific shape (rectangle is the default) and a colour. Features are passed through the `data` property. You can specify shapes and colours at an instance level (through a property) or individually in the feature `data` (see `data` below). In order to establish the scale, it is necessary to set the `length` property (length of the protein sequence in amino-acids).

As `protvista-track` inherits from `protvista-zoomable`, it will respond to zooming changes, highlight events and emit events when interacting with features (helpful if you want to display tooltips).

Loading data can be done directly through the `data` property, or through the use of a `load` event emitted by one of `protvista-track`'s children (e.g. a data adapter with `data-loader`).

There are two types of display available for `protvista-track`:

- overlapping will display all the features on one single line. This means that if a feature overlaps another one, it will be indistinguishable. This layout can be useful to display an overview, or when the data is very dense.
- non-overlapping will calculate the best vertical positions for each feature so that they don't overlap.

[Demo](https://ebi-webcomponents.github.io/nightingale/#/track)

## Usage

```html
<protvista-track length="456" />
```

#### Setting the data through property

```
const track = document.querySelector('#my-track-id');
track.data = myDataObject
```

#### Setting data through &lt;data-loader&gt;

```
<protvista-track length="770">
    <protvista-feature-adapter id="adapter1">
        <data-loader>
          <source src="https://www.ebi.ac.uk/proteins/api/features/P05067?categories=PTM" />
        </data-loader>
    </protvista-feature-adapter>
</protvista-track>
```

## API Reference

### Properties

#### `length: number`

The protein or nucleic acid sequence length.

#### `data: Array`

Array items take the following shape:

```javascript
{
    accession: String,
    start: Number,
    end: Number,
    color?: String,
    shape?: rectangle|bridge|diamond|chevron|catFace|triangle|wave|hexagon|pentagon|circle|arrow|doubleBar,
    tooltipContent?: String
    locations: [
        {
            fragments: [
                {
                    start: Number,
                    end: Number
                }
            ]
        }
    ]
}
```

**Note**: `locations` is an alternative to `start`-`stop` attributes, that expresses that a feature can appear in several locations, and also supports the idea of discontinuous features, by allowing to have `fragments`.

So for example a single continuous feature, that only appears once can be represented in 2 ways. The classic `{accession:'X', start:2, end:4}` or a more verbose version: `{accession:'X', locations: [{fragments: [{start:2, end:4}]}]}` an both should generate a track like this:

```
-XXX------
```

If the same feature appears in 2 places in the sequence, it can be represented using `locations`:

```javascript
{
    accession: 'Y',
    locations: [
        {fragments: [{start:2, end:4}]},
        {fragments: [{start:7, end:9}]}
    ]
}
```

To generate a track like

```
-YYY--YYY-
```

Finally a feature can also be discontinuous, to repesent this in our data we use `fragments`:

```javascript
{
    accession: 'Z',
    locations: [
        {fragments: [
            {start:2, end:4},
            {start:7, end:9}]
        }
    ]
}
```

This expresses that the same instance of the feature Z is split in 2 fragments, from 2 to 4 and from 7 to 9. Which could be represented as

```
-ZZZ==ZZZ-
```

#### `layout?: overlapping(default)|non-overlapping(optional)`

The track layout. Non-overlapping uses a bumping algorhithm to make sure none of the features overlapp.

#### `shape?: see above`

Shape of all features within the track

#### `color?: see above`

Colour of all features within the track

#### also see [protvista-zoomable](https://github.com/ebi-webcomponents/nightingale/blob/master/packages/protvista-zoomable/README.md#properties)
