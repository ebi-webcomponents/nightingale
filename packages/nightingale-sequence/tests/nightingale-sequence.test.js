import "../src/index";

let rendered;

describe("nightingale-sequence tests", () => {
  beforeEach(() => {
    document.documentElement.innerHTML = `<nightingale-sequence sequence="MAMYDDEFDTKASDL" length="15"></nightingale-sequence>`;
    rendered = document.querySelector("nightingale-sequence");
  });

  afterEach(() => {
    document.querySelector("nightingale-sequence").remove();
  });

  test("it should display the sequence correctly", async () => {
    expect(rendered).toMatchSnapshot();
  });

  test("it should display the sequence correctly after zoom", (done) => {
    rendered.setAttribute("displaystart", "2");
    rendered.setAttribute("displayend", "4");
    window.requestAnimationFrame(() => {
      expect(rendered).toMatchSnapshot();
      done();
    });
  });

  test("it should display the sequence correctly after highlight", (done) => {
    rendered.setAttribute("highlight", "2:5");
    window.requestAnimationFrame(() => {
      expect(rendered).toMatchSnapshot();
      done();
    });
  });
});
