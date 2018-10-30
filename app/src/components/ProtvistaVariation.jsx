import React, { Component, Fragment } from "react";
import DataLoader from "data-loader";
import ProtvistaVariation from "protvista-variation";
import loadWebComponent from "../utils/load-web-component";
import data from "../mocks/variants.json";

class ProtvistaVariationWrapper extends Component {
  componentDidMount() {
    document.querySelector("#track1").data = data;
  }

  render() {
    loadWebComponent("protvista-variation", ProtvistaVariation);
    loadWebComponent("data-loader", DataLoader);
    return (
      <Fragment>
        <protvista-variation id="track1" length="770" />

        {/* <protvista-variation length="770">
          <data-loader>
            <source src="https://www.ebi.ac.uk/proteins/api/variation/P05067" />
          </data-loader>
        </protvista-variation> */}
      </Fragment>
    );
  }
}

export default ProtvistaVariationWrapper;
