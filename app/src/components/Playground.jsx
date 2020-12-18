import React, { useState, useEffect } from "react";

import elements from "./examples";

import "@nightingale-elements/data-loader";
import "@nightingale-elements/nightingale-track";
import "@nightingale-elements/nightingale-sequence";
import "@nightingale-elements/nightingale-feature-adapter";
import "@nightingale-elements/nightingale-navigation";

const styleTextArea = {
  fontFamily: "courier",
  fontSize: "16px",
  width: "50vh",
  backgroundColor: "#444",
  color: "#eee",
};

const ExampleSelector = ({ changeHandler }) => (
  <select onChange={changeHandler}>
    {Object.keys(elements).map((name) => (
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
    <div style={{ width: "50vh", display: "inline-block" }}>
      <header>Code:</header>
      <textarea
        onChange={(evt) => setContent(evt.target.value)}
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
    <div style={{ width: "50vh", display: "inline-block" }}>
      <header>Data:</header>
      <textarea
        onChange={(evt) => setContent(evt.target.value)}
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

const checkHTML = (html) => {
  return !(
    typeof html !== "string" || html.toLowerCase().indexOf("<script") !== -1
  );
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
      : "Not a valid HTML. Scripts aren't allowed either",
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

const Playground = () => {
  const [example, setExample] = useState(null);
  const [code, setCode] = useState("");
  const [data, setData] = useState("");

  return (
    <div>
      <h1>Playground area</h1>
      <ExampleSelector changeHandler={(evt) => setExample(evt.target.value)} />
      <br />
      <CodeArea example={example} changeHandler={(c) => setCode(c)} />
      <DataArea example={example} changeHandler={(d) => setData(d)} />
      <br />
      {code && <DemoArea example={example} code={code} data={data} />}
    </div>
  );
};

export default Playground;
