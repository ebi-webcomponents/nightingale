# Naming components

## Custom Elements

Visual components should be named based on what they _are_, not the _data they display_.

[Here](https://datavizcatalogue.com/) is a useful resource to accurately find the name of a data visualisations.

All custom elements have the prefix:
`@nightingale-elements/nightingale-...`.

### "Track" components

Components which have to do with displaying data related to a sequence (eg protvista components) take the form `@nightingale-elements/nightingale-MY_COMPONENT-track`.

### Data adapters

Components which take a data input, transform the data format and return it take the form `@nightingale-elements/nightingale-MY_COMPONENT-adapter`

- @nightingale-elements/core -> contains core stuff and probably should take utils
- @nightingale-elements/nightingale-??? -> actual webcomponent

## Other modules

Modules which are not Custom Elements take only take the `@nightingale-elements/` prefix (eg `@nightingale-elements/core`)
