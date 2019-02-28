import React, { Fragment } from "react";

import loadWebComponent from "../utils/load-web-component";
import ProtvistaFilter from "protvista-filter";

const ProtvistaFilterComponentWrapper = props => {
  loadWebComponent("protvista-filter", ProtvistaFilter);
  return (
    <Fragment>
      <protvista-filter></protvista-filter>
    </Fragment>
  );
};

export default ProtvistaFilterComponentWrapper;
