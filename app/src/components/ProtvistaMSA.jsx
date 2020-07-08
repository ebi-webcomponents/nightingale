import React, { useState, useEffect } from "react";
import ProtvistaMSA from "protvista-msa";
import ProtvistaNavigation from "protvista-navigation";
import ProtvistaManager from "protvista-manager";
import loadWebComponent from "../utils/load-web-component";
import Readme from "./Readme";
import readmeContent from "../../../packages/protvista-msa/README.md";

const AllowedColorschemes = [
  "buried_index",
  "clustal",
  "clustal2",
  "cinema",
  "helix_propensity",
  "hydro",
  "lesk",
  "mae",
  "nucleotide",
  "purine_pyrimidine",
  "strand_propensity",
  "taylor",
  "turn_propensity",
  "zappo",
  "conservation",
];

const alphabet = "ACDEFGHIKLMNPQRSTVWY-";
const getRandomBase = () =>
  alphabet[Math.floor(Math.random() * alphabet.length)];

const ProtvistaMSAWrapper = () => {
  const [ColorScheme, setColorScheme] = useState("clustal");
  const sequence =
    "MAMYDDEFDTKASDLTFSPWVEVENWKDVTTRLRAIKFALQADRDKIPGVLSDLKTNCPYSAFKRFPDKSLYSVLSKEAVIAVAQIQSASGFKRRADEKNAVSGLVSVTPTQISQSASSSAATPVGLATVKPPRESDSAFQEDTFSYAKFDDASTAFHKALAYLEGLSLRPTYRRKFEKDMNVKWGGSGSAPSGAPAGGSSGSAPPTSGSSGSGAAPTPPPNP";
  useEffect(() => {
    const seqs = [];
    for (let i = 0; i < 400; i++) {
      const mutation_pos = Math.round(Math.random() * (sequence.length - 1));
      seqs.push({
        name: `seq_${i}`,
        sequence: `${sequence.substring(
          0,
          mutation_pos
        )}${getRandomBase()}${sequence.substring(mutation_pos + 1)}`,
      });
    }
    document.querySelector("#msa-track").data = seqs;
  });

  loadWebComponent("protvista-msa", ProtvistaMSA);
  loadWebComponent("protvista-navigation", ProtvistaNavigation);
  loadWebComponent("protvista-manager", ProtvistaManager);
  const labelWidth = 100;

  return (
    <>
      <h1>protvista-msa</h1>
      <select
        value={ColorScheme}
        onChange={(event) => setColorScheme(event.target.value)}
      >
        {AllowedColorschemes.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
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
          length={sequence.length}
          height="200"
          displaystart="1"
          displayend="50"
          use-ctrl-to-zoom
          labelWidth={labelWidth}
          colorscheme={ColorScheme}
        />
      </protvista-manager>
      <Readme content={readmeContent} />
    </>
  );
};

export default ProtvistaMSAWrapper;
