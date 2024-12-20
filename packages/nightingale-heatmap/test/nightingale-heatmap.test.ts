import NightingaleHeatmap from "../dist/index";
import * as data from "./contact-map.json";
let rendered: NightingaleHeatmap;

describe("nightingale-heatmap tests", () => {
  beforeEach(() => {
    rendered = new NightingaleHeatmap();
    rendered.setAttribute("height", "200");
    rendered.setAttribute("width", "200");
    document.documentElement.appendChild(rendered);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (rendered as any).data = data.value;
  });

  afterEach(() => {
    document.documentElement.removeChild(rendered);
  });

  test("it should render <nightingale-heatmap> element", () => {
    const element = document.querySelector("nightingale-heatmap");
    expect(element).not.toBeNull();
    expect(element instanceof NightingaleHeatmap).toBe(true);
  });

  test("it should render the correct number of x-axis ticks", () => {
    const xAxisElement = document.querySelector("g.x-axis");
    const tickElements = xAxisElement?.querySelectorAll(".tick");
    expect(tickElements).not.toBeNull();
    expect(tickElements?.length).toBe(6);
  });

  test("it should render the correct number of y-axis ticks", () => {
    const yAxisElement = document.querySelector("g.y-axis");
    const tickElements = yAxisElement?.querySelectorAll(".tick");
    expect(tickElements).not.toBeNull();
    expect(tickElements?.length).toBe(6);
  });
});
