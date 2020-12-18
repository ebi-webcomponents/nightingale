import React, { Fragment, useCallback } from "react";
import ProtvistaStructure from "protvista-structure";
import ProtvistaDatatable from "protvista-datatable";
import ProtvistaManager from "protvista-manager";
import { html } from "lit-html";
import loadWebComponent from "../utils/load-web-component";
import "litemol/dist/css/LiteMol-plugin.css";
import Readme from "./Readme";
import readmeContent from "../../../packages/protvista-structure/README.md";
import xrefData from "../mocks/pdb-xrefs.json";

loadWebComponent("protvista-structure", ProtvistaStructure);
loadWebComponent("protvista-datatable", ProtvistaDatatable);
loadWebComponent("protvista-manager", ProtvistaManager);

const selectedId = "1AAP";

const processData = (xrefs) =>
  xrefs.map(({ id, properties }) => {
    if (!properties) {
      return null;
    }
    const { Chains, Resolution, Method } = properties;
    let chain;
    let positions;
    let start;
    if (Chains) {
      const tokens = Chains.split("=");
      if (tokens.length === 2) {
        [chain, positions] = tokens;
        const startEnd = positions.split("-");
        if (startEnd && startEnd.length === 2) {
          [start] = startEnd;
        }
      }
    }
    return {
      id,
      method: Method,
      resolution: !Resolution || Resolution === "-" ? null : Resolution,
      chain,
      positions,
      protvistaFeatureId: id,
      start: Number(start),
    };
  });

const pdbMirrors = [
  {
    name: "PDBe",
    url: (id) => `https://www.ebi.ac.uk/pdbe-srv/view/entry/${id}`,
  },
  {
    name: "RCSB PDB",
    url: (id) => `https://www.rcsb.org/structure/${id}`,
  },
  {
    name: "PDBj",
    url: (id) => `https://pdbj.org/mine/summary/${id}`,
  },
  {
    name: "PDBsum",
    url: (id) => `https://www.ebi.ac.uk/pdbsum/${id}`,
  },
];

const getColumnConfig = () => ({
  type: {
    label: "PDB Entry",
    resolver: ({ id }) => id,
  },
  method: {
    label: "Method",
    resolver: ({ method }) => method,
  },
  resolution: {
    label: "Resolution",
    resolver: ({ resolution }) => resolution && resolution.replace("A", "Å"),
  },
  chain: {
    label: "Chain",
    resolver: ({ chain }) => chain,
  },
  positions: {
    label: "Positions",
    resolver: ({ positions }) => positions,
  },
  links: {
    label: "Links",
    resolver: ({ id }) =>
      html`
        ${pdbMirrors
          .map(({ name, url }) => html` <a href=${url(id)}>${name}</a> `)
          .reduce((prev, curr) => html` ${prev} · ${curr} `)}
      `,
  },
});

const PDBDatatable = ({ xrefs }) => {
  const data = processData(xrefs);
  const setTableData = useCallback(
    (node) => {
      if (node) {
        // eslint-disable-next-line no-param-reassign
        node.data = data;
        // eslint-disable-next-line no-param-reassign
        node.columns = getColumnConfig();
        // eslint-disable-next-line no-param-reassign
        node.rowClickEvent = ({ id }) => ({ "pdb-id": id });
      }
    },
    [data]
  );
  return (
    <protvista-datatable
      ref={setTableData}
      selectedId={selectedId}
      noScrollToRow
      noDeselect
    />
  );
};

const ProtvistaStructureWrapper = () => {
  return (
    <Fragment>
      <Readme content={readmeContent} />
      <h2>Examples</h2>
      <h3>Structure with highlighted positions</h3>
      <protvista-structure
        pdb-id={selectedId}
        accession="P05067"
        highlight="290:300,310:340"
      />
      {/* <h3>Structure with protvista-datatable</h3>
      <protvista-manager attributes="pdb-id">
        <protvista-structure pdb-id={selectedId} accession="P05067" />
        <PDBDatatable xrefs={xrefData} />
      </protvista-manager> */}
    </Fragment>
  );
};

export default ProtvistaStructureWrapper;
