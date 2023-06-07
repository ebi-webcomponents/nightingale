import NightingaleHeatmap from "../dist/index";
import * as data from "./contact-map.json";
let rendered: NightingaleHeatmap;

describe("nightingale-navigation tests", () => {
  beforeEach(() => {
    rendered = new NightingaleHeatmap();
    rendered.setAttribute("height", "200");
    rendered.setAttribute("height", "200");
    document.documentElement.appendChild(rendered);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (rendered as any).data = data.value;
  });

  afterEach(() => {
    document.documentElement.removeChild(rendered);
  });

  test("it should display the heatmap correctly", async () => {
    expect(rendered).toMatchSnapshot();
    expect(rendered.data.slice(-5)).toMatchSnapshot();
  });

  test("data for the heatmap correctly after symmetric", () => {
    rendered.setAttribute("symmetric", "symmetric");
    return new Promise((done) => {
      window.requestAnimationFrame(() => {
        expect(rendered.data.slice(-5)).toMatchSnapshot();
        done(true);
      });
    });
  });
});
