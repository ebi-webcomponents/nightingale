import NightingaleNavigation from "../dist/index";

let rendered: NightingaleNavigation;

// eslint-disable-next-line jest/no-disabled-tests
describe.skip("nightingale-navigation tests", () => {
  beforeEach(() => {
    rendered = new NightingaleNavigation();
    rendered.setAttribute("height", "15");
    rendered.setAttribute("length", "10");
    rendered.setAttribute("display-start", "1");
    rendered.setAttribute("display-end", "1");
    document.documentElement.appendChild(rendered);
  });

  afterEach(() => {
    document.documentElement.removeChild(rendered);
  });

  test("it should display the navigation correctly", async () => {
    expect(rendered).toMatchSnapshot();
  });

  test("it should display the navigation correctly after zoom", () => {
    rendered.setAttribute("display-start", "2");
    rendered.setAttribute("display-end", "4");
    return new Promise((done) => {
      window.requestAnimationFrame(() => {
        expect(rendered).toMatchSnapshot();
        done(true);
      });
    });
  });
});
