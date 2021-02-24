import React, { Component } from "react";
import element from "../../../packages/nightingale-coloured-sequence";

import readmeContent from "../../../packages/nightingale-coloured-sequence/README.md";
import Readme from "./Readme";

const data =
  "MAMYDDEFDTKASDLTFSPWVEVENWKDVTTRLRAIKFALQADRDKIPGVLSDLKTNCPYSAFKRFPDKSLYSVLSKEAVIAVAQIQSASGFKRRADEKNAVSGLVSVTPTQISQSASSSAATPVGLATVKPPRESDSAFQEDTFSYAKFDDASTAFHKALAYLEGLSLRPTYRRKFEKDMNVKWGGSGSAPSGAPAGGSSGSAPPTSGSSGSGAAPTPPPNP";

class NightingaleColouredSequenceWrapper extends Component {
  componentDidMount() {
    document.querySelector("#seq1").data = data;
    document.querySelector("#seq2").data = data;
    document.querySelector("#seq3").data = data;
    document.querySelector("#seq4").data = data;
    document.querySelector("#seq5").data = data;
  }

  render() {
    return (
      <>
        <Readme content={readmeContent} />
        <h4>Same Scale - different levels of zoom</h4>

        <element.is
          id="seq1"
          length="223"
          displaystart="1"
          displayend="223"
          height="10"
          scale="hydrophobicity-scale"
        />
        <element.is
          id="seq2"
          length="223"
          height="10"
          displaystart="10"
          displayend="150"
          scale="hydrophobicity-scale"
        />
        <element.is
          id="seq3"
          length="223"
          height="10"
          displaystart="50"
          displayend="70"
          highlight="23:45"
          scale="hydrophobicity-scale"
        />
        <element.is
          id="seq4"
          length="223"
          height="10"
          displaystart="50"
          displayend="70"
          scale="hydrophobicity-scale"
        />
        <element.is
          id="seq5"
          length="223"
          height="10"
          displaystart="203"
          displayend="220"
          scale="hydrophobicity-scale"
        />
        <element.is
          sequence={data}
          length="223"
          height="10"
          displaystart="1"
          displayend="4"
          scale="hydrophobicity-scale"
        />
        <br />
        <h4>Testing Scales</h4>
        <h5>hydrophobicity-scale</h5>
        <element.is
          sequence={data}
          length="223"
          displaystart="1"
          displayend="100"
          scale="hydrophobicity-scale"
        />
        <h5>hydrophobicity-interface-scale</h5>
        <element.is
          sequence={data}
          length="223"
          displaystart="1"
          displayend="100"
          scale="hydrophobicity-interface-scale"
        />
        <h5>hydrophobicity-octanol-scale</h5>
        <element.is
          sequence={data}
          length="223"
          displaystart="1"
          displayend="100"
          scale="hydrophobicity-octanol-scale"
        />
        <h5>isoelectric-point-scale</h5>
        <element.is
          sequence={data}
          length="223"
          displaystart="1"
          displayend="100"
          scale="isoelectric-point-scale"
          color_range="white:0,dodgerblue:11"
        />
        <h5>custom-scale</h5>
        <pre>"T:-2,R:-2,Y:-2,F:2,A:2,I:2,L:2"</pre>
        <element.is
          sequence={data}
          length="223"
          displaystart="1"
          displayend="100"
          scale="T:-2,R:-2,Y:-2,F:2,A:2,I:2,L:2"
        />
        <h4>Testing other colors</h4>
        <h5>hydrophobicity-scale - same colors on a wider scale</h5>
        <element.is
          sequence={data}
          length="223"
          displaystart="1"
          displayend="100"
          scale="hydrophobicity-scale"
          color_range="#ffdd00:-5,#0000FF:5"
        />
        <h5>hydrophobicity-scale - same colors but white inzero values</h5>
        <element.is
          sequence={data}
          length="223"
          displaystart="1"
          displayend="100"
          scale="hydrophobicity-scale"
          color_range="#ffdd00:-2,#FFFFFF:0,#0000FF:2"
        />
        <h5>hydrophobicity-scale - changing completely the color scale. </h5>
        <pre>"red:-3,#FFFFFF:0,#00FF00:3"</pre>
        <element.is
          sequence={data}
          length="223"
          displaystart="1"
          displayend="100"
          scale="hydrophobicity-scale"
          color_range="red:-3,#FFFFFF:0,#00FF00:3"
        />
      </>
    );
  }
}

export default NightingaleColouredSequenceWrapper;
