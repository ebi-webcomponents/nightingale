import React, { useState, useEffect, useCallback, useRef } from "react";
import ProtvistaMSA from "protvista-msa";
import ProtvistaNavigation from "protvista-navigation";
import ProtvistaManager from "protvista-manager";
import loadWebComponent from "../utils/load-web-component";
import Readme from "./Readme";
import readmeContent from "../../../packages/protvista-msa/README.md";
import Console from "./Console";

const AllowedColorschemes = [
  "aliphatic",
  "aromatic",
  "buried_index",
  "charged",
  "cinema",
  "clustal",
  "clustal2",
  "helix_propensity",
  "hydro",
  "lesk",
  "mae",
  "negative",
  "nucleotide",
  "polar",
  "positive",
  "purine_pyrimidine",
  "serine_threonine",
  "strand_propensity",
  "taylor",
  "turn_propensity",
  "zappo",
  "conservation",
];

const alphabet = "ACDEFGHIKLMNPQRSTVWY-";
const getRandomBase = () =>
  alphabet[Math.floor(Math.random() * alphabet.length)];

let currentColor = null;
const ProtvistaMSAWrapper = () => {
  const [colorScheme, setColorScheme] = useState("clustal");
  const [overlayConservation, setOverlayConservation] = useState(false);
  const [sampleSizeConservation, setSampleSizeConservation] = useState(null);
  const msaTrack = useRef(null);
  const [logs, setLogs] = useState("");
  const addLog = (log) => setLogs(`${logs}\n${log}`);
  const sequence =
    "MAMYDDEFDTKASDLTFSPWVEVENWKDVTTRLRAIKFALQADRDKIPGVLSDLKTNCPYSAFKRFPDKSLYSVLSKEAVIAVAQIQSASGFKRRADEKNAVSGLVSVTPTQISQSASSSAATPVGLATVKPPRESDSAFQEDTFSYAKFDDASTAFHKALAYLEGLSLRPTYRRKFEKDMNVKWGGSGSAPSGAPAGGSSGSAPPTSGSSGSGAAPTPPPNP";
  useEffect(() => {
    const seqs = [];
    for (let i = 0; i < 400; i++) {
      const mutationPos = Math.round(Math.random() * (sequence.length - 1));
      seqs.push({
        name: `seq_${i}`,
        sequence: `${sequence.substring(
          0,
          mutationPos
        )}${getRandomBase()}${sequence.substring(mutationPos + 1)}`,
      });
    }
    msaTrack.current.data = seqs;
    msaTrack.current.addEventListener("conservationProgress", (e) =>
      addLog(`[conservationProgress]: ${e.detail.progress * 100}%`)
    );
    msaTrack.current.addEventListener("drawCompleted", () => {
      const { name, map } = msaTrack.current.getColorMap();
      if (name !== currentColor) {
        if (name && map) {
          addLog(
            `[colors-${name}]:\n${Object.entries(map)
              .map(([base, color]) => `\t${base}: ${color}`)
              .join("\n")}`
          );
        }
        currentColor = name;
      }
    });
    msaTrack.current.onActiveTrackChange = (trackId) => {
      console.log("on active track change:", trackId);
    };
  }, []);

  loadWebComponent("protvista-msa", ProtvistaMSA);
  loadWebComponent("protvista-navigation", ProtvistaNavigation);
  loadWebComponent("protvista-manager", ProtvistaManager);

  const handleColorChange = (event) => {
    setColorScheme(event.target.value);
    addLog(`[setColorScheme]: ${event.target.value}`);
  };
  const labelWidth = 100;
  const conervationOptions = {
    "calculate-conservation": true,
  };
  if (overlayConservation) {
    conervationOptions["overlay-conservation"] = true;
  }
  if (sampleSizeConservation > 0) {
    conervationOptions["sample-size-conservation"] = sampleSizeConservation;
  }

  return (
    <>
      <h1>protvista-msa</h1>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>
          colorScheme:
          <select
            value={colorScheme}
            onChange={handleColorChange}
            onBlur={handleColorChange}
          >
            {AllowedColorschemes.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          overlayConservation:
          <input
            type="checkbox"
            value={overlayConservation}
            onChange={() => setOverlayConservation(!overlayConservation)}
          />
        </label>
        <label>
          sampleSizeConservation:
          <input
            type="number"
            value={sampleSizeConservation || ""}
            onChange={(evt) => setSampleSizeConservation(evt.target.value)}
          />
        </label>
      </div>
      <protvista-manager
        attributes="length displaystart displayend highlight"
        displaystart="1"
        displayend="50"
        id="example"
      >
        <div style={{ display: "flex" }}>
          <div
            style={{
              width: labelWidth,
              flexShrink: 0,
            }}
          />
          <protvista-navigation
            length={sequence.length}
            displaystart="1"
            displayend="50"
          />
        </div>
        <protvista-msa
          id="msa-track"
          ref={msaTrack}
          length={sequence.length}
          height="200"
          displaystart="1"
          displayend="50"
          use-ctrl-to-zoom
          labelWidth={labelWidth}
          colorscheme={colorScheme}
          text-font="16px sans-serif"
          {...conervationOptions}
        />
      </protvista-manager>
      <Console>{logs}</Console>
      <Readme content={readmeContent} />
    </>
  );
};

export default ProtvistaMSAWrapper;
