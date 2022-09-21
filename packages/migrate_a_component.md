# Components Migration

This are the steps I'm doing to migrate a component to the new nightingale

1. check the component in `master` and in `hackathon-2020_more-tests`.
   - `master` should have the most recent stable version of the component.
   - `hackathon-2020_more-tests` should have a version from 2020 with the first attmpt of using the **withMixin** strategy, and the names in this branch have already been moved to the format `nightingale-xxx`. Plus there might been some tests already for that component.
2. If the component exists in `hackathon-2020_more-tests` copy it from there and try to include any code changes that have only been commited in `master`. Otherwise copy the component from `master`.
3. Remove any `dist/` or `node_modules/` folders in the package.
4. Update `package.json` set version as `1.0.0` as this will be the first version `nightingale-xxx`

- We are setting up like this for each module.
  ```
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  ```

5. Copy `tsconfig.json` from another package
6. Rename the files in the `src/` as `.ts`
7. Solve all the TS issues!!!!
8. add the new component to the `dev/import-map.json`
