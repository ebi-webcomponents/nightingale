import ProtvistaSequence from "../src/protvista-sequence";

let rendered;

describe("protvista-sequence tests", () => {
  beforeAll(() => {
    // TODO remove when the definition is part of the import
    window.customElements.define("protvista-sequence", ProtvistaSequence);

    // This is to handle offset values
    // https://github.com/jsdom/jsdom/issues/135#issuecomment-68191941
    Object.defineProperties(window.HTMLElement.prototype, {
      offsetLeft: {
        get() {
          return parseFloat(window.getComputedStyle(this).marginLeft) || 0;
        },
      },
      offsetTop: {
        get() {
          return parseFloat(window.getComputedStyle(this).marginTop) || 0;
        },
      },
      offsetHeight: {
        get() {
          return parseFloat(window.getComputedStyle(this).height) || 0;
        },
      },
      offsetWidth: {
        get() {
          return parseFloat(window.getComputedStyle(this).width) || 0;
        },
      },
    });

    // This is to handle getBBox on SVGElements which lack support
    window.SVGElement.prototype.getBBox = () => ({
      width: 10,
      height: 10,
    });
  });

  beforeEach(() => {
    document.documentElement.innerHTML = `<protvista-sequence sequence="MAMYDDEFDTKASDL" length="15"></protvista-sequence>`;
    rendered = document.querySelector("protvista-sequence");
  });

  afterEach(() => {
    document.querySelector("protvista-sequence").remove();
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
    rendered.setAttribute("highlightstart", "2");
    rendered.setAttribute("highlightstart", "4");
    window.requestAnimationFrame(() => {
      expect(rendered).toMatchSnapshot();
      done();
    });
  });
});
