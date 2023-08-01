# nightingale-textarea-sequence

[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-textarea-sequence.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-textarea-sequence)

A custom element that creates a formatted text box to capture sequences. It uses [QuillJS](https://quilljs.com/) to format the content of the text box.

## Usage

```html
<nightingale-textarea-sequence
  id="track"
  min-sequence-length="5"
  width="800"
  height="400"
></nightingale-textarea-sequence>
```

## API reference

### Attributes

#### `alphabet?: 'protein'|'dna'|string (default: 'protein')`

Either a `string` explicitly listing the valid characters in the sequence or one of the predefined alphabets:

- `"protein"`: `"ACDEFGHIKLMNPQRSTVWY "`
- `"dna"`: `"AGTCN "`

#### `case-sensitive?: boolean (default: false)`

Indicates if the checks against the alphabet should consider the sequence casing

#### `single?: boolean (default: false)`

Indicates if the textarea should only allow a single sequence

#### `disable-header-check?: boolean (default: false)`

Indicates if the checks against the alphabet should consider the absence of the header.
This will only make sense if the attribute `single` is also `true`, if it's not, the value of
the error `headerCheckRequiredForMultipleSequences` will be `true`.

##### `min-sequence-length?: number (default: 1)`

Defines the minimum number of amino or nucleic acids required in the textarea

##### `inner-style?: string (default: '')`

Inline CSS style for the main container. Please note that the container's height and width should not be set using `inner-style` but with the `height` and `width` attributes (see [Usage](##Usage))

#### `sequence: string` **_[Read Only]_**

The current value of the textarea.

#### `errors` **_[Read Only]_**

The current value of the error report. In the shape of an object, where the keys are the type of error, and their values are booleans indicating if the current text has that error.

Usage example:

```javascript
{
  hasInvalidCharacters: false,
  missingFirstHeader: false,
  multipleSequences: false,
  tooShort: true, // The current sequence is too short
  headerCheckRequiredForMultipleSequences: false,
}
```

#### `quill`

We use quill to apply the formatting of the textarea. The object related to it, is exposed in this parameter.
See the [Quill API documentation](https://quilljs.com/docs/api/) for more details of what can you do with this object.

#### `formatSequence`

A formatting function to use in the [cleanUp()](<####`cleanUp()`>) method. It should add desired spaces a line splits.

The signature of the function should be:

```typescript
type FormatSequenceFunction = (
  sequence: string,
  options?: Record<string, unknown>,
) => string;
```

By default, improves the readability by folding sequences to have a maximum of 50 characters per line, and add a space every 10 characters.

**Note:** This parameter can be overwritten, so you can define such format. For example, to avoid any formatting you can pass the identity function:

```js
document.getElementByID("textareaID").formatSequence = (x) => {
  return x;
};
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
element.addEventListener("error-change", (e) => {
  console.log(e.detail.errors);
});
```

#### Quill Events

As mentioned before, we use quill, and its instance is exposed in the parameter `quill`. Quill emits several events, that you could also use. See the [Quill API documentation](https://quilljs.com/docs/api/#events) for more details.

Usage example:

```javascript
element.quill.on("text-change", (e) => {
  console.log(element.sequence);
});
```

### Exposed functions

The following functions can be used without having to load the web component:

#### `formatSequence(sequence, options={block: 10, line: 50})`

Splits a string into lines of length `line` with blocks of `block` length separated by white spaces.

parameters:

- `sequence`: type: `string`
- `options`: type `{block: number, line: number}`

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

- removes any character not in the alphabet
- generates a header if the sequence does not already have one
- formats the sequence using the specified function. Default: blocks of 10 characters separated with a white space and lines of 50 characters
- if `case_sensitive` is `true`, case mismatches are removed
- if `removeComments` is `true`, lines starting with `;` are removed
- if `single` is `true`, the first sequence is retained and the subsequent are removed

When all of those things are executed, the string is formatted with the function `format()`.

Parameters:

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
