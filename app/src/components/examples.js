import data from "../mocks/features.json";

const elements = {
  clear: {
    name: "clear",
    codeSample: "",
    dataSample: "",
  },
  "nightingale-navigation": {
    name: "nightingale-navigation",
    codeSample: `
      <nightingale-navigation 
          id="nightingale-navigation" 
          length="223" 
          displaystart="1" 
          displayend="223" 
      />`,
  },
  "nightingale-track": {
    name: "nightingale-track",
    codeSample: `
      <nightingale-track 
          id="nightingale-track" 
          width="1020" 
          length="223" 
          displaystart="1" 
          displayend="223" 
          highlight="23:45"
          color="red"
      />`,
    dataType: "json",
    dataSample: data,
  },
  "nightingale-sequence": {
    name: "nightingale-sequence",
    codeSample: `
      <nightingale-sequence 
          id="nightingale-sequence" 
          width="1020" 
          length="223" 
          displaystart="1" 
          displayend="223" 
          highlight="23:45"
       />`,
    dataType: "string",
    dataSample:
      "MAMYDDEFDTKASDLTFSPWVEVENWKDVTTRLRAIKFALQADRDKIPGVLSDLKTNCPYSAFKRFPDKSLYSVLSKEAVIAVAQIQSASGFKRRADEKNAVSGLVSVTPTQISQSASSSAATPVGLATVKPPRESDSAFQEDTFSYAKFDDASTAFHKALAYLEGLSLRPTYRRKFEKDMNVKWGGSGSAPSGAPAGGSSGSAPPTSGSSGSGAAPTPPPNP",
  },
};

export default elements;
