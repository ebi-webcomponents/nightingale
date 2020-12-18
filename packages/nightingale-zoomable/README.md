# nightingale-zoomable

A custom element to be inherited from if a Nightingale component needs zooming/panning capabilities that are compatible with `nightingale-manager`.

## Usage

Extend from `NightingaleZoomable` instead of `HTMLElement` to have a nightingale zoom-compatible object.

```javascript
class YourComponent extends NightingaleZoomable {
  // Here Your Code

  // Remember to implement a refresh method. This one wil be called on zooming events
  refresh() {
    // Anywhere you need the X position in pixels of a given base you can get it this way
    const xPosition = this.getXFromSeqPosition(5);
  }
}
```

_Note_: The `svg` DOM element of your component needs to be assigned to `this.svg` whenever you create it.
It is in this point that `zoomable` attach the listeners of zoom/pan events.

## Base coordinates and Seq positions

In this section I'll try to explain the coordinate system for _Nightingale_ components.
And how this is implemented for _zoomable_ components.

The following example shows the logic to implement a `sequence` component, but the concepts should be the same for any
type of track or component that needs to display coordinates that are aligned with other _Nightingale_ components.

Given the following sequence of 10 amino acids: `xxABCxxxxx`

Let's assume the width given to the component is 100px, and the left and right margin has been set to 5 pixels.

Now if we use the `nightingale-sequence` component specifying the coordinates to display between 3 and 5 (included).
The code should be something like:

_HTML:_

```html
<nightingale-sequence id="seq1" length="10" displaystart="3" displayend="5" />
```

_JavaScript:_

```javascript
document.querySelector("#seq1").data = "xxABCxxxxx";
```

The result of this should be something like:

```
     3   4   5           -> Sequence Position
|  |           |  |
|  |---|---|---|  |
|  | A | B | C |  |
|  |---|---|---|  |
|  |           |  |
|  |           |  |
0  5           95 100    -> Pixels
```

A couple of things to notice here:

- The first base in the sequence correspond to position _1_.
  And therefore in the given example position 3 correspond to the base A.
- The sequence base indicated in the`displayend` parameter, is included in the graphic.
  That's why _C_ which position is _5_ is included in the result.
- Because of the margin, the actual drawing area is between pixels 5 and 95
- The actual drawing area is the equally divided for each of the visible bases.
  In the example, the actual area is 90, giving each of the bases 30 pixels to be drawn, and including the margin the bases should be draw:

  - _A_: 5 to 34
  - _B_: 35 to 64
  - _C_: 65 to 94

In conclusion, if a component makes sure to be drawn following these rules within the `refresh()` method,
all zooming and padding should work if the component inherits from `NightingaleZoomable`,
and the component is a DOM descendent of `nightingale-manager`.

## How does it work?

We use the _D3_ module `scaleLinear` to calculate the positions,
and connect the _D3_ `zoom` handler to the `svg`.

The interaction with a `zoomable` component has 2 parts:

1. The observed attributes of `nightingale-zoomable` are: `["displaystart", "displayend", "length"]`.
   If any of these attributes changes, the scale gets updated to match the new start/end coordinates and the `refresh` method is called.
2. When a zooming event is trigger, the scale gets updated by scaling the current values.
   A `change` event is dispatched, notifying the new `displaystart` and `displayend` values.  
   If there is a `nightingale-manager` listening to this event, it will propagate the new values to all its registered children, which will trigger the case 1, for any `zoomable` component in there.

## API Reference

### Properties

#### `name: use-shift-to-zoom` `Boolean`

If this attribute is present, the zooming only works while the [Shift] key is pressed.

#### `name: length` `Number`

Number of bases of the sequence to be displayed.

#### `name: displaystart` `Number`

First base to be displayed.

#### `name: displayend` `Number`

Last base to be displayed.

#### `highlight: string (optional)`

A comma separated list of regions to highlight.

Each region follows the format: `[start]:[end]`, where both `[start]` and `[end]` are optional numbers.

Examples:

- `10:20` Highlight from base 10 to 20 including both.
- `10:20,30:40` Highlight from base 10 to 20, and from 30 to 40.
- `:20` Highlight from the first base (1) to 20.
- `10:` Highlight from base 10 to the end of the sequence.
- `:` Highlight the whole sequence.

### Methods

#### `constructor()`

The constructor of this class, initialises the zoom, bind some of its methods, and start listening for resizing events.

#### `connectedCallback()`

- Calculates the width of the component.
- Makes sure the observable attributes get assigned as floats.
- Updates the scale, re-initialises the zoom and the resizing observer.

_Note_: If you are overwriting this method in your component, make sure to call it as `super.connectedCallback();`
inside your method or the zooming functionality might be compromised.

#### `disconnectedCallback()`

Disconnects the resize observer.

#### `observedAttributes()`

The observed attributes are: `["displaystart", "displayend", "length"]`.

_Note_: If you are overwriting this method in your component, make sure to include those defined here,
otherwise the zooming functionality might be compromised. For example:

```javascript
 static get observedAttributes() {
   return NightingaleZoomable.observedAttributes.concat(
     "my_attr",
   );
 }
```

#### `attributeChangedCallback(name, oldValue, newValue)`

- Makes sure the observable attributes get assigned as floats.
- Triggers the re-calculation of the scale.

_Note_: If you are overwriting this method in your component, make sure to call it as
`super.attributeChangedCallback(name, oldValue, newValue);` inside your method or the zooming functionality
might be compromised.

#### `get margin()`

Returns the default values of the margin. you should overwrite this to define your own margins. The default values are:

```json5
{
  top: 10,
  right: 10,
  bottom: 10,
  left: 10,
}
```

#### `getWidthWithMargins()`

Returns the current available width, excluding the margins.

#### `getXFromSeqPosition(position)`

Returns X coordinate in pixels for a given position.
The position should be a number between `1` and the length of the sequence.

#### `getSingleBaseWidth()`

Returns the width of a single base using the current scale.

### Events

#### `change`

It reports a change in the coordinates, which most likely have been caused by a zoom/panning event.
The detail of the event includes the new coordinates. For example:

```json5
{
  detail: {
    displaystart: 3,
    displayend: 5,
  },
}
```

### Events bound to track features

By default, `onmouseover`, `onmouseout` and `onclick` events are attached to _features_. They trigger a `change` event, which is used to update the highlight, but you can also use them to display things like tooltips, as the event payload will contain the data point as well as `x` and `y` coordinates of the click event.
