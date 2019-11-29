# HOW TO CREATE A BASIC COMPONENT (Hello World)

This document documents the cration of a basic Nightingale component.

## Steps to get a Hello World component.

1. Create the folder for your component under the `packages/` folder. This will ensure that the scripts defined in the main `package.json` can operate in the new component.
   ```bash
   mkdir packages/protvista-hello
   ```
2. Create a folder for your source code `src/` and one for your tests `test/`:
   ```bash
   mkdir packages/protvista-overlay/src
   mkdir packages/protvista-overlay/test
   ```
3. Create the `package.json` for the new component. Here is an example of its content:

   ```javascript
   {
     "name": "protvista-hello",
     "version": "2.2.14",
     "files": [ "dist", "src" ],
     "main": "dist/protvista-hello.js",
     "module": "src/ProtvistaHello.js",
     "keywords": ["nightingale", "webcomponents", "customelements"],
     "repository": {
       "type": "git",
       "url": "https://github.com/ebi-webcomponents/nightingale.git"
     },
     "bugs": {
       "url": "https://github.com/ebi-webcomponents/nightingale/issues"
     },
     "homepage": "https://ebi-webcomponents.github.io/nightingale/"
   }

   ```

4. Create the entrypoint for webpack. The current setup of the nightingale project, looks for `src/index.js`:
   ```javascript
   import ProtvistaHello from "./ProtvistaHello";
   if (window.customElements) {
     customElements.define("protvista-hello", ProtvistaHello);
   }
   export default ProtvistaHello;
   ```
5. Create the file where the code of your custom element will be. In our example `src/ProtvistaHello.js`.

   1. To start we can create a Hello world document with this code:

      ```javascript
      class ProtvistaHello extends HTMLElement {
        connectedCallback() {
          this.render();
        }

        render() {
          this.innerHTML = "Hello World.";
        }
      }

      export default ProtvistaHello;
      ```

      Here are some notes of this code:

      - A very similar code up to this point can be seen in this [commit](8f23f1fe159052598fe59b0aba1f413fcc47bac3), for the `<protvista-overlay>` component.
      - Nightingale components follow the Custom element standard of [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components), hence the class ineriting from `HTMLElement`.
      - The method `connectedCallback()` is part of the API of custom elements, and is invoked when the component is mounted in the DOM.
      - The mothod `render()` has not especial meaning in the API and in this case is only called by `connectedCallback()`.
      - Other components (e.g. `<protvista-saver>`) use [lit-html](https://lit-html.polymer-project.org/), in which case `render()` has an especial meaning.

   2. You can try out the new component by including it in the logic of the showcase app for nightingale. See below the diff of the file that includes `<protvista-overlay>` as an example, or you can check the [commit in GitHub](16d2e9cbf778c590566518c862bddc959ae4d716).

      ```diff
      diff --git a/app/src/components/ProtvistaManager.jsx b/app/src/components/ProtvistaManager.jsx
      index afe5fb7..3199635 100644
      --- a/app/src/components/ProtvistaManager.jsx
      +++ b/app/src/components/ProtvistaManager.jsx
      @@ -16,6 +16,7 @@ import sequence from "../mocks/sequence.json";
      import { dataIPR, signatures, withResidues } from "../mocks/interpro";
      import secondaryStructureData from "../mocks/interpro-secondary-structure.json";
      import ProtvistaSaver from "protvista-saver";
      +import ProtvistaOverlay from "protvista-overlay";
      import Readme from "./Readme";
      import readmeContent from "../../../packages/protvista-manager/README.md";

      @@ -74,6 +75,7 @@ class ProtvistaManagerWrapper extends Component {
          loadWebComponent("data-loader", DataLoader);
          loadWebComponent("protvista-variation-adapter", ProtvistaVariationAdapter);
          loadWebComponent("protvista-saver", ProtvistaSaver);
      +    loadWebComponent("protvista-overlay", ProtvistaOverlay);
          return (
            <Fragment>
              <Readme content={readmeContent} />
      @@ -86,6 +88,7 @@ class ProtvistaManagerWrapper extends Component {
              >
                <button>Download Just Tracks</button>
              </protvista-saver>
      +        <protvista-overlay />
              <protvista-manager
                attributes="length displaystart displayend variantfilters highlight"
                displaystart="53"
      ```

   3. Now you can start the showcase app. This will run `webpack-dev-server` and open the app in your browser, you can then go to the Manager component, and you will see the `"Hello world."` message as part of the example.
      ```bash
      yarn start
      ```
