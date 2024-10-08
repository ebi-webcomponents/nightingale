[![Test and Publish Nightingale App](https://github.com/ebi-webcomponents/nightingale/workflows/Test%20and%20Publish%20Nightingale%20App/badge.svg)](https://github.com/ebi-webcomponents/nightingale/actions)

# nightingale

Nightingale is a monorepo containing visualisation web components to use with
biological data.

## Cite us

**Nightingale: web components for protein feature visualization**, Bioinformatics Advances, Volume 3, Issue 1, 2023, vbad064, [https://doi.org/10.1093/bioadv/vbad064](https://doi.org/10.1093/bioadv/vbad064)

## Documentation/Getting started

Documentation, getting started guide and examples for each of the components are
available here
[https://ebi-webcomponents.github.io/nightingale](https://ebi-webcomponents.github.io/nightingale)

## Contributing

Read our guide [here](/CONTRIBUTING.md) as well as our
[code of conduct](/CODE_OF_CONDUCT.md)

## Installing

Nightingale uses [Lerna](https://lerna.js.org/) to manage its packages.

First run `yarn` to install root packages.

## Building the components

Run `yarn build`

## Showcase application

### Locally

Run `yarn build && yarn storybook` to run the application locally.

### Build

Run `yarn build-storybook` to build the application ready for deployment.

### Publish

Ensure lerna is installed globally via:

```
yarn global add lerna
```

Login to npm:

```
npm login
```

Finally publish with lerna:

```
lerna publish
```
