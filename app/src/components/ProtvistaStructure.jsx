import React, { Fragment } from "react";
import ProtvistaStructure from "protvista-structure";
import loadWebComponent from "../utils/load-web-component";
import "litemol/dist/css/LiteMol-plugin.css";
import Readme from "./Readme";
import readmeContent from "../../../packages/protvista-structure/README.md";

const ProtvistaStructureWrapper = props => {
  loadWebComponent("protvista-structure", ProtvistaStructure);
  return (
    <Fragment>
      <Readme content={readmeContent} />
      <protvista-structure accession="P06493" highlight="209:220" />
    </Fragment>
  );
};

export default ProtvistaStructureWrapper;
