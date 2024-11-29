# nightingale-scrollbox

[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-scrollbox.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-scrollbox)

`nightingale-scrollbox` is a container that allows having many tracks in a scrollable box and initializing/disposing them as they become visible/hidden. This can be used to reduce the actual number of tracks and improves performance.


## Usage

```html
<nightingale-scrollbox id="scrollbox" root-margin="50px" disable-scroll-with-ctrl>
    <nightingale-scrollbox-item id="item-a" content-visible="<whatever-track-component></whatever-track-component>" content-hidden="Placeholder content"> </nightingale-scrollbox-item>
    <nightingale-scrollbox-item id="item-b" content-visible="<whatever-track-component></whatever-track-component>" content-hidden="Placeholder content"> </nightingale-scrollbox-item>
    <nightingale-scrollbox-item id="item-c" content-visible="<whatever-track-component></whatever-track-component>" content-hidden="Placeholder content"> </nightingale-scrollbox-item>
</nightingale-scrollbox>
```

Descendant `nightingale-scrollbox-item` elements correspond to rows within the scrollbox. Content of these items can be controlled in two ways:

1. Providing `content-visible` and `content-hidden` attributes. Anytime the item becomes visible, its inner HTML will be replaced by the value of the `content-visible` attribute. Anytime the item becomes hidden, its inner HTML will be replaced by the value of the `content-hidden` attribute. If these attributes are not set, the content of the item will not be changed (but can still be controlled via callback function).

2. Setting callback functions:

  ```javascript
  const item = document.getElementById("item-a");
  item.data = { message: "Hello" }; // Set any custom data to the item
  item.onRegister(async item => { /* This runs when item is registered. */ });
  item.onEnter(async item => { /* This runs when item becomes visible. */ });
  item.onExit(async item => { /* This runs when item becomes hidden. */ });
  item.onUnregister(async item => { /* This runs when item is unregistered. */ });
  ```
  
  Callback functions can also be set for the whole scrollbox. This will set the same callbacks to all items within the scrollbox and will also apply to items registered later.
  
  ```javascript
  const scrollbox = document.getElementById("scrollbox");
  scrollbox.onRegister(async item => { /* This runs when item is registered. */ });
  scrollbox.onEnter(async item => { /* This runs when item becomes visible. */ });
  scrollbox.onExit(async item => { /* This runs when item becomes hidden. */ });
  scrollbox.onUnregister(async item => { /* This runs when item is unregistered. */ });
  ```
  
  (If you set `content-visible` and `content-hidden` attributes and callback functions at the same time, the callback functions will be executed after the inner HTML of the item is replaced by the attribute value.)


## API Reference

### `NightingaleScrollbox<TData>` properties

#### `register(item: NightingaleScrollboxItem<TData>)`

Add a new scrollbox item and run "onRegister" callback on it. This method is called automatically for all `nightingale-scrollbox-item` elements within the `nightingale-scrollbox` element.

#### `unregister(item: NightingaleScrollboxItem<TData>)`

Remove a scrollbox item and run "onUnregister" callback on it. This method is called automatically when a `nightingale-scrollbox-item` element is removed from the `nightingale-scrollbox` element.

#### `dispose()`:

Unregister all items and release resources.

#### `items: ReadonlySet<NightingaleScrollboxItem<TData>>`

Get the set of currently registered items.

#### `onRegister(callback: ((item: NightingaleScrollboxItem<TData>) => void | Promise<void>) | null | undefined)`

Set or remove "onRegister" callback function, which will be run on any newly registered items. Also run this callback function on all already registered items.

#### `onEnter(callback: ((item: NightingaleScrollboxItem<TData>) => void | Promise<void>) | null | undefined)`

Set or remove "onEnter" callback function, which will be run on items when they become visible. Also run this callback function on all currently visible items.

#### `onExit(callback: ((item: NightingaleScrollboxItem<TData>) => void | Promise<void>) | null | undefined)`

Set or remove "onExit" callback function, which will be run on items when they become hidden. Also run this callback function on all currently hidden items.

#### `onUnregister(callback: ((item: NightingaleScrollboxItem<TData>) => void | Promise<void>) | null | undefined)`

Set or remove "onUnregister" callback function, which will be run on items when they are unregistered.


### Attributes

#### `root-margin?: string`

Amount added to the top and bottom side of the bounding box before the intersection test is performed.
Can be a number or CSS length.
This lets you adjust the bounds outward so that an item is considered visible even if it is still hidden but is close to the visible area.
Negative values will adjust the bound inward so that an item is considered hidden even if it is visible but is close to the edge of the visible area.

#### `disable-scroll-with-ctrl?: boolean`

If this attribute is set, wheel scrolling will be disabled whenever Ctrl (or Meta/Command) key is pressed.
This helps to prevent bad user experience when some elements in the scrollbox have special Ctrl+Wheel behavior (e.g. zoom) but the gaps between elements still have default scrolling behavior.

---

### `NightingaleScrollboxItem<TData>` properties

#### `data?: TData`

Custom data associated with this item.

#### `register()`

Request changing item state to "new" and running "onRegister" callback.

#### `unregister()`

Request changing item state to undefined and running "onUnregister" callback. This item should not be used anymore.

#### `enter()`

Request changing item state to "visible" and running "onEnter" callback.

#### `exit()`

Request changing item state to "hidden" and running "onExit" callback.

#### `onRegister(callback: ((item: NightingaleScrollboxItem<TData>) => void | Promise<void>) | null | undefined)`

Set or remove "onRegister" callback function. Also run this callback function if the item is already registered (i.e. in "new", "visible", or "hidden" state).

#### `onEnter(callback: ((item: NightingaleScrollboxItem<TData>) => void | Promise<void>) | null | undefined)`

Set or remove "onEnter" callback function. Also run this callback function if the item is in "visible" state.

#### `onExit(callback: ((item: NightingaleScrollboxItem<TData>) => void | Promise<void>) | null | undefined)`

Set or remove "onExit" callback function. Also run this callback function if the item is in "hidden" state.

#### `onUnregister(callback: ((item: NightingaleScrollboxItem<TData>) => void | Promise<void>) | null | undefined)`

Set or remove "onUnregister" callback function.


### Attributes

#### `content-visible?: string`

HTML content to be rendered when this item becomes visible (before running "onEnter" callback). Leave unset to keep existing content.

#### `content-hidden?: string`

HTML content to be rendered when this item becomes hidden (before running "onExit" callback). Leave unset to keep existing content.
