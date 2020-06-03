# textarea-sequence

A custom element that creates a formatted text area to capture sequences

## Usage

```html
<textarea-sequence />
```

This readme is been use as a road map. A 🚧 emoji indicates that this feature is under construction.

## Parameters

##### `alphabet`

Either a `string` explicitly listing the valid characters in the sequence or one of the predefined alphabets:

- `"protein"`: `"ACDEFGHIKLMNPQRSTVWY "`
- `"dna"`: `"AGTCN "`

type: `enum('dna'|'protein') | string`
defaultValue: `"protein"`

##### `case-sensitive`

Indicates if the checks against the alphabet should consider the sequence casing

type: `boolean`
defaultValue: `false`

##### `single`

Indicates if the textarea should only allow a single sequence

type: `boolean`
defaultValue: `false`

##### `min-sequence-length`

Defines the minimum number of bases required in the textarea

type: `number`
defaultValue: `0`

##### `height`

Height of the textarea element.

type: `auto|<length>|<percentage>`
defaultValue: `"auto"`

##### `width`

Width of the textarea element:

type: `auto|<length>|<percentage>`
defaultValue: `"auto"`

## Features

- Formats the sequence interactively following the FastA format.
  - ✅ Highlights headers
  - ✅ Highlights bases/residues that are not part of it's alphabet.
  - ✅ Highlights if the file includes multiple sequences, when the option `single` is included.
- 🔲 Autofix funtionality.🚧
- ✅ Error reporting
- 🔲 Highlights the textarea border if there are errors or is valid.🚧
