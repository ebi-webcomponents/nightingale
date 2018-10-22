import React, { Fragment } from "react";
import DataLoader from "data-loader";
import ProtvistaVariation from "protvista-variation";
import loadWebComponent from "../utils/load-web-component";

const ProtvistaVariationWrapper = props => {
  loadWebComponent("protvista-variation", ProtvistaVariation);
  loadWebComponent("data-loader", DataLoader);
  return (
    <Fragment>
      <protvista-variation length="770">
        <data-loader>
          <source src="https://www.ebi.ac.uk/proteins/api/variation/P05067" />
        </data-loader>
      </protvista-variation>
    </Fragment>
  );
};

export default ProtvistaVariationWrapper;
