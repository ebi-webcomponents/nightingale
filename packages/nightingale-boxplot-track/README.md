# nightingale-boxplot-track

[![Published on NPM](https://img.shields.io/npm/v/@nightingale-elements/nightingale-boxplot-track.svg)](https://www.npmjs.com/package/@nightingale-elements/nightingale-boxplot-track)

Nightingale boxplot track component is used to display the distribution of a variable at each sequence position using boxplots. It allows displaying multiple distribution datasets, rendered side-by-side at each sequence position.

Most of the rendering is implemented via HTML canvas, but some non-critical parts are implemented via SVG (e.g. highlights).

## Usage

```html
<nightingale-boxplot-track
    id="track"
    width="600" height="200"
    length="3"
    y-min="0" y-max=""
    show-axis
    show-nested-highlights
    zoomed-out-outline="whiskers"
    column-gap="0.2" box-gap="0.1" whisker-width="0.6" outlier-jitter-width="0.4"
    outlier-radius="2"
    zoom-transition-range="4-5"
    margin-left="30" margin-right="10" margin-top="5" margin-bottom="5" margin-color="#ffffffee"
    highlight-event="onmouseover" highlight-color="#eb3bff22"
    use-ctrl-to-zoom
></nightingale-boxplot-track>
```

#### Setting the data through property

```typescript
await customElements.whenDefined('nightingale-boxplot-track');
const track = document.getElementById('track');
if (track) {
    // Showing 2 datasets on a sequence of 3 amino acids:
    (track as any).data = [
        {
            name: 'Blue dataset',
            color: '#0088ff',
            positions: [
                { position: 1, values: [0.2, 0.5, 0.7, 0.9] },
                { position: 2, values: [0.1, 0.3, 0.5, 0.8] },
                { position: 3, values: [0.0, 0.2, 0.6, 0.8] },
            ],
        },
        {
            name: 'Orange dataset',
            color: '#ff8800',
            positions: [
                { position: 1, values: [0.1, 0.3, 0.5, 0.8] },
                { position: 2, values: [0.0, 0.2, 0.6, 0.8] },
                { position: 3, values: [0.2, 0.5, 0.7, 0.9] },
            ],
        },
    ];
}
```

The `data` property expects a value of type `BoxplotData` - an array of datasets, where each dataset has the following structure:

```typescript
{
    name: string,
    color?: string,
    positions: Array<{
        position: number,
        values: Array<number>,
    }>,
}
```

The component will compute the median, quartiles, whiskers, and outliers from the values array for each position.

## Visualization description

The components displays a boxplot at each sequence position where data have been provided (or multiple boxplots if there are multiple dataset).
Each boxplot shows the following data:

```
   •     ╮┄┄┄┄┄┄┄┄ Maximum
   ••    │ Outliers high
  ••     ╯
 ──┬──   - Whisker high (highest value <= Q3 + 1.5 * IQR)
   │
   │
┌──┴──┐  - Box high = Q3
┝━━━━━┥  - Median
│     │
└──┬──┘  - Box low = Q1
   │
 ──┴──   - Whisker low (lowest value >= Q1 - 1.5 * IQR)
  •••    ╮
    •    │ Outliers low
  ••     ╯┄┄┄┄┄┄┄┄ Minimum
```

\* Q1 = lower quartile, Q3 = upper quartile, IQR = Q3 - Q1 = interquartile range.

### "zoomed-out" visualization

When the view becomes too much zoomed-out and boxplots become poorly visible, the component will switch from boxplot visualization to simplified "zoomed-out" visualization. This visualization shows the median at each position in darker color, and optionally a lighter shaded outline representing extremes or whisker range or box range, depending on the `zoomed-out-outline` attribute (default: whisker range). The `zoom-transition-range` attributes controls when exactly this transition happens. If there are multiple datasets, they are overlaid on one another, being distinguishable by their color (rather then displayed side-by-side as boxplots).

### Downsampling

When the view becomes over more zoomed-out (column width < 1 screen pixel), the component will downsample the displayed simplified visualization data. This is done to ensure performance for very long sequences and shouldn't be visually noticeable.

## API Reference

### Attributes

#### `y-min?: number, y-max?: number`

Bottom and top limit for the Y-axis. If either of these is not set, it will be inferred from the data (minimum/maximum of all data values).

#### `show-axis?: boolean (default: false)`

Turn on or off displaying the vertical axis.

The axis is rendered in the left margin of the component. The margin attributes must be set accordingly to provide enough space for the axis (e.g. `margin-left="30"`).

#### `show-nested-highlights?: boolean (default: false)`

Turn on or off displaying nested hightlights. Nested hightlights indicate the selected subcolumn (dataset) within the highlighted column (sequence position). This applies only when multiple datasets are displayed.

#### `zoomed-out-outline?: "extremes" | "whiskers" | "box" | "none" (default: "whiskers")`

Choose what kind of data is shown as the shaded outline in the simplified zoomed-out view (in addition to the darker lines showing median).

-   `"extremes"` - the outline covers the range between minimum and maximum;
-   `"whiskers"` - the outline covers the same range as the whiskers in the boxplot;
-   `"box"` - the outline covers the same range as the box in the boxplot (quartiles);
-   `"none"` - no outline is rendered.

#### `column-gap?: number (default: 0.2)`

Width of the gap between displayed columns, relative to the base width (width of one sequence position).

(= _Column gap_ / _Base width_ in the figure below)

#### `box-gap?: number (default: 0.1)`

Width of the gap between boxes within a column, relative to the column width divided by the number of datasets (= _Box gap_ / (_Column width_ / _N datasets_) = _Box gap_ / (_Box width_ + _Box gap_) in the figure below).

#### `whisker-width?: number (default: 0.6)`

Boxplot whisker width, relative to the box width (= _Whisker width_ / _Box width_ in the figure below).

#### `outlier-jitter-width?: number (default: 0.4)`

Width of random noise added to the X-position of outliers, relative to the box width (= _Outlier jitter width_ / _Box width_ in the figure below).

#### `outlier-radius?: number (default: 2)`

Radius of the circles used to render outliers, in CSS pixels.

#### `zoom-transition-range?: string (default: "4-5")`

Base width(s), in CSS pixels, where the transition from "zoomed-out" simplified visualization to "zoomed-in" boxplot visualization happens.

`zoom-transition-range` can be either one number (for a sharp transition, e.g. `"4"`) or a hyphen-separated range (for a smooth transition, e.g. `"4-5"`).

If there are multiple datasets, this width(s) will be multiplied by the number of datasets, to compensate for narrower space for each dataset.

-   Use `"0"` to always show "zoomed-in" boxplot visualization. (This is not recommended, as it will prevent downsampling and may cause performance issues. However, you can use sufficiently small values, such as `"0.5-1"`, to achieve the same goal without performance issues).

*   Use `"Infinity"` to always show "zoomed-out" visualization.

#### Overview of width measurements

(2 sequence positions with 2 datasets)

```
   Seq. position 1       Seq. position 2
<────────────────────><────────────────────> Base width
┄><────────────────><┄┄><────────────────><┄ Column width, Column gap
  ><─────><><─────><    ><─────><><─────><   Box width, Box gap*
    <───>    <───>        <───>    <───>     Whisker width
    ──┬──    ──┬──        ──┬──    ──┬──
   ┌──┴──┐  ┌──┴──┐      ┌──┴──┐  ┌──┴──┐
   │     │  │     │      │     │  │     │
   ┝━━━━━┥  ┝━━━━━┥      ┝━━━━━┥  ┝━━━━━┥
   │     │  │     │      │     │  │     │
   └──┬──┘  └──┬──┘      └──┬──┘  └──┬──┘
    ──┴──    ──┴──        ──┴──    ──┴──
     •••      • •           ••      • •
       •      •            ••        •
     <─>      <─>          <─>      <─>      Outlier jitter width
```

\* Full _Box gap_ between the boxes in a column, 1/2 _Box gap_ before the first and after the last box in a column

### Events

As `nightingale-boxplot-track` implements from `withZoom` and `withHighlight`, it will respond to zooming changes, highlight events, and emit events when interacting with boxplots (helpful if you want to display tooltips, integrate with other components etc.).

When the user clicks on or hovers over the component, the component emits a `CustomEvent` with type `"change"` and with `detail` of the following structure:

```typescript
{
    eventType: "mouseover" | "mouseout" | "click",
    parentEvent?: Event,
    feature?: {
        type: "boxplot",
        /** Position in the sequence */
        position: number,
        /** Data for the boxplot at this position from all datasets (one item for each dataset) */
        data: Array<{
            /** Common properties of the whole dataset */
            dataset: {
                name: string,
                color: string,
            },
            /** Boxplot data at this position */
            datum?: {
                /** Position in the sequence */
                position: number,
                /** All values of the independent variable at this position */
                values: Float32Array,
                median: number,
                boxLow: number,
                boxHigh: number,
                whiskerLow: number,
                whiskerHigh: number,
                minimum: number,
                maximum: number,
                outliersLow: Float32Array,
                outliersHigh: Float32Array,
            },
        }>,
        /** Index into `data`, indicates which dataset is being pointed at */
        datasetIndex: number,
    } | null,
}
```

### Other attributes and properties

This component inherits from `NightingaleElement`.

The component implements the following mixins: `withCanvas`, `withManager`, `withZoom`, `withResizable`, `withMargin`, `withPosition`, `withDimensions`, `withHighlight`.
