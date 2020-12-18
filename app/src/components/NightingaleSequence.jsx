import React, { Component } from "react";

import "@nightingale-elements/nightingale-sequence";

import Readme from "./Readme";
import readmeContent from "../../../packages/nightingale-sequence/README.md";

class NightingaleSequenceWrapper extends Component {
  componentDidMount() {
    const data =
      "MAMYDDEFDTKASDLTFSPWVEVENWKDVTTRLRAIKFALQADRDKIPGVLSDLKTNCPYSAFKRFPDKSLYSVLSKEAVIAVAQIQSASGFKRRADEKNAVSGLVSVTPTQISQSASSSAATPVGLATVKPPRESDSAFQEDTFSYAKFDDASTAFHKALAYLEGLSLRPTYRRKFEKDMNVKWGGSGSAPSGAPAGGSSGSAPPTSGSSGSGAAPTPPPNP";
    document.querySelector("#seq1").data = data;
    document.querySelector("#seq2").data = data;
    document.querySelector("#seq3").data = data;
    document.querySelector("#seq4").data = data;
  }

  render() {
    return (
      <>
        <Readme content={readmeContent} />
        <nightingale-sequence
          id="seq1"
          length="223"
          displaystart="1"
          displayend="223"
          highlight="23:45"
        />
        <nightingale-sequence
          id="seq2"
          length="223"
          displaystart="10"
          displayend="150"
          highlight="23:45"
        />
        <nightingale-sequence
          id="seq3"
          length="223"
          displaystart="18"
          displayend="100"
          highlight="23:45"
        />
        <nightingale-sequence
          id="seq4"
          length="223"
          displaystart="22"
          displayend="50"
          highlight="23:45"
        />
        <nightingale-sequence
          sequence="MAMYDDEFDTKASDLTFSPWVEVENWKDVTTRLRAIKFALQADRDKIPGVLSDLKTNCPYSAFKRFPDKSLYSVLSKEAVIAVAQIQSASGFKRRADEKNAVSGLVSVTPTQISQSASSSAATPVGLATVKPPRESDSAFQEDTFSYAKFDDASTAFHKALAYLEGLSLRPTYRRKFEKDMNVKWGGSGSAPSGAPAGGSSGSAPPTSGSSGSGAAPTPPPNP"
          length="223"
          displaystart="1"
          displayend="4"
          highlight="23:45"
        />
      </>
    );
  }
}

export default NightingaleSequenceWrapper;
