# textarea-sequence

A custom element that creates a formatted text area to capture sequences. It uses [QuillJS](https://quilljs.com/) to format the textarea.

## Usage

```html
<textarea-sequence
  id="textareaID"
  height="10em"
  min-sequence-length="10"
  single="true"
/>
```

This readme is been use as a road map. A 🚧 emoji indicates that this feature is under construction.

## Features

- Formats the sequence interactively following the FastA format.
  - ✅ Highlights headers
  - ✅ Highlights bases/residues that are not part of it's alphabet.
  - ✅ Highlights if the file includes multiple sequences, when the option `single` is included.
  - ✅ Greys out comment lines (i.e. starts with `;`)
- ✅ CleanUp funtionality.
- ✅ Error reporting.
- ✅ Highlights the textarea border if there are errors or is valid.

## API reference

### Parameters

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

### Properties

#### `sequence` **_[Read Only]_**

The current value of the text-area.

type: `string`

#### `errors` **_[Read Only]_**

The current value of the error report. In the shape of an object, where the keys are the type of error, and their values are booleans indicating if the current text has that error.

type: `object`

Example:

```javascript
{
  hasInvalidCharacters: false,
  missingFirstHeader: false,
  multipleSequences: false,
  tooShort: true, // The current sequence is too short
}
```

#### `quill`

We use quill to apply the formatting of the textarea. The object related to it, is exposed in this parameter.
See the [Quill API documentation](https://quilljs.com/docs/api/) for more details of what can you do with this object.

type: `object`

#### `formatSequence`

A formatting function to use in the cleanUp method. It should add desired spaces a line splits.

The signature of the function should be:

`<string> formatSequence(<string> sequence)`

type: `function`
defaultValue: Splits the sequence in lines of 50, adding a space every 10 characters

parameters:

- sequence: type: `string`

Returns

- `string`

**Note:** This parameter can be overwritten, so you can define such format. For example, to avoid any formatting you can pass the identity function:

```javascript
document.getElementByID("textareaID").formatSequence = x => x;
```

### Methods

#### `cleanUp()`

This method tries to clean up the current sequence in the textarea, in the following way:

- Adds a generated header to the sequence in case is missing
- Removes any character that is not included in the current `alphabet`
- Trims lines and get rid of spaces
- If the attribute `single` is `true`, it will keep the first sequence and remove the rest.
- Executes the `formatSequence` function to include spaces and line lengths.

### Events

#### `error-change`

Is dispatched when there is a change in the reported errors. Includes the `errors` object in the details.

Usage example:

```javascript
element.addEventListener("error-change", e => {
  console.log(e.detail.errors);
});
```

#### Quill Events

As mentioned before, we use quill, and its instance is exposed in the parameter `quill`. Quill implement some events, that you could also use. See the [Quill API documentation](https://quilljs.com/docs/api/#events) for more details.

Usage Example:

```javascript
element.quill.on("text-change", e => {
  console.log(element.sequence);
});
```

### Exposed functions

We have exposed some functions tht can be use without having to load the web component:

#### `formatSequence(sequence, block = 10, line = 50)`

Splits a string into lines of length `line` with block of `block` length separated by white spaces.

parameters:

- `sequence`: type: `string`
- `block`: type: `number`
  default: `10`
- `line`: type: `number`
  default: `50`

Returns:

- `string`

Usage example:

```javascript
import { formatSequence } from "textarea-sequence";
const seq = "XXXXXXXXXXXXXXX";
formatSequence(seq, 4, 8); // 'XXXX XXXX\nXXXX XXX'
formatSequence(seq, 2, 8); // 'XX XX XX XX\nXX XX XX X'
formatSequence(seq, 5, 10); // 'XXXXX XXXXX\nXXXXX'
```

#### `cleanUpText(text,alphabet = alphabets.protein, caseSensitive = false, removeComments = true, single = true, format = formatSequence)`

Takes a sequence and transform it, applying the following heuristics:

- removes any character that's not in the alphabet.
- Generates a header if the sequence doesn't have one
- formats the sequence using the goven function. default: blocks of 10 chars separated with a white space and lines of 50 bases.
- If `case_sensitive` is `true` cases mismatches are removed.
- If `removeComments` is `true`, removes any line that starts with `;`
- If `single` is `true`, removes any sequence after the first one.

When all of those things are executed, the string is formatted with the function `format()`.

parameters:

- `text`: type: `string`
- `alphabet`: type: `string`
  default: `"ACDEFGHIKLMNPQRSTVWY "`
- `caseSensitive`: type: `boolean`
  default: `false`
- `removeComments`: type: `boolean`
  default: `true`
- `single`: type: `boolean`
  default: `true`
- `format`: type: `function`
  default: `formatSequence`
