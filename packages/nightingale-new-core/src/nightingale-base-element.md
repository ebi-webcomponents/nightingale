### NightingaleElement

The base element for any Nightingale component. Inherits from [LitElement](https://lit.dev/docs/api/LitElement/).

Any logic that should be shared for all the components should be included here. Currently the only thing is doing, is setting the render root of the components in the element itself, instead of shadowDOM, the Lit element default.
