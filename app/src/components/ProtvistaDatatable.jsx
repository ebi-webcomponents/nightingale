import React, { Fragment, Component } from "react";
import { html } from "lit-html";
import ProtvistaDatatable from "protvista-datatable";
import ProtvistaTrack from "protvista-track";
import ProtvistaManager from "protvista-manager";
import ProtvistaNavigation from "protvista-navigation";
import ProtvistaFeatureAdapter from "protvista-feature-adapter";
import DataLoader from "data-loader";
import loadWebComponent from "../utils/load-web-component";
import readmeContent from "../../../packages/protvista-datatable/README.md";
import Readme from "./Readme";

const columnConfig = {
  rowId: {
    resolver: d => d["ftId"] ? d["ftId"] : `${d["start"]}-${d["end"]}`,
    display:false
  },
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
  },
  consequence: {
    label: "Evidences",
    child: true,
    resolver: d => {
      const evidences = d["evidences"];
      if (evidences && evidences.length > 0) {
        return html`
          <ul>
            ${evidences.map(
              evidence =>
                html`
                  <li>${evidence.code}</li>
                `
            )}
          </ul>
        `;
      }
    }
  },
  ftId: {
    label: "Feature ID",
    child: true,
    resolver: d => d.ftId
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
    loadWebComponent("protvista-navigation", ProtvistaNavigation);
    loadWebComponent("protvista-feature-adapter", ProtvistaFeatureAdapter);
    return (
      <Fragment>
        <Readme content={readmeContent} />
        <h2>Track with data-loader</h2>
        <protvista-manager attributes="length displaystart displayend variantfilters highlight selectedid">
          <protvista-navigation length="770" />
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
