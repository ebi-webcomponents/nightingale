# nightingale

Nightingale is a monorepo containing visualisation web components to use with biological data. You can see them in action here: https://ebi-webcomponents.github.io/nightingale

## Installing

Nightingale uses [Lerna](https://lernajs.io/) to manage its packages.

First run `yarn` to install root packages. Then run `yarn bootstrap` to install remaining modules and link dependencies.

## Building the componens

Run `yarn build`

## Showcase application

### Locally

Run `yarn start` to run the application locally.

### Build

Run `yarn build` to build the application ready for deployment.

## Components

### ProtVista

#### Visualisation components
[protvista-interpro-track](packages/protvista-interpro-track)

[protvista-variation-graph](packages/protvista-variation-graph)

[protvista-variation](packages/protvista-variation)

[protvista-zoomable](packages/protvista-zoomable)

[protvista-sequence](packages/protvista-sequence)

[protvista-track](packages/protvista-track)

[protvista-uniprot](packages/protvista-uniprot)

#### Data adapters

[protvista-variation-adapter](packages/protvista-variation-adapter)

[protvista-feature-adapter](packages/protvista-feature-adapter)

[protvista-proteomics-adapter](packages/protvista-proteomics-adapter)

[protvista-structure-adapter](packages/protvista-structure-adapter)

[protvista-topology-adapter](packages/protvista-topology-adapter)

[protvista-uniprot-entry-adapter](pprotvista-uniprot-entryackages/)

#### Utilities
[protvista-manager](packages/protvista-manager)

[protvista-filter](packages/protvista-filter)

[protvista-utils](packages/protvista-utils)

[protvista-tooltip](packages/protvista-tooltip)

#### Data loader
[data-loader](packages/data-loader)

### Interaction viewer
[interaction-viewer](packages/interaction-viewer)

### 3D structure viewer
[protvista-structure](packages/protvista-structure)

