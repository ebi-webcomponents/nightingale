import React, { Fragment } from "react";
import "../../../packages/protvista-structure/dist/index.js";
// import "../../../packages/protvista-structure/dist/css/LiteMol-plugin.min.css";

const ProtvistaStructure = props => (
  <Fragment>
    <protvista-structure
      accession="P06493"
      highlightstart="290"
      highlightend="310"
    />
  </Fragment>
);

export default ProtvistaStructure;
