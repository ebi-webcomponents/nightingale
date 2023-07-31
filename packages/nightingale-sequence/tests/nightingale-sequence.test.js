import "../dist/index";

let rendered;
const sequence = "MADYDDEFDTKASDL";

describe("nightingale-sequence tests", () => {
  beforeEach(async () => {
    document.documentElement.innerHTML = `<nightingale-sequence sequence="${sequence}" length="15" width="800" height="100"></nightingale-sequence>`;
    rendered = document.querySelector("nightingale-sequence");
    await new Promise((resolve) => requestAnimationFrame(() => resolve()));
    await rendered.updateComplete;
  });

  afterEach(() => {
    document.querySelector("nightingale-sequence").remove();
  });

  test("it should display the sequence correctly", async () => {
    const firstValue = rendered.querySelector(
      ".sequence text.base:first-child",
    ).textContent;
    expect(firstValue).toBe(sequence[0]);
    const lastValue = rendered.querySelector(
      ".sequence text.base:last-child",
    ).textContent;
    expect(lastValue).toBe(sequence[sequence.length - 1]);
    expect(rendered).toMatchSnapshot();
  });

  test("it should display the sequence correctly after zoom", (done) => {
    const initialWidth = rendered
      .querySelector(".background rect")
      .getAttribute("width");
    rendered.setAttribute("display-start", "2");
    rendered.setAttribute("display-end", "4");

    window.requestAnimationFrame(() => {
      const firstValue = rendered.querySelector(
        ".sequence text.base:first-child",
      ).textContent;
      expect(firstValue).toBe(sequence[1]);
      const lastValue = rendered.querySelector(
        ".sequence text.base:last-child",
      ).textContent;
      expect(lastValue).toBe(sequence[3]);
      expect(rendered).toMatchSnapshot();

      const newWidth = rendered
        .querySelector(".background rect")
        .getAttribute("width");
      expect(Number(newWidth)).toBeGreaterThan(Number(initialWidth));
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
