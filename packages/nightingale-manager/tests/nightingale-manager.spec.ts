import NightingaleElement from "@nightingale-elements/nightingale-new-core";
import NightingaleManager from "../src/index";

let rendered: NightingaleManager;

describe("nightingale-navigation tests", () => {
  beforeEach(() => {
    rendered = new NightingaleManager();
    document.documentElement.appendChild(rendered);
  });

  afterEach(() => {
    document.documentElement.removeChild(rendered);
  });

  test("It should propagate reflected attributes", () => {
    rendered.setAttribute("reflected-attributes", "item1,item2");
    const innerElement = document.createElement(
      "div"
    ) as unknown as NightingaleElement;
    rendered.appendChild(innerElement);
    rendered.register(innerElement);
    innerElement.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          type: "item1",
          value: 1234,
        },
        bubbles: true,
        cancelable: true,
      })
    );
    innerElement.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          type: "item2",
          value: "some text",
        },
        bubbles: true,
        cancelable: true,
      })
    );
    expect(innerElement.getAttribute("item1")).toBe("1234");
    expect(innerElement.getAttribute("item2")).toBe("some text");
  });

  test("It should propagate default attributes", () => {
    const innerElement = document.createElement(
      "div"
    ) as unknown as NightingaleElement;
    rendered.appendChild(innerElement);
    rendered.register(innerElement);
    rendered.setAttribute("length", "999");
    rendered.setAttribute("display-start", "100");
    rendered.setAttribute("display-end", "200");
    rendered.setAttribute("highlight", "131:134,141:142");
    expect(innerElement.getAttribute("length")).toBe("999");
    expect(innerElement.getAttribute("display-start")).toBe("100");
    expect(innerElement.getAttribute("display-end")).toBe("200");
    expect(innerElement.getAttribute("highlight")).toBe("131:134,141:142");
  });
});
