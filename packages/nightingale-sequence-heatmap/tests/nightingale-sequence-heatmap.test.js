import "../dist/index";
import { xDomain, yDomain, data } from "./mockData/mockdata";

let rendered;

// TODO: unskip once a strategy for testing canvas has been decided
// eslint-disable-next-line jest/no-disabled-tests
describe.skip("nightingale-sequence-heatmap tests", () => {
  beforeEach(async () => {
    document.documentElement.innerHTML = `<nightingale-sequence-heatmap  heatmap-id="testId" width="500" height="500"></nightingale-sequence-heatmap>`;
    rendered = document.querySelector("nightingale-sequence-heatmap");
    await new Promise((resolve) => requestAnimationFrame(() => resolve()));
    await rendered.updateComplete;
    rendered.setHeatmapData(xDomain, yDomain, data);
  });

  afterEach(() => {
    document.querySelector("nightingale-sequence-heatmap").remove();
  });

  test("it should display the sequence heatmap correctly", async () => {
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

  test("it should display the sequence correctly after highlight", (done) => {
    rendered.setAttribute("highlight", "1:3");
    window.requestAnimationFrame(() => {
      expect(rendered).toMatchSnapshot();
      done();
    });
  });
});
