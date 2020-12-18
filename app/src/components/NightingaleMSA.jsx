import React, { useState, useEffect, useRef } from "react";

import rawContactsHC from "@nightingale-elements/nightingale-links/tests/mockData/example.tsv";

import "@nightingale-elements/nightingale-msa";
import "@nightingale-elements/nightingale-navigation";
import "@nightingale-elements/nightingale-manager";
import "@nightingale-elements/nightingale-links";

import Readme from "./Readme.jsx";
import readmeContent from "../../../packages/nightingale-msa/README.md";
import Console from "./Console.jsx";
// import { rawContactsHC } from "../mocks/interpro";

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

const features = [
  {
    residues: { from: 1, to: 20 },
    sequences: { from: 0, to: 0 },
    id: "id-1",
    borderColor: "blue",
    fillColor: "black",
  },
  {
    residues: { from: 3, to: 10 },
    sequences: { from: 2, to: 2 },
    id: "id-2",
    borderColor: "blue",
    fillColor: "black",
  },
];

const nSequences = 400;
const nGaps = 20;
const alphabet = "ACDEFGHIKLMNPQRSTVWY-";

const getRandomBase = () =>
  alphabet[Math.floor(Math.random() * alphabet.length)];

const getRandomPosition = (length) => Math.round(Math.random() * (length - 1));

const changeBaseAtPosition = (sequence, base, position) =>
  `${sequence.substring(0, position)}${base}${sequence.substring(
    position + 1
  )}`;

const addGaps = (sequence, nGaps) => {
  let result = sequence;
  for (let i = 0; i < nGaps; i++) {
    const position = getRandomPosition(sequence.length);
    result = changeBaseAtPosition(result, "-", position);
  }
  return result;
};

let currentColor = null;
const NightingaleMSAWrapper = () => {
  const [colorScheme, setColorScheme] = useState("clustal2");
  const [overlayConservation, setOverlayConservation] = useState(false);
  const [sampleSizeConservation, setSampleSizeConservation] = useState(20);
  const msaTrack = useRef(null);
  const [logs, setLogs] = useState("");
  const addLog = (log) => setLogs(`${logs}\n${log}`);
  const sequence =
    "MAMYDDEFDTKASDLTFSPWVEVENWKDVTTRLRAIKFALQADRDKIPGVLSDLKTNCPYSAFKRFPDKSLYSVLSKEAVIAVAQIQSASGFKRRADEKNAVSGLVSVTPTQISQSASSSAATPVGLATVKPPRESDSAFQEDTFSYAKFDDASTAFHKALAYLEGLSLRPTYRRKFEKDMNVKWGGSGSAPSGAPAGGSSGSAPPTSGSSGSGAAPTPPPNPMAMYDDEFDTKASDLTFSPWVEVENWKDVTTRLRAIKFALQADRDKIPGVLSDLKTNCPYSAFKRFPDKSLYSVLSKEAVIAVAQIQSASGFKRRADEKNAVSGLVSVTPTQISQSASSSAATPVGLATVKPPRESDSAFQEDTFSYAKFDDASTAFHKALAYLEGLSLRPTYRRKFEKDMNVKWGGSGSAPSGAPAGGSSGSAPPTSGSSGSGAAPTPPPNPMAMYDDEFDTKASDLTFSPWVEVENWKDVTTRLRAIKFALQADRDKIPGVLSDLKTNCPYSAFKRFPDKSLYSVLSKEAVIAVAQIQSASGFKRRADEKNAVSGLVSVTPTQISQSASSSAATPVGLATVKPPRESDSAFQEDTFSYAKFDDASTAFHKALAYLEGLSLRPTYRRKFEKDMNVKWGGSGSAPSGAPAGGSSGSAPPTSGSSGSGAAPTPPPNP";
  useEffect(() => {
    const seqs = [];
    for (let i = 1; i <= nSequences; i++) {
      const mutationPos = getRandomPosition(sequence.length);
      seqs.push({
        name: `seq_${i}`,
        sequence: addGaps(
          changeBaseAtPosition(sequence, getRandomBase(), mutationPos),
          nGaps
        ),
        start: 1 + getRandomPosition(sequence.length),
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
    document.querySelector("#links-track").data = rawContactsHC;
    msaTrack.current.features = features;
    msaTrack.current.onFeatureClick = (id) => {
      console.log("on feature click:", id);
    };
  }, []);

  const handleColorChange = (event) => {
    setColorScheme(event.target.value);
    addLog(`[setColorScheme]: ${event.target.value}`);
  };
  const labelWidth = 100;
  const conservationOptions = {
    "calculate-conservation": true,
  };
  if (overlayConservation) {
    conservationOptions["overlay-conservation"] = true;
  }
  if (sampleSizeConservation > 0) {
    conservationOptions["sample-size-conservation"] = sampleSizeConservation;
  }

  return (
    <>
      <h1>nightingale-msa</h1>
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
            checked={overlayConservation}
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
      <nightingale-manager
        attributes="length displaystart displayend highlight"
        displaystart="1"
        displayend="100"
        id="example"
      >
        <div style={{ display: "flex", width: "100%" }}>
          <div
            style={{
              width: labelWidth,
              flexShrink: 0,
            }}
          />
          <nightingale-navigation length={sequence.length} />
        </div>
        <div style={{ display: "flex", width: "100%" }}>
          <div
            style={{
              width: labelWidth,
              flexShrink: 0,
              height: "20px",
              textAlign: "left",
              overflow: "hidden",
              fontWeight: "bold",
              fontSize: "14px",
              color: "rgb(0, 99, 154)",
              textTransform: "uppercase",
            }}
          >
            Contacts
          </div>
          <nightingale-links
            id="links-track"
            length={sequence.length}
            height={20}
            use-ctrl-to-zoom
          />
        </div>

        <nightingale-msa
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
          {...conservationOptions}
        />
      </nightingale-manager>
      <Console>{logs}</Console>
      <Readme content={readmeContent} />
    </>
  );
};

export default NightingaleMSAWrapper;
