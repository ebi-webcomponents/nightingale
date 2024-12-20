import "../dist/index";
import * as data from "./mockData/data.json";

let rendered;

describe("nightingale-track tests", () => {
  beforeEach(async () => {
    document.documentElement.innerHTML = `<nightingale-track length="223" height="80"></nightingale-track>`;
    rendered = document.querySelector("nightingale-track");
    await new Promise((resolve) => requestAnimationFrame(() => resolve()));
    await rendered.updateComplete;
    rendered.data = data;
  });

  afterEach(() => {
    document.querySelector("nightingale-track").remove();
  });

  test("it should display the track correctly with no highlight and no margin rects", () => {
    expect(document.querySelector("nightingale-track")).toBeDefined();
    expect(document.querySelectorAll("rect").length).toBe(34);
    expect(document.querySelector("g.highlighted>rect")).toBeFalsy();
    expect(document.querySelector("rect.margin-left")).toBeFalsy();
    expect(document.querySelector("rect.margin-right")).toBeFalsy();
    expect(document.querySelector("rect.margin-top")).toBeFalsy();
    expect(document.querySelector("rect.margin-bottom")).toBeFalsy();
  });

  // eslint-disable-next-line jest/no-disabled-tests
  test.skip("it should zoom in with correct number of rects and with no highlight", (done) => {
    rendered.setAttribute("display-start", "2");
    rendered.setAttribute("display-end", "4");
    window.requestAnimationFrame(() => {
      expect(document.querySelector("nightingale-track")).toBeDefined();
      expect(document.querySelector("g.highlighted>rect")).toBeFalsy();
      done();
    });
  });

  test("it should change the layout with margins and have no highlight", (done) => {
    rendered.setAttribute("layout", "non-overlapping");
    window.requestAnimationFrame(() => {
      expect(document.querySelector("nightingale-track")).toBeDefined();
      expect(document.querySelector("rect.margin-left")).toBeDefined();
      expect(document.querySelector("rect.margin-right")).toBeDefined();
      expect(document.querySelector("rect.margin-top")).toBeDefined();
      expect(document.querySelector("rect.margin-bottom")).toBeDefined();
      expect(document.querySelector("g.highlighted>rect")).toBeFalsy();
      done();
    });
  });

  // eslint-disable-next-line jest/no-disabled-tests
  test.skip("it should display display highlight after being set", (done) => {
    rendered.setAttribute("highlight", "10:30");
    window.requestAnimationFrame(() => {
      expect(document.querySelector("g.highlighted>rect")).toBeTruthy();
      done();
    });
  });
});
