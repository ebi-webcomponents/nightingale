# Nightingale

Nightingale is a library of re-usable data visualisation Web Components, which
can be used to display protein sequence features (ProtVista), variants,
interaction data, 3D structure, etc. These components are flexible, allowing you
to easily view multiple data sources (UniProt API, your own resource, etc)
within the same context.

## Versions

This is the landing page for the version 3.0; which we are not longer mantaining, but the components are still available in npm.

We are working on migrating all the components, using [Lit](https://lit.dev/) and
[TypeScript](https://www.typescriptlang.org/) as our codebase. Read more about the components of version 4.0 [here](https://ebi-webcomponents.github.io/nightingale/) (currently on Beta).

## Getting started (v3)

You can use the components anywhere you use HTML, either natively (see
[Using a CDN](#using_a_cdn) or [Using modules](#using_modules)), or with a library like React (see [Using a library or framework](#usage_with_popular_libraries_and_frameworks)).

## Using Modules (v3)

All components are exported as modules. This means you can import them as any
other ES6 module in your application:

```js
import ProtvistaTrack from "protvista-track";
```

You then need to register them as custom elements:

```js
window.customElements.define("protvista-track", ProtvistaTrack);
```

If you use a lot of components, it might be worth defining a function to do
this:

```js
export default (name, constructor) => {
  if (!window.customElements.get(name)) {
    window.customElements.define(name, constructor);
  }
};
```

You can now use the component directly in your application as you would any
other html component.

## Using a CDN

All the components are compiled down to ES5 before being distributed via
[jsDelivr](https://jsdelivr.com).

### Dependencies and polyfills

Even though browser support is increasing for Custom Elements, you still
need to use a polyfill if you need your components to work in old versions of
Edge or in Internet Explorer
([See here for latest compatibilities](https://caniuse.com/#feat=custom-elementsv1)).
See [Web Components polyfill](https://github.com/webcomponents/polyfills/tree/master/packages/custom-elements)
for information on how to add polyfill, or simply add the following lines
to your HTML file:

```html
<script src="https://cdn.jsdelivr.net/npm/babel-polyfill" defer></script>
<!-- Web component polyfill (only loads what it needs) -->
<script
  src="https://cdn.jsdelivr.net/npm/@webcomponents/custom-elements@latest"
  defer
></script>
<!-- Required to polyfill modern browsers as code is ES5 for IE... -->
<script
  src="https://cdn.jsdelivr.net/npm/@webcomponents/custom-elements@latest/src/native-shim.js"
  defer
></script>
```

Most components use D3js. Instead of bundling the library with every component,
we thought it would be better to load it separately, so you will need to add it
like this:

```html
<script src="https://cdn.jsdelivr.net/npm/d3@5.9.2" defer></script>
```

### Display your first component

Using a component is as easy as importing it to your HTML and using it like you
would a regular HTML tag. Let's display the `protvista-navigation` component,
used in ProtVista to zoom and navigate a protein sequence (note: `length`
represents the protein length in amino-acids):

```html
<script
  src="https://cdn.jsdelivr.net/npm/protvista-navigation@latest"
  defer
></script>
<protvista-navigation length="223" />
```

### Loading data

We provide a `data-loader` component, which emmits an event caught by
`protvista-track` when it is done. It also caches data in the window, preventing
multiple requests to be made to the same url. Because the data returned by an
API is not necesseraly in the format expected by `protvista-track`, we also
provide some components to transform the data. We call these 'data-adapters',
and there are different ways you can use them:

#### 1. Using events

As both the `data-loader` component and 'data-adapters' emit events that bubble up
containing the data, they can just sit between the `data-loader` and `protvista-track` components like shown below.
As the `data-loader` caches requests, it doesn't matter if you call the same
url multiple times.

```html
<script
  src="https://cdn.jsdelivr.net/npm/protvista-utils@latest"
  defer
></script>
<script src="https://cdn.jsdelivr.net/npm/data-loader@latest" defer></script>
<script
  src="https://cdn.jsdelivr.net/npm/protvista-feature-adapter@latest"
  defer
></script>
<script
  src="https://cdn.jsdelivr.net/npm/protvista-zoomable@latest"
  defer
></script>
<script
  src="https://cdn.jsdelivr.net/npm/protvista-track@latest"
  defer
></script>

<protvista-track length="770">
  <protvista-feature-adapter>
    <data-loader>
      <source
        src="https://www.ebi.ac.uk/proteins/api/features/P05067?categories=PTM"
      />
    </data-loader>
  </protvista-feature-adapter>
</protvista-track>
```

#### 2. Using subscribers

If you prefer to keep your tracks and your data loading/transformation separate,
you can do that by using the _subscribers_ attribute, which takes a comma-separated
list of selectors. This is particularly useful when you want to share the data
between different components, for instance tracks and data tables.

```html
<protvista-feature-adapter subscribers="#my-protvista-track">
  <data-loader>
    <source
      src="https://www.ebi.ac.uk/proteins/api/features/P05067?categories=MOLECULE_PROCESSING"
    />
  </data-loader>
</protvista-feature-adapter>
<protvista-track length="770" id="my-protvista-track" />
```

#### 3. Using _data-adapters_ as modules

If you prefer to handle the data transformation from whithin your application, each _data-adapter_ exports a
`transformData(data)` function.

## Usage with popular libraries and frameworks

Since this project relies on a web standard, namely
[custom-elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements), its use should be made easier and cross-library bugs and
unwanted interactions should be reduced grandly.

Depending on the library or framework you are using, you might want to consider
[having a look here](https://custom-elements-everywhere.com/) to check possible
pitfalls and consider workarounds.

### React

If you decide to use your own data loaders, the recommended way is to use `ref`s
so you can then use the component's API to deal with asynchronicity:

```js
...
const trackContainer = useRef(null);

useEffect(()=> {
  if(trackContainer) {
    trackContainer.current.data = data;
  }
}, [data]);


return <protvista-track ref={trackContainer}/>;
...
```

Or you can decided to use a helper component that would bridge the gap between
the React way of doing things and the standard Custom Element's:

- [`<ReactPropertySetter />` to set properties on elements (instead of just the attribute as React does)](https://www.npmjs.com/package/react-property-setter)
- [`<ReactEventEmitter />` to emit events from data in React](https://www.npmjs.com/package/react-event-emitter)

### Vue

A starter example of how to use Nightingale with Vue can be found in the [`examples/basic_vue`](https://github.com/ebi-webcomponents/nightingale/blob/master/examples/basic_vue) directory in the repository.

These are the necessary steps to import and register components in Vue:

1. Ignore the elements you import from Nightingale in the `ignoredElements` configuration parameter of the `Vue` object (failing to perform this step might results in compilation errors).
2. `npm install`, then import and register Nightingale components in the `<script>` section of Vue components:

   ```vue
   <script>
   import ProtvistaSequence from "protvista-sequence";

   window.customElements.define("protvista-sequence", ProtvistaSequence);
   </script>
   ```

You can then use the Nightingale component in the `<template>` section of your Vue Component (in this case, you could use a `<protvista-sequence />` track).

#### Data and event handling

If you want to bind data to attributes of Nightingale components via Vue, you can do it like so:

```vue
<template>
  <protvista-sequence :length="sequence.length" :sequence="sequence" />
</template>

<script>
import ProtvistaSequence from "protvista-sequence";

window.customElements.define("protvista-sequence", ProtvistaSequence);

export default {
  name: "ProtvistaContainer",
  data() {
    return {
      sequence: "SEQVENCE",
    };
  },
};
</script>
```

If you want your Nightingale components to react to events within the Vue environment, you should use `refs` like so:

```vue
<template>
  <protvista-track ref="features" length="350" />
</template>

<script>
import ProtvistaTrack from "protvista-track";

window.customElements.define("protvista-track", ProtvistaTrack);

export default {
  name: "ProtvistaContainer",
  mounted() {
    const features = [
      {
        accession: "NLS",
        start: 1,
        end: 3,
        color: "#d8b365",
      },
    ];

    this.$refs.features.data = features;
  },
};
</script>
```
