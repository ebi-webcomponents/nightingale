import NightingaleElement from "@nightingale-elements/nightingale-new-core";
import NightingaleManager from "../dist/index";

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
    const innerElement1 = document.createElement(
      "div",
    ) as unknown as NightingaleElement;
    const innerElement2 = document.createElement(
      "div",
    ) as unknown as NightingaleElement;
    rendered.appendChild(innerElement1);
    rendered.register(innerElement1);
    rendered.appendChild(innerElement2);
    rendered.register(innerElement2);
    innerElement1.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          type: "item1",
          value: 1234,
        },
        bubbles: true,
        cancelable: true,
      }),
    );
    innerElement1.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          type: "item2",
          value: "some text",
        },
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(innerElement1.getAttribute("item1")).toBe("1234");
    expect(innerElement1.getAttribute("item2")).toBe("some text");
    expect(innerElement2.getAttribute("item1")).toBe("1234");
    expect(innerElement2.getAttribute("item2")).toBe("some text");
  });

  test("It should propagate default attributes", () => {
    const innerElement = document.createElement(
      "div",
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
