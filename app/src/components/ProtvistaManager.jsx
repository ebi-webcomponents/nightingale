import React, { Component, Fragment } from "react";
import ProtvistaManager from "protvista-manager";
import DataLoader from "data-loader";
import ProtvistaFeatureAdapter from "protvista-feature-adapter";
import ProtvistaTrack from "protvista-track";
import ProtvistaNavigation from "protvista-navigation";
import ProtvistaSequence from "protvista-sequence";
import ProtvistaVariation from "protvista-variation";
import ProtvistaInterproTrack from "protvista-interpro-track";
import loadWebComponent from "../utils/load-web-component";
import variantData from "../mocks/variants.json";
import sequence from "../mocks/sequence.json";
import { dataIPR, signatures } from "../mocks/interpro";

class ProtvistaManagerWrapper extends Component {
  componentDidMount() {
    document.querySelector("#variation-track").data = variantData;
    document.querySelector("#interpro-track").data = dataIPR;
    document.querySelector("#interpro-track").contributors = signatures;
    document.querySelector("#sequence-track").data = sequence;
  }

  render() {
    loadWebComponent("protvista-manager", ProtvistaManager);
    loadWebComponent("protvista-feature-adapter", ProtvistaFeatureAdapter);
    loadWebComponent("protvista-track", ProtvistaTrack);
    loadWebComponent("protvista-navigation", ProtvistaNavigation);
    loadWebComponent("protvista-sequence", ProtvistaSequence);
    loadWebComponent("protvista-interpro-track", ProtvistaInterproTrack);
    loadWebComponent("protvista-variation", ProtvistaVariation);
    loadWebComponent("data-loader", DataLoader);
    return (
      <Fragment>
        <protvista-manager
          attributes="length displaystart displayend highlightstart highlightend variantfilters"
          id="example"
        >
          <protvista-navigation length="770" />
          <protvista-sequence length="770" id="sequence-track" />
          <protvista-track id="track1" length="770">
            <protvista-feature-adapter id="adapter1">
              <data-loader>
                <source src="https://www.ebi.ac.uk/proteins/api/features/P05067?categories=PTM" />
              </data-loader>
            </protvista-feature-adapter>
          </protvista-track>
          <protvista-track id="track1" length="770" layout="non-overlapping">
            <protvista-feature-adapter id="adapter1">
              <data-loader>
                <source src="https://www.ebi.ac.uk/proteins/api/features/P05067?categories=PTM" />
              </data-loader>
            </protvista-feature-adapter>
          </protvista-track>
          <protvista-interpro-track
            id="interpro-track"
            length="770"
            shape="roundRectangle"
            expanded
          />
          <protvista-variation id="variation-track" length="770" />
        </protvista-manager>
      </Fragment>
    );
  }
}

export default ProtvistaManagerWrapper;
