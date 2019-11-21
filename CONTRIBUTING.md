# Contributing to Nightingale

## Bug reports/Suggesting enhancements
Before submitting a bug report or suggesting an enhancement, check [this list](https://github.com/ebi-webcomponents/nightingale/issues) to see if a similar issue already exists. If you need to create a new issue, use a descriptive title and include as many details as possible, following the corresponding [template](https://github.com/ebi-webcomponents/nightingale/issues/new/choose).

## Code contribution
If you want to contribute to Nightingale by fixing issues or adding new components, you can do by submitting a pull request. You need to follow the template, make sure [naming conventions](#naming-conventions) and the [coding style](#styleguide) is respected.

### Directory structure
```
packages/my-component/package.json # contains the package definition
                      src/index.js # import your main component and register it as a custom element
                      src/my-component.js # definition of your main component
                      test # your test definitions
```

### Naming conventions
 - Your package name should be short and descriptive (avoid acronyms). 
 - If your component is for ProtVista (the protein features visualisation tool) it should have the `protvista-` prefix.
 - the file in which your main component is defined should have the same name as your package (in kebab-case).
 - your main component should have the same name as your package, but in PascalCase.
 - Documentation, comments, and more importantly code, should all use American English. For example, use `color` and not ~`colour`~

### Pull requests
Why pull requests?
 - Maintain code quality
 - Disseminate knowledge
 - Catch potential issues early
 
Before you submit a pull request, please ensure your code comforms to the [styleguide](#styleguide), that the tests are passing and follow instructions in [the template](https://github.com/ebi-webcomponents/protvista-uniprot/blob/master/pull_request_template.md).

### Styleguide
We follow [airbnb-base](https://github.com/airbnb/javascript) and [prettier](https://github.com/prettier/prettier-eslint). Run `yarn lint` to run the linter in all packages.
