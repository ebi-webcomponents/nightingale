import React, { Component, Fragment } from "react";
import ProtvistaManager from "protvista-manager";
import DataLoader from "data-loader";
import ProtvistaFeatureAdapter from "protvista-feature-adapter";
import ProtvistaTrack from "protvista-track";
import ProtvistaNavigation from "protvista-navigation";
import ProtvistaSequence from "protvista-sequence";
import ProtvistaVariation from "protvista-variation";
import loadWebComponent from "../utils/load-web-component";
import variantData from "../mocks/variants.json";

class ProtvistaManagerWrapper extends Component {
  componentDidMount() {
    document.querySelector("#variation-track").data = variantData;
  }

  render() {
    loadWebComponent("protvista-manager", ProtvistaManager);
    loadWebComponent("protvista-feature-adapter", ProtvistaFeatureAdapter);
    loadWebComponent("protvista-track", ProtvistaTrack);
    loadWebComponent("protvista-navigation", ProtvistaNavigation);
    loadWebComponent("protvista-sequence", ProtvistaSequence);
    loadWebComponent("protvista-variation", ProtvistaVariation);
    loadWebComponent("data-loader", DataLoader);
    return (
      <Fragment>
        <protvista-manager
          attributes="length displaystart displayend highlightstart highlightend variantfilters"
          id="example"
        >
          <protvista-navigation
            length="223"
            displaystart="120"
            displayend="158"
            highlightStart="10"
            highlightEnd="45"
          />
          <protvista-sequence
            id="seq1"
            length="223"
            displaystart="120"
            displayend="158"
          />
          <protvista-track
            id="track1"
            length="223"
            displaystart="120"
            displayend="158"
          >
            <protvista-feature-adapter id="adapter1">
              <data-loader>
                <source src="https://www.ebi.ac.uk/proteins/api/features/P05067?categories=PTM" />
              </data-loader>
            </protvista-feature-adapter>
          </protvista-track>
          <protvista-track
            id="track2"
            length="223"
            displaystart="120"
            displayend="158"
            highlightstart="10"
            highlightend="45"
            layout="non-overlapping"
          />
          <protvista-interpro-track
            id="track3"
            length="223"
            displaystart="120"
            displayend="158"
            highlightstart="10"
            highlightend="45"
          />
          <protvista-variation
            id="variation-track"
            length="223"
            displaystart="1"
            displayend="158"
            highlightstart="10"
            highlightend="45"
          />
        </protvista-manager>
      </Fragment>
    );
  }
}

export default ProtvistaManagerWrapper;
