import React, { Component, Fragment } from "react";
import DataLoader from "@nightingale-elements/data-loader";
import ProtvistaVariationGraph from "@nightingale-elements/nightingale-variation-graph";
import ProtvistaVariationAdapter from "@nightingale-elements/nightingale-variation-adapter";
import loadWebComponent from "../utils/load-web-component";
import Readme from "./Readme";
import readmeContent from "../../../packages/protvista-variation-graph/README.md";

class ProtvistaVariationWrapper extends Component {
  render() {
    loadWebComponent("protvista-variation-graph", ProtvistaVariationGraph);
    loadWebComponent("data-loader", DataLoader);
    loadWebComponent("protvista-variation-adapter", ProtvistaVariationAdapter);
    return (
      <Fragment>
        <Readme content={readmeContent} />
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
