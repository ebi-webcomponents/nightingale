# Getting started

Nightingale is a library of re-usable data visualisation Web Components, which
can be used to display protein sequence features (ProtVista), variants,
interaction data, 3D structure, etc. These components are flexible, allowing you
to easily view multiple data sources (UniProt API, your own resource, etc)
within the same context.

You can use the components anywhere you use HTML, either natively (see
[Using a CDN](#using_a_cdn) or [Using modules](#using_modules)), or with a library like React (see [Using a library or framework](#usage_with_popular_libraries_and_frameworks)).

## Using Modules

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
<script
  src="https://cdn.jsdelivr.net/npm/babel-polyfill/dist/polyfill.min.js"
  defer
></script>
<!-- Web component polyfill (only loads what it needs) -->
<script
  src="https://cdn.jsdelivr.net/npm/@webcomponents/custom-elements@latest/custom-elements.min.js"
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
<script
  src="https://cdn.jsdelivr.net/npm/d3@5.9.2/dist/d3.min.js"
  defer
></script>
```

### Display your first component

Using a component is as easy as importing it to your HTML and using it like you
would a regular HTML tag. Let's display the `protvista-navigation` component,
used in ProtVista to zoom and navigate a protein sequence (note: `length`
represents the protein length in amino-acids):

```html
<script
  src="https://cdn.jsdelivr.net/npm/protvista-navigation@latest/dist/protvista-navigation.js"
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
and they sit between the `data-loader` and `protvista-track` components.

```html
<script
  src="https://cdn.jsdelivr.net/npm/protvista-utils@latest/dist/protvista-utils.js"
  defer
></script>
<script
  src="https://cdn.jsdelivr.net/npm/data-loader@latest/dist/data-loader.js"
  defer
></script>
<script
  src="https://cdn.jsdelivr.net/npm/protvista-feature-adapter@latest/dist/protvista-feature-adapter.js"
  defer
></script>
<script
  src="https://cdn.jsdelivr.net/npm/protvista-zoomable@latest/dist/protvista-zoomable.js"
  defer
></script>
<script
  src="https://cdn.jsdelivr.net/npm/protvista-track@latest/dist/protvista-track.js"
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
