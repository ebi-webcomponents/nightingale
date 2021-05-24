import data from "../mocks/features.json";

const elements = {
  clear: {
    name: "clear",
    codeSample: "",
    dataSample: "",
  },
  "protvista-navigation": {
    name: "protvista-navigation",
    codeSample: `
      <protvista-navigation 
          id="protvista-navigation" 
          length="223" 
          displaystart="1" 
          displayend="223" 
      />`,
  },
  "protvista-track": {
    name: "protvista-track",
    codeSample: `
      <protvista-track 
          id="protvista-track" 
          width="1020" 
          length="223" 
          displaystart="1" 
          displayend="223" 
          highlightstart="23" 
          highlightend="45"
          color="red"
      />`,
    dataType: "json",
    dataSample: data,
  },
  "protvista-sequence": {
    name: "protvista-sequence",
    codeSample: `
      <protvista-sequence 
          id="protvista-sequence" 
          width="1020" 
          length="223" 
          displaystart="1" 
          displayend="223" 
          highlightstart="23" 
          highlightend="45"
          numberofticks="3"
       />`,
    dataType: "string",
    dataSample:
      "MAMYDDEFDTKASDLTFSPWVEVENWKDVTTRLRAIKFALQADRDKIPGVLSDLKTNCPYSAFKRFPDKSLYSVLSKEAVIAVAQIQSASGFKRRADEKNAVSGLVSVTPTQISQSASSSAATPVGLATVKPPRESDSAFQEDTFSYAKFDDASTAFHKALAYLEGLSLRPTYRRKFEKDMNVKWGGSGSAPSGAPAGGSSGSAPPTSGSSGSGAAPTPPPNP",
  },
};

export default elements;
