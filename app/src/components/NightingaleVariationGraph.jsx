import React, { Component } from "react";

import "@nightingale-elements/data-loader";
import "@nightingale-elements/nightingale-variation-graph";
import "@nightingale-elements/nightingale-variation-adapter";

import Readme from "./Readme";
import readmeContent from "../../../packages/nightingale-variation-graph/README.md";

class NightingaleVariationWrapper extends Component {
  render() {
    return (
      <>
        <Readme content={readmeContent} />
        <nightingale-variation-graph length="770">
          <nightingale-variation-adapter>
            <data-loader>
              <source src="https://www.ebi.ac.uk/proteins/api/variation/P05067" />
            </data-loader>
          </nightingale-variation-adapter>
        </nightingale-variation-graph>
      </>
    );
  }
}

export default NightingaleVariationWrapper;
