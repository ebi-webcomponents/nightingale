[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-saver.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-saver)

## &lt;nightingale-saver&gt;

The `nightingale-saver` component is used to download the ProtVista svg as images. By default, it renders a download button. It can be modified to include
different content although the first child element provided should be a button.

The component to be saved is bound to protvista-saver though the `element-id` attribute.

The background color is none by default. It can be set through the `background-color` attribute. The name and format of the file to be downloaded are
passed as `file-name` and `file-format` respectively.

There are two methods available : `preSave()` and `postSave()`. These functions allows any manipulations to DOM before and after painting on the canvas.

[Demo](https://ebi-webcomponents.github.io/nightingale/?path=/story/components-manager--manager)

## Usage

#### Basic

```html
<nightingale-saver element-id="track" id="#saver"> </nightingale-saver>
```

#### Passing different content to render other than the default

```html
<nightingale-saver
  element-id="just-tracks"
  file-name="tracks"
  file-format="jpeg"
  background-color="#ddddee"
>
  <button>Download Just Tracks</button>
</nightingale-saver>
```

#### Using preSave() and postSave()

```javascript
document.querySelector("#saver").preSave = () => {
  const base = document.querySelector("#track");
  const title = document.createElement("h2");
  title.setAttribute("id", "tmp_title_element");
  title.innerHTML = "ProtVista Snapshot";
  base.insertBefore(title, base.firstChild);
};
//removes the title from the DOM
document.querySelector("#saver").postSave = () => {
  document
    .querySelector("#track")
    .removeChild(document.getElementById("tmp_title_element"));
};
```

## API Reference

### Attributes

#### `element-id: string`

The Id of the component to be saved.

#### `background-color: string`

The background color for the canvas.

#### `file-name: string`

The file name to be used to save locally.

#### `file-format: string`

The format of the image. Accepted formats are png, jpeg, bmp, tiff and gif.

#### `extra-width: number (default: 0)`

Number of pixels added to the right of the image in case of any desired horizontal offset

#### `extra-height: number (default: 0)`

Number of pixels added to the bottom of the image in case of any desired vertical offset

#### `preview: boolean (default: false)`

If `true` the generated canvas will be added to the component in order to visually inspect the outcome image.
The image is not downloaded.

### Properties

#### `preSave: () => void `

The DOM manipulation if needed to be done before printing on the canvas.

#### `postSave: () => void `

The things that were changed during the preSave needed to be reverted in the postSave.
