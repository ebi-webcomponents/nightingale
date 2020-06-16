import React, { useEffect } from "react";
import ProtvistaMSA from "protvista-msa";
import ProtvistaNavigation from "protvista-navigation";
import ProtvistaManager from "protvista-manager";
import loadWebComponent from "../utils/load-web-component";
import Readme from "./Readme";
import readmeContent from "../../../packages/protvista-msa/README.md";

const alphabet = "ACDEFGHIKLMNPQRSTVWY-";
const getRandomBase = () =>
  alphabet[Math.floor(Math.random() * alphabet.length)];

const ProtvistaMSAWrapper = () => {
  const sequence =
    "MAMYDDEFDTKASDLTFSPWVEVENWKDVTTRLRAIKFALQADRDKIPGVLSDLKTNCPYSAFKRFPDKSLYSVLSKEAVIAVAQIQSASGFKRRADEKNAVSGLVSVTPTQISQSASSSAATPVGLATVKPPRESDSAFQEDTFSYAKFDDASTAFHKALAYLEGLSLRPTYRRKFEKDMNVKWGGSGSAPSGAPAGGSSGSAPPTSGSSGSGAAPTPPPNP";
  useEffect(() => {
    const seqs = [];
    for (let i = 0; i < 1000; i++) {
      const mutation_pos = Math.round(Math.random() * sequence.length);
      seqs.push({
        name: `seq_${i}`,
        sequence: `${sequence.substring(
          0,
          mutation_pos
        )}${getRandomBase()}${sequence.substring(mutation_pos + 1)}`
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
              flexShrink: 0
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
        />
      </protvista-manager>
      <Readme content={readmeContent} />
    </>
  );
};

export default ProtvistaMSAWrapper;
