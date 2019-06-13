import React, { Fragment, Component } from "react";
import DataLoader from "data-loader";
import ProtvistaFeatureAdapter from "protvista-feature-adapter";
import ProtvistaTrack from "protvista-track";
import loadWebComponent from "../utils/load-web-component";

import data from "../mocks/features.json";
import data2 from "../mocks/features2.json";
import data3 from "../mocks/interpro-secondary-structure.json";

class ProtvistaTrackWrapper extends Component {
  componentDidMount() {
    document.querySelector("#track1").data = data;
    document.querySelector("#track2").data = data;
    document.querySelector("#track3").data = data;
    document.querySelector("#track4").data = data2;
    document.querySelector("#track5").data = data3;
  }

  render() {
    loadWebComponent("protvista-feature-adapter", ProtvistaFeatureAdapter);
    loadWebComponent("protvista-track", ProtvistaTrack);
    loadWebComponent("data-loader", DataLoader);
    return (
      <Fragment>
        <h2>Track with data-loader</h2>
        <protvista-track
          length="770"
          displaystart="1"
          displayend="770"
          tooltip-event="click"
        >
          <protvista-feature-adapter id="adapter1">
            <data-loader>
              <source src="https://www.ebi.ac.uk/proteins/api/features/P05067?categories=PTM" />
            </data-loader>
          </protvista-feature-adapter>
        </protvista-track>
        <h2>Track with set data</h2>
        <protvista-track
          id="track1"
          width="1020"
          length="223"
          displaystart="1"
          displayend="223"
          color="red"
          highlight="20:50,40:80"
        />
        <protvista-track
          id="track2"
          width="1020"
          length="223"
          displaystart="100"
          displayend="200"
          highlightstart="23"
          highlightend="45"
          color="green"
          layout="non-overlapping"
        />
        <protvista-track
          id="track3"
          width="1020"
          length="223"
          displaystart="110"
          displayend="210"
          highlightstart="23"
          highlightend="45"
        />
        <protvista-track
          id="track4"
          length="3"
          displaystart="1"
          displayend="3"
          highlightstart="2"
          highlightend="2"
          layout="non-overlapping"
          shape="roundRectangle"
          height="460px"
        />
        <protvista-track
          id="track5"
          length="100"
          width="1020"
          height="100"
          displaystart="1"
          displayend="80"
          layout="non-overlapping"
        />
      </Fragment>
    );
  }
}

export default ProtvistaTrackWrapper;
