import React, { Fragment, useEffect, useMemo, useState } from "react";
import ProtvistaStructure from "protvista-structure";
import ProtvistaDatatable from "protvista-datatable";
import ProtvistaManager from "protvista-manager";
import loadWebComponent from "../utils/load-web-component";
import Readme from "./Readme";
import readmeContent from "../../../packages/protvista-structure/README.md";
import xrefData from "../mocks/pdb-xrefs.json";

loadWebComponent("protvista-structure", ProtvistaStructure);
loadWebComponent("protvista-datatable", ProtvistaDatatable);
loadWebComponent("protvista-manager", ProtvistaManager);

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

const ProtvistaStructureWrapper = () => {
  const [selectedId, setSelectedId] = useState("1AAP");
  const processedXrefs = useMemo(() => processData(xrefData));

  const handleChange = (e) => {
    setSelectedId(e.detail.selectedid);
  };

  useEffect(() => {
    document.addEventListener("change", handleChange);
    return () => {
      document.removeEventListener("change", handleChange);
    };
  }, []);
  return (
    <Fragment>
      <Readme content={readmeContent} />
      <h2>Examples</h2>
      <h3>Structure with protvista-datatable</h3>
      <protvista-structure
        structureid={selectedId}
        accession="P05067"
        highlight="290:300,310:340"
      />
      <protvista-datatable selectedId={selectedId} noScrollToRow noDeselect>
        <table>
          <thead>
            <tr>
              <th>PDB entry</th>
              <th>Method</th>
              <th>Resolution</th>
              <th>Chain</th>
              <th>Positions</th>
              <th>Links</th>
            </tr>
          </thead>
          <tbody>
            {processedXrefs.map((xref) => (
              <tr key={xref.id} data-id={xref.id}>
                <td>{xref.id}</td>
                <td>{xref.method}</td>
                <td>{xref.resolution?.replace("A", "Å")}</td>
                <td>{xref.chain}</td>
                <td>{xref.positions}</td>
                <td>
                  {pdbMirrors.map(({ name, url }) => (
                    <a href={url(xref.id)} key={name}>
                      {name}
                    </a>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </protvista-datatable>

      <h3>Custom PDB source URLs</h3>
      <protvista-structure
        structureid="5ELI"
        accession="Q9NZC2"
        uniprot-mapping-url="https://www.ebi.ac.uk/pdbe/api/mappings/uniprot/"
        custom-download-url="https://files.rcsb.org/download/"
      />

      <h3>Custom AlphaFold source URLs</h3>
      <protvista-structure
        structureid="AF-Q9NZC2-F1"
        accession="Q9NZC2"
        alphafold-mapping-url="https://alphafold.ebi.ac.uk/api/prediction/"
      />
    </Fragment>
  );
};

export default ProtvistaStructureWrapper;
