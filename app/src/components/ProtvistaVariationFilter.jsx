import React, { Component, Fragment } from "react";
import DataLoader from "data-loader";
import ProtvistaVariation from "protvista-variation";
import ProtvistaFilter from "protvista-filter";
import ProtvistaVariationAdapter from "protvista-variation-adapter";
import ProtvistaManager from "protvista-manager";
import loadWebComponent from "../utils/load-web-component";

class ProtvistaVariationFilterWrapper extends Component {
  render() {
    loadWebComponent("protvista-variation", ProtvistaVariation);
    loadWebComponent("data-loader", DataLoader);
    loadWebComponent("protvista-variation-adapter", ProtvistaVariationAdapter);
    loadWebComponent("protvista-manager", ProtvistaManager);
    loadWebComponent(ProtvistaFilter.tagName, ProtvistaFilter);
    return (
      <Fragment>
        <protvista-manager attributes="filters" style={{ display: 'flex' }}>
          <protvista-filter style={{ minWidth: '20%' }}></protvista-filter>
          <protvista-variation>
            <protvista-variation-adapter>
              <data-loader>
                <source src="https://www.ebi.ac.uk/proteins/api/variation/P05067" />
              </data-loader>
            </protvista-variation-adapter>
          </protvista-variation>
        </protvista-manager>
      </Fragment>
    );
  }
}

export default ProtvistaVariationFilterWrapper;

