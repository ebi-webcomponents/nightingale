import NightingaleSunburst from "../src/index";
import * as data from "./taxonomy.min.json";

let rendered: NightingaleSunburst;

describe("nightingale-sunburst tests", () => {
  beforeEach(async () => {
    rendered = new NightingaleSunburst();
    rendered.setAttribute("size", "200");
    rendered.setAttribute("weight-attribute", "numSpecies");
    document.documentElement.appendChild(rendered);
    (rendered as any).data = data;
  });
  afterEach(() => {
    if (!rendered) document.documentElement.removeChild(rendered);
  });
  test("it should display the navigation correctly", async () => {
    expect(rendered).toMatchSnapshot();
  });
  test("calculate the hierarchy correctly", async () => {
    expect(rendered.data).toMatchSnapshot();
    expect(rendered.root).toMatchSnapshot();
  });
});
