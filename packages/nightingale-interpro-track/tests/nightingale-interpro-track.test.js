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

  test("it should show nightingale-interpro-track and the current number of residue features coverage mask rects and no highlight", () => {
    expect(document.querySelector("nightingale-interpro-track")).toBeDefined();
    expect(
      document.querySelectorAll("path.feature.rectangle.residue").length
    ).toBe(16);
    expect(document.querySelectorAll("rect").length).toBe(13);
    expect(document.querySelector("g.highlighted>rect")).toBeFalsy();
  });

  test("it should zoom in with correct number of features and location groups and no highlight", (done) => {
    rendered.setAttribute("display-start", "260");
    rendered.setAttribute("display-end", "264");
    window.requestAnimationFrame(() => {
      expect(
        document.querySelectorAll("path.rectangle.child-fragment.feature")
          .length
      ).toBe(6);
      expect(document.querySelectorAll("g.location-group").length).toBe(2);
      expect(document.querySelector("g.highlighted>rect")).toBeFalsy();
      done();
    });
  });

  // eslint-disable-next-line jest/no-disabled-tests
  test.skip("it should display the highlight", (done) => {
    rendered.setAttribute("highlight", "10:30");
    window.requestAnimationFrame(() => {
      expect(document.querySelector("g.highlighted>rect")).toBeTruthy();
      done();
    });
  });
});
