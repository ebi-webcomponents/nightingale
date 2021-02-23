import "../src/index";

let rendered;

describe("nightingale-navigation tests", () => {
  beforeEach(() => {
    document.documentElement.innerHTML = `<nightingale-navigation length="15"></nightingale-navigation>`;
    rendered = document.querySelector("nightingale-navigation");
  });

  afterEach(() => {
    document.querySelector("nightingale-navigation").remove();
  });

  test("it should display the navigation correctly", async () => {
    expect(rendered).toMatchSnapshot();
  });

  test("it should display the navigation correctly after zoom", (done) => {
    rendered.setAttribute("displaystart", "2");
    rendered.setAttribute("displayend", "4");
    window.requestAnimationFrame(() => {
      expect(rendered).toMatchSnapshot();
      done();
    });
  });
});
