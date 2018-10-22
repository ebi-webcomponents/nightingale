import React, { Fragment } from "react";
import ProtvistaNavigation from "protvista-navigation";
import loadWebComponent from "../utils/load-web-component";

const ProtvistaNavigationWrapper = props => {
  loadWebComponent("protvista-navigation", ProtvistaNavigation);
  return (
    <Fragment>
      <protvista-navigation
        length="456"
        displaystart="34"
        displayend="400"
        highlightStart="23"
        highlightEnd="45"
      />
    </Fragment>
  );
};

export default ProtvistaNavigationWrapper;
