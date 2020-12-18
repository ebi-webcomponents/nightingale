import ProtvistaTrack from "../src/protvista-track";
import data from "./mockData/data.json";

let rendered;

describe("protvista-track tests", () => {
  beforeAll(() => {
    // TODO remove when the definition is part of the import
    window.customElements.define("protvista-track", ProtvistaTrack);
  });
  beforeEach(() => {
    document.documentElement.innerHTML = `<protvista-track length="223"></protvista-track>`;
    rendered = document.querySelector("protvista-track");
    rendered.data = data;
  });

  afterEach(() => {
    document.querySelector("protvista-track").remove();
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
