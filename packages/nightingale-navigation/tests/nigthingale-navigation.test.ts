import NightingaleNavigation from "../src/index";

let rendered: NightingaleNavigation;

describe("nightingale-navigation tests", () => {
  beforeEach(() => {
    rendered = new NightingaleNavigation();
    rendered.setAttribute("height", "15");
    document.documentElement.appendChild(rendered);
  });

  afterEach(() => {
    document.documentElement.removeChild(rendered);
  });

  test("it should display the navigation correctly", async () => {
    expect(rendered).toMatchSnapshot();
  });

  test("it should display the navigation correctly after zoom", (done) => {
    rendered.setAttribute("display-start", "2");
    rendered.setAttribute("display-end", "4");
    window.requestAnimationFrame(() => {
      expect(rendered).toMatchSnapshot();
      done();
    });
  });
});
