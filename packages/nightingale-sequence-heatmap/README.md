# nightingale-sequence-heatmap

Nightingale Sequence Heatmap component is used to generate a heatmap visualisation with residue bound data.

It uses [heatmap-component](https://www.npmjs.com/package/heatmap-component) to render the canvas heatmap.

##### Attributes

###### `hm-highlight-width: number (default 0)`

Number of pixels for the border width of the heatmap. See [live demos](https://github.com/PDBeurope/heatmap-component/#live-demos)
for examples with border width 1.

## Usage

The below example shows how to instantiate the component

```html
<nightingale-sequence-heatmap
  id="id-for-nightingale-sequence-heatmap"
  heatmap-id="seq-heatmap"
  width="400"
  height="400"
  hm-highlight-width="0"
  highlight-event="onmouseover"
  highlight-color="#EB3BFF66"
></nightingale-sequence-heatmap>
```

Please note that after instantiation the component needs to be initialized using the setHeatmapData function as seem below:

```javascript
const xDomain = [1, 2, 3]; // 1-indexed residue ids
const yDomain = ["A", "B", "C"]; // categories (rows) to show on heatmap
const data = [
  // array of objects to be displayed, see more info on API Reference
  { xValue: 1, yValue: "A", score: 0.4 },
  { xValue: 1, yValue: "B", score: 32 },
  { xValue: 1, yValue: "C", score: 1.6 },
  { xValue: 2, yValue: "A", score: 2.5 },
  { xValue: 2, yValue: "B", score: 1 },
  { xValue: 2, yValue: "C", score: 7.6 },
  { xValue: 3, yValue: "A", score: 25.0 },
  { xValue: 3, yValue: "B", score: 10 },
  { xValue: 3, yValue: "C", score: 6 },
];
customElements.whenDefined("nightingale-sequence-heatmap").then(() => {
  document
    .getElementById("id-for-nightingale-sequence-heatmap")
    .setHeatmapData(xDomain, yDomain, data); // initialization function
});
```

## API Reference

### Properties

#### `setHeatmapData(xDomain: number[], yDomain: string[], data: Array)`

The data array is of the HotmapData structure.

Please note that this format is flexible to additional properties for specific use cases ([key: string]: any;)

```typescript
interface HotmapData {
  xValue: number; // residue index (columns)
  yValue: string; // category type (rows)
  score: number; // heatmap value converted to colors
  [key: string]: unknown; // additional properties for specific use cases such as custom tooltips
}
```

## Heatmap-component Reference

### Useful functions

#### `setColor((d: HotmapData) => {})`

Allows dynamic setting of heatmap color palette

```javascript
customElements.whenDefined("nightingale-sequence-heatmap").then( async() => {
  const heatmapElement = document.getElementById(
    "id-for-nightingale-sequence-heatmap",
  );
  heatmapElement.setHeatmapData(xDomain, yDomain, data);

  const colorScale = d3.scaleLinear(
    // Score value domain:
    [0, 0.1132, 0.2264, 0.3395, 0.4527, 0.5895, 0.7264, 0.8632, 1],
    // Corresponding colors:
    ["#2166ac", "#4290bf", "#8cbcd4", "#c3d6e0", "#e2e2e2", "#edcdba", "#e99e7c", "#d15e4b", "#b2182b"] 
  );

  await heatmapElement.updateComplete.then(() => {
    heatmapElement.heatmapInstance.setColor((d) => colorScale(d.score));
  });
});
```

#### `setTooltip((d: HotmapData, x: number, y: number, xIndex: number, yIndex: number) => {})`

Allows dynamic setting of tooltip HTML content

```javascript
customElements.whenDefined("nightingale-sequence-heatmap").then( async() => {
  const heatmapElement = document.getElementById(
    "id-for-nightingale-sequence-heatmap",
  );
  heatmapElement.setHeatmapData(xDomain, yDomain, data);
  
  await heatmapElement.updateComplete.then(() => {
    heatmapElement.heatmapInstance.setTooltip((d, x, y, xIndex, yIndex) => {
      let returnHTML = `
        <b>You are at</b> <br />

        x,y: <b>${d.xValue},${d.yValue}</b><br />
        score: <b>${d.score}</b>`;
      return returnHTML;
    });
  });
});
```
