import React, { Fragment, useState } from "react";
import ProtvistaStructure from "protvista-structure";
import loadWebComponent from "../utils/load-web-component";
import "litemol/dist/css/LiteMol-plugin.css";

const ProtvistaStructureWrapper = props => {
  loadWebComponent("protvista-structure", ProtvistaStructure);
  return (
    <Fragment>
      <protvista-structure
            accession="P06493"
            highlight="209:220"
            hide-table
          />
    </Fragment>
  );
};

export default ProtvistaStructureWrapper;
