import React, { Component } from "react";
import "@nightingale-elements/nightingale-manager";
import "@nightingale-elements/data-loader";
import "@nightingale-elements/nightingale-feature-adapter";
import "@nightingale-elements/nightingale-track";
import "@nightingale-elements/nightingale-navigation";
import "@nightingale-elements/nightingale-sequence";
import "@nightingale-elements/nightingale-coloured-sequence";
import "@nightingale-elements/nightingale-variation";
import "@nightingale-elements/nightingale-variation-graph";
import "@nightingale-elements/nightingale-variation-adapter";
import "@nightingale-elements/nightingale-interpro-track";
// import "@nightingale-elements/nightingale-links";
import variantData from "../mocks/variants.json";
import sequence from "../mocks/sequence.json";
import { dataIPR, signatures, withResidues } from "../mocks/interpro";
import { rawContactsHC } from "../mocks/interpro";
import secondaryStructureData from "../mocks/interpro-secondary-structure.json";
import NightingaleSaver from "@nightingale-elements/nightingale-saver";
import NightingaleOverlay from "@nightingale-elements/nightingale-overlay";
import NightingaleZoomTool from "@nightingale-elements/nightingale-zoom-tool";
import Readme from "./Readme";
import readmeContent from "../../../packages/nightingale-manager/README.md";

class NightingaleManagerWrapper extends Component {
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
    // document.querySelector("#links-track").data = rawContactsHC;
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
      title.innerHTML = "Nightingale Snapshot";
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
    return (
      <>
        <Readme content={readmeContent} />
        <nightingale-saver element-id="example" id="saver" />
        <nightingale-saver
          element-id="just-tracks"
          id="saver2"
          file-name="tracks"
          file-format="jpeg"
        >
          <button>Download Just Tracks</button>
        </nightingale-saver>
        <nightingale-overlay for="just-tracks" />
        <nightingale-manager displaystart="1" displayend="100" id="example">
          <nightingale-zoom-tool length="770" style={{ float: "right" }} />
          <nightingale-navigation length="770" />
          <div id="just-tracks">
            <nightingale-sequence
              length="770"
              id="sequence-track"
              highlight-event="onmouseover"
              use-ctrl-to-zoom
            />
            <nightingale-coloured-sequence
              length="770"
              id="sequence-coloured-track"
              scale="hydrophobicity-interface-scale"
              height="10"
              highlight-event="onmouseover"
              use-ctrl-to-zoom
            />
            <nightingale-coloured-sequence
              length="770"
              id="sequence-coloured-track-iso"
              scale="isoelectric-point-scale"
              color_range="white:0,dodgerblue:11"
              height="10"
              use-ctrl-to-zoom
            />

            {/* <nightingale-links
              id="links-track"
              length="770"
              height={20}
              use-ctrl-to-zoom
            /> */}

            <nightingale-track
              id="track1"
              length="770"
              use-ctrl-to-zoom
              highlight-event="onclick"
            >
              <nightingale-feature-adapter id="adapter1">
                <data-loader>
                  <source src="https://www.ebi.ac.uk/proteins/api/features/P05067?categories=PTM" />
                </data-loader>
              </nightingale-feature-adapter>
            </nightingale-track>
            <nightingale-track
              id="track2"
              length="770"
              layout="non-overlapping"
              use-ctrl-to-zoom
              highlight-event="onclick"
            >
              <nightingale-feature-adapter id="adapter1">
                <data-loader>
                  <source src="https://www.ebi.ac.uk/proteins/api/features/P05067?categories=PTM" />
                </data-loader>
              </nightingale-feature-adapter>
            </nightingale-track>
            <nightingale-track
              id="track3"
              length="770"
              displaystart="1"
              displayend="80"
              layout="non-overlapping"
              use-ctrl-to-zoom
              highlight-event="onclick"
            />
            <nightingale-interpro-track
              id="interpro-track"
              length="770"
              shape="roundRectangle"
              highlight-event="onmouseover"
              expanded
              use-ctrl-to-zoom
            />
            <nightingale-interpro-track
              id="interpro-track-residues"
              length="770"
              shape="roundRectangle"
              highlight-event="onmouseover"
              expanded
              use-ctrl-to-zoom
            />

            <nightingale-variation-graph
              id="variation-graph"
              length="770"
              use-ctrl-to-zoom
            >
              <nightingale-variation-adapter>
                <data-loader>
                  <source src="https://www.ebi.ac.uk/proteins/api/variation/P05067" />
                </data-loader>
              </nightingale-variation-adapter>
            </nightingale-variation-graph>
            <nightingale-variation
              id="variation-track"
              length="770"
              use-ctrl-to-zoom
              highlight-event="onclick"
            />
          </div>
        </nightingale-manager>
      </>
    );
  }
}

export default NightingaleManagerWrapper;
