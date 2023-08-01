import "../dist/index";
import * as iproData from "./mockData/interpro-IPR016039.json";
import * as contributors from "./mockData/interpro-contributors.json";
import * as residues from "./mockData/interpro-residues.json";

let rendered;

describe("nightingale-interpro-track tests", () => {
  beforeEach(async () => {
    document.documentElement.innerHTML = `<nightingale-interpro-track length="450" height="20"></nightingale-interpro-track>`;
    rendered = document.querySelector("nightingale-interpro-track");
    await new Promise((resolve) => requestAnimationFrame(() => resolve()));
    await rendered.updateComplete;
    rendered.data = iproData;
    contributors[0].residues = residues;
    rendered.contributors = contributors;
  });

  afterEach(() => {
    document.querySelector("nightingale-interpro-track").remove();
  });

  test("it should display the track correctly", async () => {
    expect(rendered).toMatchSnapshot();
  });

  test("it should zoom in", (done) => {
    rendered.setAttribute("display-start", "260");
    rendered.setAttribute("display-end", "264");
    window.requestAnimationFrame(() => {
      expect(rendered).toMatchSnapshot();
      done();
    });
  });

  test("it should display the sequence correctly after highlight", (done) => {
    rendered.setAttribute("highlight", "10:30");
    window.requestAnimationFrame(() => {
      expect(rendered).toMatchSnapshot();
      done();
    });
  });
});
