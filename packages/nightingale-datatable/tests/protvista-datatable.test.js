import { findByText } from "@testing-library/dom";
import NightingaleDatatable from "../src/nightingale-datatable";

import data from "./mockData/data.json";
import columnConfig from "./mockData/columnConfig";

let rendered;

describe("nightingale-datatable tests", () => {
  beforeAll(() => {
    // TODO remove when the definition is part of the import
    window.customElements.define("nightingale-datatable", NightingaleDatatable);
  });

  beforeEach(() => {
    const elt = document.createElement("nightingale-datatable");
    document.documentElement.appendChild(elt);

    rendered = document.querySelector("nightingale-datatable");
  });

  it("should render the datatable and expose the shadowRoot", async () => {
    rendered.data = data;
    rendered.columns = columnConfig;

    const text = await findByText(rendered.shadowRoot, "Barry");
    expect(text).toBeTruthy();
  });
});
