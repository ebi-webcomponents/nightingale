import React, { useState, useEffect } from "react";
import loadWebComponent from "../utils/load-web-component";
import data from "../mocks/features.json";
import sanitize from "sanitize-html";

import DataLoader from "data-loader";
import ProtvistaTrack from "protvista-track";
import ProtvistaSequence from "protvista-sequence";
import ProtvistaFeatureAdapter from "protvista-feature-adapter";
import ProtvistaNavigation from "protvista-navigation";

const styleTextArea = {
  fontFamily: "courier",
  fontSize: "16px",
  width: "50vh",
  backgroundColor: "#444",
  color: "#eee"
};
const elements = {
  clear: {
    name: "clear",
    codeSample: "",
    dataSample: ""
  },
  "protvista-navigation": {
    name: "protvista-navigation",
    codeSample: `
      <protvista-navigation 
          id="protvista-navigation" 
          width="1020" 
          length="223" 
          displaystart="1" 
          displayend="223" 
      />`
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
          style="width: 100%;" 
      />`,
    dataType: "json",
    dataSample: data
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
       />`,
    dataType: "string",
    dataSample:
      "MAMYDDEFDTKASDLTFSPWVEVENWKDVTTRLRAIKFALQADRDKIPGVLSDLKTNCPYSAFKRFPDKSLYSVLSKEAVIAVAQIQSASGFKRRADEKNAVSGLVSVTPTQISQSASSSAATPVGLATVKPPRESDSAFQEDTFSYAKFDDASTAFHKALAYLEGLSLRPTYRRKFEKDMNVKWGGSGSAPSGAPAGGSSGSAPPTSGSSGSGAAPTPPPNP"
  }
};

const ExampleSelector = ({ changeHandler }) => (
  <select onChange={changeHandler}>
    {Object.keys(elements).map(name => (
      <option key={name}>{name}</option>
    ))}
  </select>
);

const CodeArea = ({ example, changeHandler }) => {
  const [content, setContent] = useState("");
  const [currentExample, setCurrentExample] = useState(example);
  useEffect(() => {
    if (example !== currentExample) {
      setCurrentExample(example);
      setContent(elements[example] && elements[example].codeSample);
    }
    changeHandler(content);
  });
  return (
    <div style={{width: '50vh', display: 'inline-block'}}>
      <header>Code:</header>
      <textarea
        onChange={evt => setContent(evt.target.value)}
        rows="20"
        value={content}
        style={styleTextArea}
      />
    </div>
  );
};
const DataArea = ({ example, changeHandler }) => {
  const [content, setContent] = useState("");
  const [currentExample, setCurrentExample] = useState(example);
  useEffect(() => {
    if (example !== currentExample) {
      setCurrentExample(example);
      setContent(
        data2string(elements[example] && elements[example].dataSample, example)
      );
    }
    changeHandler(content);
  });
  return (
    <div style={{width: '50vh', display: 'inline-block'}}>
      <header>Data:</header>
      <textarea
        onChange={evt => setContent(evt.target.value)}
        rows="20"
        value={content}
        style={styleTextArea}
      />
    </div>
  );
};

const string2data = (text, example) => {
  const { dataType } = elements[example];
  if (dataType === "json") return JSON.parse(text);
  if (dataType === "string") return text;
  return text;
};

const checkHTML = html => {
  if (typeof html !== "string" || html.toLowerCase().indexOf("<script") !== -1)
    return false;

  var clean = sanitize(html);
  console.log(clean);
  return true;
};

const data2string = (data, example) => {
  const { dataType } = elements[example];
  if (dataType === "json") return JSON.stringify(data, null, 2);
  if (dataType === "string") return data;
  return data;
};

const DemoArea = ({ code, data, example }) => {
  const html = {
    __html: checkHTML(code)
      ? code
      : "Not a valid HTML. Scripts aren't allowed either"
  };
  useEffect(() => {
    if (
      data &&
      document.getElementById(example) &&
      document.getElementById(example).data !== data
    )
      document.getElementById(example).data = string2data(data, example);
  });
  return <div dangerouslySetInnerHTML={html} />;
};

const loadWebComponents = () => {
  loadWebComponent("protvista-feature-adapter", ProtvistaFeatureAdapter);
  loadWebComponent("protvista-track", ProtvistaTrack);
  loadWebComponent("protvista-sequence", ProtvistaSequence);
  loadWebComponent("protvista-navigation", ProtvistaNavigation);
  loadWebComponent("data-loader", DataLoader);
};
const Playground = () => {
  const [example, setExample] = useState(null);
  const [code, setCode] = useState("");
  const [data, setData] = useState("");
  loadWebComponents();
  return (
    <div>
      <h1>Playground area</h1>
      <ExampleSelector changeHandler={evt => setExample(evt.target.value)} />
      <br />
      <CodeArea example={example} changeHandler={c => setCode(c)} />
      <DataArea example={example} changeHandler={d => setData(d)} />
      <br />
      {code && <DemoArea example={example} code={code} data={data} />}
    </div>
  );
};

export default Playground;
