# HOW TO CREATE AN ADAPTER FOR NIGHTINGALE

This document lists the required steps to create a new component of the type **adapter**.

If you want to visualise your data, it is possible that an existing component offers the visualization you need, and you only need to transform your data into the required format of the component.
The rest of the examples in this page are oriented to create an adaptor for the `protein-track` component.

Adapters are components that are used to trasform data into the format of an specific track.

There are 2 ways of using an adaptor:

- As a web component that wraps a `data-loader`, useful whhen the data is been loaded from the bottom-up. Example:

  ```html
  <my-component>
    <my-adapter>
      <data-loader />
    </my-adapter>
  </my-component>
  ```

- Calling directly the `transformData`, useful when an app already has the data and wants to inject the data programatically. Example:

```javascript
import { transformData } from "protvista-feature-adapter";

//...

const dataForComponent = transformData(myData);
myProtvistaComponent.data = dataForComponent;
```

## Steps To create an adapter

1. Create a folder for your component, and the necessary child directories:
   ```
   mkdir packages/protvista-my-adapter
   mkdir packages/protvista-my-adapter/src
   mkdir packages/protvista-my-adapter/test
   ```
2. Create the `package.json` for this component. for example:

   ```json
   {
     "name": "protvista-my-adapter",
     "version": "2.2.14",
     "files": ["dist", "src"],
     "main": "dist/protvista-my-adapter.js",
     "module": "src/ProtvistaMyAdapter.js",
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

3. Create the `src/index.js` file which will be the entry point for webpack when bundling, and which function is to register the web component to the browser. Example:

   ```javascript
   import ProtvistaMyAdapter from "./ProtvistaMyAdapter";

   if (window.customElements) {
     customElements.define("protvista-my-adapter", ProtvistaMyAdapter);
   }

   export default ProtvistaMyAdapter;
   ```

4. Create the function `transformData()` in the file that has been declared in both `src/index.js` and `package.json`. In the current example would be `src/ProtvistaMyAdapter.js`. So for example imagine you have a server which responses are CSV files, with columns (accession, start, end):
   ```csv
   feature1, 20, 50
   feature2, 60, 70
   feature3, 80, 100
   ```
   And you want to use `protvista-track` to visualise this, then a naive `transformData` function could be:

```javascript
export const transformData = data =>
  data
    .split("\n")
    .map(line => line.split(","))
    .map(([accession, start, end]) => ({
      accession,
      start: Number.parseInt(start),
      end: Number.parseInt(end)
    }));
```

5. Now, in order to be able to use this as a web component, we should:

   1. Create a class that inherits from `HTMLElement`:

      ```javascript
      class ProtvistaFeatureAdapter extends HTMLElement {}
      ```

   2. If somebody sets the parameter `data` of the adapter, we should transform the data and trigger a `load` event, so the parent component can use it.
      ```javascript
      class ProtvistaFeatureAdapter extends HTMLElement {
        set data(data) {
          this._data = transformData(data);
          this._emitEvent();
        }
        _emitEvent() {
          this.dispatchEvent(
            new CustomEvent("load", {
              detail: {
                payload: this._data
              },
              bubbles: true,
              cancelable: true
            })
          );
        }
      }
      ```
   3. Listen to the `load` event that a child component can dispatch (e.g. `<data-loader>`). We can add an event listener to do this in the `connectedCallback()` method, which is executed when a web component is mounted

   ```javascript
   // ...
   class ProtvistaFeatureAdapter extends HTMLElement {
     // ...
     connectedCallback() {
       this.addEventListener("load", e => {
         if (e.target !== this) {
           e.stopPropagation();
           try {
             if (e.detail.payload.errorMessage) {
               throw e.detail.payload.errorMessage;
             }
             this.data = e.detail.payload; // which in turn will dispatch the event.
           } catch (error) {
             this.dispatchEvent(
               new CustomEvent("error", {
                 detail: error,
                 bubbles: true,
                 cancelable: true
               })
             );
           }
         }
       });
     }
   }
   ```

6. Create a test that checks your functionality. The name of the test file should have the double extension `.spec.js`, and in this way the tests will be included when running the whole test suite.
   We are using [jest](https://jestjs.io/) in our project, so a very basic test for the developed component is to have some data transformed and save the snapshot. For example

   ```javascript
   import { transformData } from "../src/ProtvistaMyAdapter";

   const data = `feature1, 20, 50
   feature2, 60, 70
   feature3, 80, 100`;

   describe("ProtvistaMyAdapter tests", () => {
     it("should transform the data correctly", () => {
       const transformedData = transformData(data);
       expect(transformedData).toMatchSnapshot();
     });
   });
   ```

```

As a reference you can check the code of the `protvista-interpro-adapter` component [Here](https://github.com/ebi-webcomponents/nightingale/tree/master/packages/protvista-interpro-adapter), which was developed following this steps.
```
