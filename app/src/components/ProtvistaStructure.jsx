import React, { Fragment, useCallback } from "react";
import ProtvistaStructure from "protvista-structure";
import ProtvistaDatatable from "protvista-datatable";
import { html } from "lit-html";
import loadWebComponent from "../utils/load-web-component";
import "litemol/dist/css/LiteMol-plugin.css";
import Readme from "./Readme";
import readmeContent from "../../../packages/protvista-structure/README.md";
import xrefData from '../mocks/pdb-xrefs.json';
  
loadWebComponent("protvista-structure", ProtvistaStructure);
loadWebComponent('protvista-datatable', ProtvistaDatatable);

const processData = (xrefs) =>
  xrefs.map(({ id, properties }) => {
    if (!properties) {
      return null;
    }
    const { Chains, Resolution, Method } = properties;
    let chain;
    let positions;
    if (Chains) {
      const tokens = Chains.split('=');
      if (tokens.length === 2) {
        [chain, positions] = tokens;
      }
    }
    return {
      id,
      method: Method,
      resolution: !Resolution || Resolution === '-' ? null : Resolution,
      chain,
      positions,
    };
  });

const pdbMirrors = [
  {
    name: 'PDBe',
    url: id => `https://www.ebi.ac.uk/pdbe-srv/view/entry/${id}`,
  },
  {
    name: 'RCSB PDB',
    url: id => `https://www.rcsb.org/structure/${id}`,
  },
  {
    name: 'PDBj',
    url: id => `https://pdbj.org/mine/summary/${id}`,
  },
  {
    name: 'PDBsum',
    url: id => `https://www.ebi.ac.uk/pdbsum/${id}`,
  },
];

const getColumnConfig = () => ({
  type: {
    label: "PDB Entry",
    resolver: ({ id }) => id
  },
  method: {
    label: "Method",
    resolver: ({ method }) => method
  },
  resolution: {
    label: "Resolution",
    resolver: ({ resolution }) => resolution && resolution.replace("A", "Å")
  },
  chain: {
    label: "Chain",
    resolver: ({ chain }) => chain
  },
  positions: {
    label: "Positions",
    resolver: ({ positions }) => positions
  },
  links: {
    label: "Links",
    resolver: ({ id }) =>
      html`
        ${pdbMirrors.map(
          ({ name, url }) =>
            html`<a href=${url(id)} >${name}</a >`
        ).reduce(
          (prev, curr) =>
            html`
              ${prev} · ${curr}
            `
        )}
      `
  }
});

const PDBDatatable = ({ xrefs }) => {
  console.log(JSON.stringify(xrefs));
  const data = processData(xrefs);
  console.log(data)
  const setTableData = useCallback(
    node => {
      if (node) {
        // eslint-disable-next-line no-param-reassign
        node.data = data;
        // eslint-disable-next-line no-param-reassign
        node.columns = getColumnConfig();
      }
    },
    [data]
  );
  return <protvista-datatable ref={setTableData} />;
};

const ProtvistaStructureWrapper = props => {
  return (
    <Fragment>
      <Readme content={readmeContent} />
      <protvista-structure
        accession="P06493"
        highlight="209:220"
        height="1000"
      />
      <PDBDatatable xrefs={xrefData}/>
    </Fragment>
  );
};

export default ProtvistaStructureWrapper;
