# Components Migration

This are the steps I'm doing to migrate a component to the new nightingale

1. check the component in `master` and in `hackathon-2020_more-tests`.
   - `master` should have the most recent stable version of the component.
   - `hackathon-2020_more-tests` should have a version from 2020 with the first attempt of using the **withMixin** strategy, and the names in this branch have already been moved to the format `nightingale-xxx`. Plus there might be some tests already for that component.
2. If the component exists in `hackathon-2020_more-tests` copy it from there and try to include any code changes that have only been commited in `master`. Otherwise copy the component from `master`.
3. Remove any `dist/` or `node_modules/` folders in the package.
4. Update `package.json` set version as `4.0.0` as this will be the first version `nightingale-xxx`

- We are setting up like this for each module.
  ```
  "main": "dist/index.js",
  "module": "dist/index.js",
  "type": "module",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "rollup --config ../../rollup.config.mjs"
  },
  "publishConfig": {
    "access": "public"
  },
  ```

5. Copy `tsconfig.json` from a package already migrated
6. Rename the files in the `src/` as `.ts`
7. Changes related to the new nightingale core
   - The component should extend from `NightingaleElement`, applying the required mixinsFor example if the component is going to use the margin and the highlight mixins: `class NewComponent extends withMargin(withHighlight(NightingaleElement)) {`
   - Use Lit to define the element attributes. e.g. `@property({ type: String })`
   - Add a `render` method. If using D3, this is likely to be a single DOM element to use as container. e.g.
   ```
   render() {
     return html`<svg class="container"></svg>`;
   }
   ```
   Then you can put the D3 logic in method that is invoked in `updated()` `firstUpdate()` or whenever it is logically correct in the Lit component flow.
   - Solve all the TS issues!!!!
8. Create a story in `stories/` and you can use storybook to test the component
