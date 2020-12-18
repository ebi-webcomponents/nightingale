import NightingaleTrack from "../src/nightingale-track";
import data from "./mockData/data.json";

let rendered;

describe("nightingale-track tests", () => {
  beforeAll(() => {
    // TODO remove when the definition is part of the import
    window.customElements.define("nightingale-track", NightingaleTrack);
  });
  beforeEach(() => {
    document.documentElement.innerHTML = `<nightingale-track length="223"></nightingale-track>`;
    rendered = document.querySelector("nightingale-track");
    rendered.data = data;
  });

  afterEach(() => {
    document.querySelector("nightingale-track").remove();
  });

  test("it should display the track correctly", async () => {
    expect(rendered).toMatchSnapshot();
  });

  test("it should zoom in", async (done) => {
    rendered.setAttribute("displaystart", "2");
    rendered.setAttribute("displayend", "4");
    window.requestAnimationFrame(() => {
      expect(rendered).toMatchSnapshot();
      done();
    });
  });

  test("it should change the layout", async (done) => {
    rendered.setAttribute("layout", "non-overlapping");
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
