import React, { useEffect, useState, useRef } from "react";

import Readme from "./Readme";
import readmeContent from "../../../packages/textarea-sequence/README.md";

import "@nightingale-elements/textarea-sequence";

const NightingaleNavigationWrapper = () => {
  const element = useRef(null);
  const [errors, setErrors] = useState({});
  const [valid, setValid] = useState(true);
  useEffect(() => {
    element.current.addEventListener("error-change", (e) => {
      setErrors(e.detail.errors);
      setValid(element.current.valid);
    });
  }, []);

  return (
    <>
      <h1>textarea-sequence</h1>
      <nightingale-sequence
        ref={element}
        height="10em"
        min-sequence-length="10"
        single="true"
        allow-comments="true"
        name="example-sequence"
        inner-style="letter-spacing: .01rem;"
      />
      <button disabled={valid} onClick={() => element.current.cleanUp()}>
        CleanUp Sequence
      </button>
      {errors !== {} && (
        <table>
          <tbody>
            {Object.entries(errors).map(([error, value]) => (
              <tr key={error}>
                <td>{error}</td>
                <td>{value ? "❌" : "✅"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Readme content={readmeContent} />
    </>
  );
};

export default NightingaleNavigationWrapper;
