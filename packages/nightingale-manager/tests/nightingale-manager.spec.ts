import NightingaleManager from "../src/index";

let rendered: NightingaleManager;

describe("nightingale-navigation tests", () => {
  beforeEach(() => {
    rendered = new NightingaleManager();
    // rendered.setAttribute("height", "15");
    document.documentElement.appendChild(rendered);
  });

  afterEach(() => {
    document.documentElement.removeChild(rendered);
  });

  test("", () => {
    rendered.setAttribute("attributes", "item1,item2");
  });
});
