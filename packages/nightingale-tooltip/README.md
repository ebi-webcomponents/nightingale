# nightingale-tooltip

!Not published

Tooltip component that is triggered when user selects a track. Tooltip shows feature accession as `title` and contents include `description` and `evidence`.

Does not affect sequence highlighting by `nightingale-track`

## Usage

```html
<nightingale-manager reflected-attributes="attr1 attr2">
  <other-nightingale-component attr1="X" attr2="Y" />
  <nightingale-tooltip></nightingale-tooltip>
</nightingale-manager>
```

## API Reference

### Properties

#### `showTooltip(x: number, y: number, content: { description: string; evidence: string }, accession: string)`:

x and y: coordinates of MouseEvent (click)
Hides any current open tooltip, and opens a new one with the given parameters. Sets visible flag on `nightingale-tooltip` component to true.

#### `unregister(element: NightingaleElement)`:

Sets visible flag on `nightingale-tooltip` component to false.

### Property

#### `title: string | ""`

#### `visible: boolean | false`

#### `tooltipContent: { description: string, evidence: string } | { description: "", evidence: "" }`

#### `container: string | "html"`
