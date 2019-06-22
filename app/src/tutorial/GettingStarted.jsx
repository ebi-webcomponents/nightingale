import React, { Fragment, useEffect } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "./GettingStarted.css";

const GettingStarted = () => {
  useEffect(() => {
    const d3Script = document.createElement("script");
    d3Script.src = "https://cdn.jsdelivr.net/npm/d3@5.9.2/dist/d3.min.js";
    document.body.appendChild(d3Script);

    const navScript = document.createElement("script");
    navScript.src =
      "https://cdn.jsdelivr.net/npm/protvista-navigation@2.1.12/dist/protvista-navigation.min.js";
    document.body.appendChild(navScript);
  });
  return (
    <Fragment>
      <h1>Getting started</h1>
      <p>
        Nightigale is a library of re-usable data visualisation Web Components,
        which can be used to display protein sequence features (ProtVista),
        variants, interaction data, 3D structure etc... These components are
        flexible, allowing you to easily view multiple data sources (UniProt
        API, your own resource, etc...) within the same context.
      </p>
      <p>
        You can use the components anywhere you use HTML, either natively (see{" "}
        <a href="#using_the_cdn">Using the CDN</a>) or with a framework like
        React (<a href="#using_modules">Using modules</a>).
      </p>
      <h2 id="using_the_cdn">1. Using the CDN</h2>
      <p>
        All the components are compiled down to ES5 before being distributed
        via&nbsp;
        <a href="https://jsdelivr.com">jsDelivr</a>.
      </p>
      <h3>Dependencies & Polyfills</h3>
      Even though browser support is increasing for Custom Elements, you still
      need to use a polyfill if you need your components to work in Edge and IE
      (see <a href="https://caniuse.com/#feat=custom-elementsv1">here</a> for
      latest compatibility). See{" "}
      <a href="https://github.com/webcomponents/polyfills/tree/master/packages/custom-elements">
        Web Components polyfill
      </a>{" "}
      for information on how to add polyfill, or simply add the following lines
      to your HTML file:
      <SyntaxHighlighter>
        {`
    <script src="https://cdn.jsdelivr.net/npm/babel-polyfill/dist/polyfill.min.js" defer></script>
    <!-- Web component polyfill (only loads what it needs) -->
    <script src="https://cdn.jsdelivr.net/npm/@webcomponents/custom-elements@latest/custom-elements.min.js" defer></script>
    <!-- Required to polyfill modern browsers as code is ES5 for IE... -->
    <script src="https://cdn.jsdelivr.net/npm/@webcomponents/custom-elements@latest/src/native-shim.js" defer></script>`}
      </SyntaxHighlighter>
      <p>
        Most components use D3js. Instead of bundling the library with every
        component, we thought it would be better to load it separately, so you
        will need to add it like this:
      </p>
      <SyntaxHighlighter>
        {`
    <script src="https://cdn.jsdelivr.net/npm/d3@5.9.2/dist/d3.min.js" defer></script>
        `}
      </SyntaxHighlighter>
      <h3>Display your first component</h3>
      <p>
        Using a component is as easy as importing it to your HTML and using it
        like you would a regular HTML tag. Let's display the{" "}
        <code>protvista-navigation</code> component, used in ProtVista to zoom
        and navigate a protein sequence (note: <code>length</code> represents
        the protein length in amino-acids):
      </p>
      <SyntaxHighlighter>
        {`
    <script src="https://cdn.jsdelivr.net/npm/protvista-navigation@latest/dist/protvista-navigation.js" defer></script>
    <protvista-navigation length="223"/>
    `}
      </SyntaxHighlighter>
      <p>You should see this:</p>
      <protvista-navigation length="223" />
      <h3>Loading data</h3>
      <p>
        We provide a <code>data-loader</code> component, which emmits an event
        caught by <code>protvista-track</code> when it is done. It also caches
        data in the window, preventing multiple requests to be made to the same
        url. Because the data returned by an API is not necesseraly in the
        format expected by <code>protvista-track</code>, we also provide some
        components to transform the data. We call these 'data-adapters', and
        they sit between the <code>data-loader</code> and{" "}
        <code>protvista-track</code> components.
      </p>
      <SyntaxHighlighter>
        {`
    <script src="https://cdn.jsdelivr.net/npm/data-loader@latest/dist/data-loader.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/protvista-feature-adapter@latest/dist/protvista-feature-adapter.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/protvista-track@latest/dist/protvista-track.js" defer></script>

    <protvista-track length="770">
      <protvista-feature-adapter>
        <data-loader>
           <source src="https://www.ebi.ac.uk/proteins/api/features/P05067?categories=PTM"/>
        </data-loader>
      </protvista-feature-adapter>
    </protvista-track>

    `}
      </SyntaxHighlighter>
      <h2 id="using_modules">2. Using modules</h2>
    </Fragment>
  );
};

export default GettingStarted;
