import React, { Fragment } from "react";
import ProtvistaStructure from "protvista-structure";
import loadWebComponent from "../utils/load-web-component";

const ProtvistaStructureWrapper = props => {
  loadWebComponent("protvista-structure", ProtvistaStructure);
  return (
    <Fragment>
      <protvista-structure
        accession="P06493"
        highlightstart="290"
        highlightend="310"
      />
    </Fragment>
  );
};

export default ProtvistaStructureWrapper;
