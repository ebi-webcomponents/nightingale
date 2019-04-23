import React, { Fragment, Component } from "react";
import ProtvistaDatatable from "protvista-datatable";
import ProtvistaTrack from "protvista-track";
import ProtvistaManager from "protvista-manager";
import ProtvistaFeatureAdapter from "protvista-feature-adapter";
import DataLoader from "data-loader";
import loadWebComponent from "../utils/load-web-component";

import data from "../mocks/features.json";

const columnConfig = {
  type: {
    label: "Feature key",
    resolver: d => d["type"]
  },
  description: {
    label: "Description",
    resolver: d => d["description"]
  },
  positions: {
    label: "Positions",
    resolver: d => `${d["start"]}-${d["end"]}`
  }
};
class ProtvistaDatatableWrapper extends Component {
  componentDidMount() {
    document.querySelector("#data-table").columns = columnConfig;
  }

  render() {
    loadWebComponent("data-loader", DataLoader);
    loadWebComponent("protvista-datatable", ProtvistaDatatable);
    loadWebComponent("protvista-manager", ProtvistaManager);
    loadWebComponent("protvista-track", ProtvistaTrack);
    loadWebComponent("protvista-feature-adapter", ProtvistaFeatureAdapter);
    return (
      <Fragment>
        <h2>Track with data-loader</h2>
        <protvista-manager attributes="length displaystart displayend variantfilters highlight">
          <protvista-track length="770" layout="non-overlapping">
            <protvista-feature-adapter>
              <data-loader>
                <source src="https://www.ebi.ac.uk/proteins/api/features/P05067?categories=MOLECULE_PROCESSING" />
              </data-loader>
            </protvista-feature-adapter>
          </protvista-track>
          <protvista-datatable id="data-table">
            <data-loader>
              <source src="https://www.ebi.ac.uk/proteins/api/features/P05067?categories=MOLECULE_PROCESSING" />
            </data-loader>
          </protvista-datatable>
        </protvista-manager>
      </Fragment>
    );
  }
}

export default ProtvistaDatatableWrapper;
