# `<protvista-zoomable>`
A custom element to be inherited from if a Nithingale component needs zooming/panning capabilities that are compatible with `protvista-manager`.

## Usage
```html
class YourComponent extends ProtvistaZoomable {
    // Here Your Code
    
    // Remember to implement a refresh method. This one wil be called on zooming events
    refresh() {
        // Anywhere you need the X position in pixels of a given base you can get it this way
        const xPosition = this.getXFromSeqPosition(5); 
    }
}
```

## Base coordinates and Seq positions

In this section I'll try to explain the coordinate system for _Nightingale_ components.
And how this is implemented for _zoomable_ components.

The following example shows the logic to implement a `sequence` component, but the concepts should be the same for any 
type of track or component that needs to display coordinates that are aligned with other _Nightingale_ components.

Given the following sequence of 10 amino acids: `xxABCxxxxx` 

Let's assume the width given to the component is 100px, and the left and right margin has been set to 5 pixels.

Now if we use the `protvista-sequence` component specifying the coordinates to display between 3 and 5 (included). 
The code should be something like:

*HTML:*
```html
        <protvista-sequence
          id="seq1"
          length="10"
          displaystart="3"
          displayend="5"
        />
```

*JavaScript:*
```javascript
document.querySelector("#seq1").data = 'xxABCxxxxx';
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
* The first base in the sequence correspond to position _1_. 
  And therefore in the given example position 3 correspond to the base A.
* The sequence base indicated in the`displayend` parameter, is included in the graphic. 
  That's why _C_ which position is _5_ is included in the result.
* Because of the margin, the actual drawing area is between pixels 5 and 95
* The actual drawing area is the equally divided for each of the visible bases. 
  In the example, the actual area is 90, giving each of the bases 30 pixels to be drawn, and including the margin the bases should be draw:
  * *A*: 5 to 34
  * *B*: 35 to 64 
  * *C*: 65 to 94
  
In conclusion, if a component makes sure to be drawn following these rules within the `refresh()` method, 
all zooming and padding should work if the component inherits from `ProtvistaZoomable`, 
and the component is a DOM descendent of `protvista-manager`.    

## API Reference

### Properties
#### `name: type`
A property.

### Events
#### `my-event`
An event that does things.
