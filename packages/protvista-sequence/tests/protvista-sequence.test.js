import { findByText } from "@testing-library/dom";
import ProtvistaSequence from "../src/protvista-sequence";

let rendered;

describe("protvista-sequence tests", () => {
  beforeAll(() => {
    // TODO remove when the definition is part of the import
    window.customElements.define("protvista-sequence", ProtvistaSequence);
  });

  beforeEach(() => {
    const elt = document.createElement("protvista-sequence");
    elt.sequence =
      "MAMYDDEFDTKASDLTFSPWVEVENWKDVTTRLRAIKFALQADRDKIPGVLSDLKTNCPYSAFKRFPDKSLYSVLSKEAVIAVAQIQSASGFKRRADEKNAVSGLVSVTPTQISQSASSSAATPVGLATVKPPRESDSAFQEDTFSYAKFDDASTAFHKALAYLEGLSLRPTYRRKFEKDMNVKWGGSGSAPSGAPAGGSSGSAPPTSGSSGSGAAPTPPPNP";
    elt.length = "223";
    // elt.displaystart="1"
    // elt.displayend="4"
    // elt.highlightStart="2"
    // elt.highlightEnd="2"
    document.documentElement.appendChild(elt);
    rendered = document.querySelector("protvista-sequence");
  });

  test("it should display the sequence correctly", () => {
    const text = findByText(rendered, "LQA");
    console.log("here");
    expect(text).toBeTruthy();
  });
});
