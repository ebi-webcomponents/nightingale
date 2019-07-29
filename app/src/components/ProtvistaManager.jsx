import React, { Component, Fragment } from "react";
import ProtvistaManager from "protvista-manager";
import DataLoader from "data-loader";
import ProtvistaFeatureAdapter from "protvista-feature-adapter";
import ProtvistaTrack from "protvista-track";
import ProtvistaNavigation from "protvista-navigation";
import ProtvistaSequence from "protvista-sequence";
import ProtvistaColouredSequence from "protvista-coloured-sequence";
import ProtvistaVariation from "protvista-variation";
import ProtvistaVariationGraph from "protvista-variation-graph";
import ProtvistaVariationAdapter from "protvista-variation-adapter";
import ProtvistaInterproTrack from "protvista-interpro-track";
import loadWebComponent from "../utils/load-web-component";
import variantData from "../mocks/variants.json";
import sequence from "../mocks/sequence.json";
import { dataIPR, signatures, withResidues } from "../mocks/interpro";
import secondaryStructureData from "../mocks/interpro-secondary-structure.json";
import ProtvistaSaver from "protvista-saver";

class ProtvistaManagerWrapper extends Component {
  componentDidMount() {
    document.querySelector("#variation-track").data = variantData;
    document.querySelector("#interpro-track-residues").data = withResidues;
    document.querySelector("#interpro-track").data = dataIPR;
    document.querySelector("#interpro-track").contributors = signatures;
    document.querySelector("#sequence-track").data = sequence;
    document.querySelector("#sequence-track").fixedHighlight = "400:600";
    document.querySelector("#sequence-coloured-track").data = sequence;
    document.querySelector("#sequence-coloured-track").fixedHighlight =
      "400:600";
    document.querySelector("#sequence-coloured-track-iso").data = sequence;
    document.querySelector("#sequence-coloured-track-iso").fixedHighlight =
      "400:600";
    document.querySelector("#track1").fixedHighlight = "400:600";
    document.querySelector("#track2").fixedHighlight = "400:600";
    document.querySelector("#track3").data = secondaryStructureData;
    document.querySelector("#track3").fixedHighlight = "400:600";
    document.querySelector("#interpro-track").fixedHighlight = "400:600";
    document.querySelector("#interpro-track-residues").fixedHighlight =
      "400:600";
    document.querySelector("#variation-track").fixedHighlight = "400:600";
    document.querySelector("#variation-graph").fixedHighlight = "400:600";
    //Includes a title in the exported file.
    document.querySelector("#saver").preSave = () => {
      const base = document.querySelector("#example");
      const title = document.createElement("h2");
      title.setAttribute("id", "tmp_title_element");
      title.innerHTML = "ProtVista Snapshot";
      base.insertBefore(title, base.firstChild);
    };
    //removes the title from the DOM
    document.querySelector("#saver").postSave = () => {
      document
        .querySelector("#example")
        .removeChild(document.getElementById("tmp_title_element"));
    };

    //Sets the background color of the image to save.
    document.querySelector("#saver").backgroundColor = "#ffffff";
    document.querySelector("#saver2").backgroundColor = "#ddddee";
  }
  render() {
    loadWebComponent("protvista-manager", ProtvistaManager);
    loadWebComponent("protvista-feature-adapter", ProtvistaFeatureAdapter);
    loadWebComponent("protvista-track", ProtvistaTrack);
    loadWebComponent("protvista-navigation", ProtvistaNavigation);
    loadWebComponent("protvista-sequence", ProtvistaSequence);
    loadWebComponent("protvista-coloured-sequence", ProtvistaColouredSequence);
    loadWebComponent("protvista-interpro-track", ProtvistaInterproTrack);
    loadWebComponent("protvista-variation", ProtvistaVariation);
    loadWebComponent("protvista-variation-graph", ProtvistaVariationGraph);
    loadWebComponent("data-loader", DataLoader);
    loadWebComponent("protvista-variation-adapter", ProtvistaVariationAdapter);
    loadWebComponent("protvista-saver", ProtvistaSaver);
    return (
      <Fragment>
        <protvista-saver element-id="example" id="saver" />
        <protvista-saver element-id="just-tracks" id="saver2">
          <button>Download Just Tracks</button>
        </protvista-saver>
        <protvista-manager
          attributes="length displaystart displayend variantfilters highlight"
          displaystart="53"
          id="example"
        >
          <protvista-navigation length="770" />
          <div id="just-tracks">
            <protvista-sequence
              length="770"
              id="sequence-track"
              highlight-event="onmouseover"
            />
            <protvista-coloured-sequence
              length="770"
              id="sequence-coloured-track"
              scale="hydrophobicity-interface-scale"
              height="10"
              highlight-event="onmouseover"
            />
            <protvista-coloured-sequence
              length="770"
              id="sequence-coloured-track-iso"
              scale="isoelectric-point-scale"
              color_range="white:0,dodgerblue:11"
              height="10"
            />
            <protvista-track id="track1" length="770">
              <protvista-feature-adapter id="adapter1">
                <data-loader>
                  <source src="https://www.ebi.ac.uk/proteins/api/features/P05067?categories=PTM" />
                </data-loader>
              </protvista-feature-adapter>
            </protvista-track>
            <protvista-track id="track2" length="770" layout="non-overlapping">
              <protvista-feature-adapter id="adapter1">
                <data-loader>
                  <source src="https://www.ebi.ac.uk/proteins/api/features/P05067?categories=PTM" />
                </data-loader>
              </protvista-feature-adapter>
            </protvista-track>
            <protvista-track
              id="track3"
              length="770"
              height="85"
              displaystart="1"
              displayend="80"
              layout="non-overlapping"
            />
            <protvista-interpro-track
              id="interpro-track"
              length="770"
              shape="roundRectangle"
              highlight-event="onmouseover"
              expanded
            />
            <protvista-interpro-track
              id="interpro-track-residues"
              length="770"
              shape="roundRectangle"
              highlight-event="onmouseover"
              expanded
            />
          </div>

          <protvista-variation-graph id="variation-graph" length="770">
            <protvista-variation-adapter>
              <data-loader>
                <source src="https://www.ebi.ac.uk/proteins/api/variation/P05067" />
              </data-loader>
            </protvista-variation-adapter>
          </protvista-variation-graph>
          <protvista-variation id="variation-track" length="770" />
        </protvista-manager>
      </Fragment>
    );
  }
}

export default ProtvistaManagerWrapper;
