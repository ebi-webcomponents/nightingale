import "../dist/index";
import * as data from "./mockData/data.json";

let rendered;

describe("nightingale-track tests", () => {
  beforeEach(async () => {
    document.documentElement.innerHTML = `<nightingale-track length="223" height="80"></nightingale-track>`;
    rendered = document.querySelector("nightingale-track");
    await new Promise((resolve) => requestAnimationFrame(() => resolve()));
    await rendered.updateComplete;
    rendered.data = data;
  });

  afterEach(() => {
    document.querySelector("nightingale-track").remove();
  });

  test("it should display the track correctly", async () => {
    expect(rendered).toMatchSnapshot();
  });

  test("it should zoom in", (done) => {
    rendered.setAttribute("display-start", "2");
    rendered.setAttribute("display-end", "4");
    window.requestAnimationFrame(() => {
      expect(rendered).toMatchSnapshot();
      done();
    });
  });

  test("it should change the layout", (done) => {
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
