[![Published on NPM](https://img.shields.io/npm/v/protvista-saver.svg)](https://www.npmjs.com/package/protvista-saver)

## &lt;protvista-saver&gt;

The `protvista-saver` component is used to download the ProtVista svg as images. By default, it renders a download button. It can be modified to include
different content although the first child element provided should be a button.

The component to be saved is bound to protvista-saver though the `element-id` property.

The background color is none by default. It can be set through the `background-color` attribute. The name and format of the file to be downloaded are
passed as `file-name` and `file-format` respectively.

There are two methods available : `preSave()` and `postSave()`. These functions allows any manipulations to DOM before and after painting on the canvas.

[Demo](https://ebi-webcomponents.github.io/nightingale/#/manager)

## Usage

```html
<protvista-saver element-id="track" id="#saver" />
```

#### Passing different content to render other than the default

```
<protvista-saver element-id="just-tracks" file-name="tracks" file-format="jpeg" background-color="#ddddee">
    <button>Download Just Tracks</button>
</protvista-saver>
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

### Properties

#### `element-id: string`

The Id of the component to be saved.

#### `background-color: string`

The background color for the canvas.

#### `file-name: string`

The file name to be used to save locally.

#### `file-format: string`

The format of the image. Accepted formats are png, jpeg, bmp, tiff and gif.

#### `preSave: method`

The DOM manipulation if needed to be done before printing on the canvas.

#### `postSave: method`

The things that were changed during the preSave needed to be reverted in the postSave.
