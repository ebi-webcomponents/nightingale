import React, { Component, Fragment } from "react";
import DataLoader from "data-loader";
import ProtvistaVariation from "protvista-variation";
import ProtvistaFilter from "protvista-filter";
import ProtvistaVariationAdapter from "protvista-variation-adapter";
import ProtvistaManager from "protvista-manager";
import loadWebComponent from "../utils/load-web-component";
import data from "../mocks/variants.json";

class ProtvistaVariationWrapper extends Component {
  componentDidMount() {
    document.querySelector("#track1").data = data;
  }

  render() {
    loadWebComponent("protvista-variation", ProtvistaVariation);
    loadWebComponent("data-loader", DataLoader);
    loadWebComponent("protvista-variation-adapter", ProtvistaVariationAdapter);
    loadWebComponent("protvista-manager", ProtvistaManager);
    loadWebComponent(ProtvistaFilter.tagName, ProtvistaFilter);
    return (
      <Fragment>
        <protvista-manager attributes="filters">
          <protvista-variation id="track1" length="770" />
          <protvista-variation>
            <protvista-variation-adapter>
              <data-loader>
                <source src="https://www.ebi.ac.uk/proteins/api/variation/P05067" />
              </data-loader>
            </protvista-variation-adapter>
          </protvista-variation>
          <protvista-filter></protvista-filter>
        </protvista-manager>
      </Fragment>
    );
  }
}

export default ProtvistaVariationWrapper;
