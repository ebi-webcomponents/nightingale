[![Test and Publish Nightingale App](https://github.com/ebi-webcomponents/nightingale/workflows/Test%20and%20Publish%20Nightingale%20App/badge.svg)](https://github.com/ebi-webcomponents/nightingale/actions)

# nightingale

Nightingale is a monorepo containing visualisation web components to use with
biological data.

## Documentation/Getting started

Documentation, getting started guide and examples for each of the components are
available here
[https://ebi-webcomponents.github.io/nightingale](https://ebi-webcomponents.github.io/nightingale)

## Contributing

Read our guide [here](/CONTRIBUTING.md) as well as our
[code of conduct](/CODE_OF_CONDUCT.md)

## Installing

Nightingale uses [Lerna](https://lernajs.io/) to manage its packages.

First run `yarn` to install root packages. Then run `yarn bootstrap` to install
remaining modules and link dependencies.

## Building the components

Run `yarn build`

## Showcase application

### Locally

Run `yarn start` to run the application locally.

### Build

Run `yarn build` to build the application ready for deployment.

## Components

### Nightingale

#### Visualisation components

[nightingale-zoomable](packages/nightingale-zoomable): A superclass providing zooming functionality (uses D3's zoom).
[![npm version](https://badge.fury.io/js/nightingale-zoomable.svg)](https://badge.fury.io/js/nightingale-zoomable)

[nightingale-track](packages/nightingale-track): The base component to render features. Responds to zoom and allows highlights. Extends `nightingale-zoomable`.
[![npm version](https://badge.fury.io/js/nightingale-track.svg)](https://badge.fury.io/js/nightingale-track)

[nightingale-navigation](packages/nightingale-navigation): The main navigation component, allows zooming and shows the position of the visible window along the sequence.
[![npm version](https://badge.fury.io/js/nightingale-navigation.svg)](https://badge.fury.io/js/nightingale-navigation)

[nightingale-sequence](packages/nightingale-sequence): Displays the amino-acid sequence. Responds to zoom and allows highlights. Extends `nightingale-zoomable`.
[![npm version](https://badge.fury.io/js/nightingale-sequence.svg)](https://badge.fury.io/js/nightingale-sequence)

[nightingale-variation](packages/nightingale-variation): An adjacency graph to represent variation data, mapping amino-acids to position. Extends `nightingale-track`.
[![npm version](https://badge.fury.io/js/nightingale-variation.svg)](https://badge.fury.io/js/nightingale-variation)

[nightingale-variation-graph](packages/nightingale-variation-graph): a graph representing the number of variants at a given position. Extends `nightingale-track`.
[![npm version](https://badge.fury.io/js/nightingale-variation-graph.svg)](https://badge.fury.io/js/nightingale-variation-graph)

[nightingale-interpro-track](packages/nightingale-interpro-track): A specialisation of `nightingale-track` to use in InterPro. Extends `nightingale-track`.
[![npm version](https://badge.fury.io/js/nightingale-interpro-track.svg)](https://badge.fury.io/js/nightingale-interpro-track)

[nightingale-datatable](packages/nightingale-datatable): an interactive table view of features. Can highlight/be highlighted by features from the `nightingale-track`
[![npm version](https://badge.fury.io/js/nightingale-datatable.svg)](https://badge.fury.io/js/nightingale-datatable)

[nightingale-coloured-sequence](packages/nightingale-coloured-sequence): Track that uses the sequence to paint a color depending on each residue. Extends `nightingale-sequence`.
[![npm version](https://badge.fury.io/js/nightingale-coloured-sequence.svg)](https://badge.fury.io/js/nightingale-coloured-sequence)

#### Data loading and adapters

Most components use the [Proteins API](https://www.ebi.ac.uk/proteins/api/doc/)

[data-loader](packages/data-loader): this component can load json data given a url. It caches the results in the window so multiple calls
[![npm version](https://badge.fury.io/js/data-loader.svg)](https://badge.fury.io/js/data-loader)

[nightingale-uniprot-entry-adapter](packages/nightingale-uniprot-entry-adapter): a superclass providing basic functionality for data transformation and handling of events.
[![npm version](https://badge.fury.io/js/nightingale-uniprot-entry-adapter.svg)](https://badge.fury.io/js/nightingale-uniprot-entry-adapter)

[nightingale-variation-adapter](packages/nightingale-variation-adapter): this component transforms data returned by the Proteins API Variation service so it can be displayed by the `nightingale-variation` and `nightingale-variation-graph` components. Extends `nightingale-uniprot-entry-adapter`.
[![npm version](https://badge.fury.io/js/nightingale-variation-adapter.svg)](https://badge.fury.io/js/nightingale-variation-adapter)

[nightingale-feature-adapter](packages/nightingale-feature-adapter) this component transforms data returned by the Proteins API Features service so it can be displayed by the `nightingale-track` component. Extends `nightingale-uniprot-entry-adapter`.
[![npm version](https://badge.fury.io/js/nightingale-feature-adapter.svg)](https://badge.fury.io/js/nightingale-feature-adapter)

[nightingale-proteomics-adapter](packages/nightingale-proteomics-adapter) this component transforms data returned by the Proteins API Proteomics service so it can be displayed by the `nightingale-track` component. Extends `nightingale-uniprot-entry-adapter`.
[![npm version](https://badge.fury.io/js/nightingale-proteomics-adapter.svg)](https://badge.fury.io/js/nightingale-proteomics-adapter)

[nightingale-structure-adapter](packages/nightingale-structure-adapter) this component transforms structure data returned by the Proteins API Proteins service so it can be displayed by the `nightingale-track` component. Extends `nightingale-uniprot-entry-adapter`.
[![npm version](https://badge.fury.io/js/nightingale-structure-adapter.svg)](https://badge.fury.io/js/nightingale-structure-adapter)

[nightingale-topology-adapter](packages/nightingale-topology-adapter) this component transforms topological data returned by the Proteins API Features service so it can be displayed by the `nightingale-track` component. Extends `nightingale-uniprot-entry-adapter`.
[![npm version](https://badge.fury.io/js/nightingale-topology-adapter.svg)](https://badge.fury.io/js/nightingale-topology-adapter)

#### Utilities

[nightingale-manager](packages/nightingale-manager): this component works as an event bus, propagating events emited by its children to specified children as attributes.
[![npm version](https://badge.fury.io/js/nightingale-manager.svg)](https://badge.fury.io/js/nightingale-manager)

[nightingale-filter](packages/nightingale-filter): this component interacts with data adapters to allow filtering of the data which is displayed.
[![npm version](https://badge.fury.io/js/nightingale-filter.svg)](https://badge.fury.io/js/nightingale-filter)

[nightingale-saver](packages/nightingale-saver): this component downloads the nightingale visual as an image locally.
[![npm version](https://badge.fury.io/js/nightingale-saver.svg)](https://badge.fury.io/js/nightingale-saver)

[nightingale-tooltip](packages/nightingale-tooltip): the tooltip component is used to display information when a feature is clicked. Tooltip content is generated by data adapters.
[![npm version](https://badge.fury.io/js/nightingale-tooltip.svg)](https://badge.fury.io/js/nightingale-tooltip)

[nightingale-utils](packages/nightingale-utils): collection of util functions
[![npm version](https://badge.fury.io/js/nightingale-utils.svg)](https://badge.fury.io/js/nightingale-utils)

### Interaction viewer

[interaction-viewer](packages/interaction-viewer): The UniProt interaction viewer
[![npm version](https://badge.fury.io/js/interaction-viewer.svg)](https://badge.fury.io/js/interaction-viewer)

### 3D structure viewer

[nightingale-structure](packages/nightingale-structure): A wrapper around the LiteMol component used in UniProt.
[![npm version](https://badge.fury.io/js/nightingale-structure.svg)](https://badge.fury.io/js/nightingale-structure)
