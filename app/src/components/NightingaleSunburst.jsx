import React, { useRef, useEffect, useState } from "react";
import NightingaleSunburst from "nightingale-sunburst";
import loadWebComponent from "../utils/load-web-component";
import data from "../mocks/taxonomy.json";
// import Readme from "./Readme";
// import readmeContent from "../../../packages/nightingale-heatmap/README.md";

const weigthOptions = {
  numSequences: "Number of sequences",
  numDomains: "Number of dominios",
  numSpecies: "Number of species",
};
const NightingaleSunburstWrapper = () => {
  loadWebComponent("nightingale-sunburst", NightingaleSunburst);
  const sunburst = useRef(null);
  const [depth, setDepth] = useState(4);
  const [weightOption, setWeightOption] = useState("numSequences");
  const [currentNode, setCurrentNode] = useState(null);
  useEffect(() => {
    sunburst.current.data = data;
    sunburst.current.addEventListener("taxon-hover", (evt) => {
      setCurrentNode(evt.detail);
    });
  }, []);
  return (
    <>
      {/* <Readme content={readmeContent} /> */}
      <label>
        Depth [{depth}]:
        <input
          type="range"
          id="Depth"
          name="depth"
          min="2"
          max="7"
          value={depth}
          onChange={(evt) => setDepth(evt.target.value)}
        />
      </label>
      <br />
      <select onChange={(evt) => setWeightOption(evt.target.value)}>
        {Object.keys(weigthOptions).map((option) => (
          <option key={option} value={option}>
            {weigthOptions[option]}
          </option>
        ))}
      </select>
      <br />
      <div className="sunburst">
        <nightingale-sunburst
          side={600}
          weight-attribute={weightOption}
          weight-attribute-label={weigthOptions[weightOption]}
          name-attribute="node"
          id-attribute="id"
          ref={sunburst}
          max-depth={depth}
          // show-label
        />
        {currentNode && (
          <dl>
            <dt>Name</dt>
            <dd>{currentNode.node}</dd>
            <dt>Accession</dt>
            <dd>{currentNode.id}</dd>
            <dt>Number of sequences</dt>
            <dd>{currentNode.numSequences}</dd>
            <dt>Number of dominios</dt>
            <dd>{currentNode.numDomains}</dd>
            <dt>Number of species</dt>
            <dd>{currentNode.numSpecies}</dd>
            <dt>Lineage</dt>
            <dd>{currentNode.lineage.map(({ name }) => name).join("; ")}</dd>
          </dl>
        )}
      </div>
    </>
  );
};

export default NightingaleSunburstWrapper;
