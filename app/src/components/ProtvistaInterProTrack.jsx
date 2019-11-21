import React, { Fragment, Component } from "react";
import DataLoader from "data-loader";
import ProtvistaFeatureAdapter from "protvista-feature-adapter";
import ProtvistaInterProTrack from "protvista-interpro-track";
import loadWebComponent from "../utils/load-web-component";
import Readme from './Readme';
import readmeContent from '../../../packages/protvista-interpro-track/README.md'

import data from "../mocks/interpro-IPR016039.json";
import contributors from "../mocks/interpro-contributors.json";
import residues from "../mocks/interpro-residues.json";

class ProtvistaTrackWrapper extends Component {
  componentDidMount() {
    document.querySelector("#track1").data = data;
    document.querySelector("#track2").data = data;
    document.querySelector("#track2").contributors = contributors;
    const dataCopy = data.map(({ ...rest }) => ({ ...rest }));
    dataCopy[0].residues = residues;
    document.querySelector("#track3").data = dataCopy;
    const contributorsCopy = contributors.map(({ ...rest }) => ({ ...rest }));
    contributorsCopy[0].residues = residues;
    document.querySelector("#track4").data = data;
    document.querySelector("#track4").contributors = contributorsCopy;
  }

  render() {
    loadWebComponent("protvista-feature-adapter", ProtvistaFeatureAdapter);
    loadWebComponent("protvista-interpro-track", ProtvistaInterProTrack);
    loadWebComponent("data-loader", DataLoader);
    return (
      <Fragment>
        <Readme content={readmeContent} />
        <h2>Track with data-loader</h2>
        <protvista-interpro-track
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
        </protvista-interpro-track>
        <h2>Track with data injected after mounted</h2>
        <h3>Entry</h3>
        <protvista-interpro-track
          id="track1"
          width="1020"
          length="390"
          displaystart="1"
          displayend="390"
          highlight="20:50,40:80"
          shape="roundRectangle"
        />
        <h3>Entry + contributors</h3>
        <protvista-interpro-track
          id="track2"
          width="1020"
          length="390"
          displaystart="1"
          displayend="390"
          highlight="20:50,40:80"
          shape="roundRectangle"
          expanded
        />
        <h3>Entry + residues</h3>
        <protvista-interpro-track
          id="track3"
          width="1020"
          length="390"
          displaystart="1"
          displayend="390"
          highlight="20:50,40:80"
          shape="roundRectangle"
          expanded
        />
        <h3>Entry + contributors + residues</h3>
        <protvista-interpro-track
          id="track4"
          width="1020"
          length="390"
          displaystart="1"
          displayend="390"
          highlight="20:50,40:80"
          shape="roundRectangle"
          expanded
        />
      </Fragment>
    );
  }
}

export default ProtvistaTrackWrapper;
