import React, { Fragment } from "react";
import ProtvistaNavigation from "protvista-navigation";
import loadWebComponent from "../utils/load-web-component";
import Readme from "./Readme";
import readmeContent from "../../../packages/protvista-navigation/README.md";

const ProtvistaNavigationWrapper = (props) => {
  loadWebComponent("protvista-navigation", ProtvistaNavigation);
  return (
    <Fragment>
      <Readme content={readmeContent} />
      <protvista-navigation
        length="456"
        displaystart="143"
        displayend="400"
        highlight="23:45"
        rulerstart="50"
      />
    </Fragment>
  );
};

export default ProtvistaNavigationWrapper;
