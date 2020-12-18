import React, { Component } from "react";
import { html } from "lit-html";
import "@nightingale-elements/nightingale-datatable";
import "@nightingale-elements/nightingale-track";
import "@nightingale-elements/nightingale-manager";
import "@nightingale-elements/nightingale-navigation";
import "@nightingale-elements/nightingale-feature-adapter";
import "@nightingale-elements/data-loader";
import readmeContent from "../../../packages/nightingale-datatable/README.md";
import Readme from "./Readme";

const columnConfig = {
  type: {
    label: "Feature key",
    resolver: (d) => d["type"],
  },
  description: {
    label: "Description",
    resolver: (d) => d["description"],
  },
  positions: {
    label: "Positions",
    resolver: (d) => `${d["start"]}-${d["end"]}`,
  },
  consequence: {
    label: "Evidences",
    child: true,
    resolver: (d) => {
      const evidences = d["evidences"];
      if (evidences && evidences.length > 0) {
        return html`
          <ul>
            ${evidences.map((evidence) => html` <li>${evidence.code}</li> `)}
          </ul>
        `;
      }
    },
  },
  ftId: {
    label: "Feature ID",
    child: true,
    resolver: (d) => d.ftId,
  },
};
class NightingaleDatatableWrapper extends Component {
  componentDidMount() {
    document.querySelector("#data-table").columns = columnConfig;
  }

  render() {
    return (
      <>
        <Readme content={readmeContent} />
        <h2>Track with data-loader</h2>
        <nightingale-feature-adapter subscribers="#my-nightingale-track,#data-table">
          <data-loader>
            <source src="https://www.ebi.ac.uk/proteins/api/features/P05067?categories=MOLECULE_PROCESSING" />
          </data-loader>
        </nightingale-feature-adapter>
        <nightingale-manager attributes="length displaystart displayend variantfilters highlight selectedid">
          <nightingale-navigation length="770" />
          <nightingale-track
            id="my-nightingale-track"
            length="770"
            layout="non-overlapping"
          ></nightingale-track>
          <nightingale-datatable id="data-table"></nightingale-datatable>
        </nightingale-manager>
      </>
    );
  }
}

export default NightingaleDatatableWrapper;
