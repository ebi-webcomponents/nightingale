import React, { Component, Fragment } from "react";
import DataLoader from "data-loader";
import ProtvistaVariationGraph from "protvista-variation-graph";
import ProtvistaVariationAdapter from "protvista-variation-adapter";
import loadWebComponent from "../utils/load-web-component";

class ProtvistaVariationWrapper extends Component {
  render() {
    loadWebComponent("protvista-variation-graph", ProtvistaVariationGraph);
    loadWebComponent("data-loader", DataLoader);
    loadWebComponent("protvista-variation-adapter", ProtvistaVariationAdapter);
    return (
      <Fragment>
        <protvista-variation-graph length="770">
          <protvista-variation-adapter>
            <data-loader>
              <source src="https://www.ebi.ac.uk/proteins/api/variation/P05067" />
            </data-loader>
          </protvista-variation-adapter>
        </protvista-variation-graph>
      </Fragment>
    );
  }
}

export default ProtvistaVariationWrapper;
