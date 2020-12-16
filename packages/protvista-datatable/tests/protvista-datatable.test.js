import { findByText } from "@testing-library/dom";
import ProtvistaDatatable from "../src/protvista-datatable";

import data from "./mockData/data.json";
import columnConfig from "./mockData/columnConfig";

let rendered;

describe("protvista-datatable tests", () => {
  beforeAll(() => {
    // TODO remove when the definition is part of the import
    window.customElements.define("protvista-datatable", ProtvistaDatatable);
  });

  beforeEach(() => {
    const elt = document.createElement("protvista-datatable");
    document.documentElement.appendChild(elt);

    rendered = document.querySelector("protvista-datatable");
  });

  it("should render the datatable and expose the shadowRoot", async () => {
    rendered.data = data;
    rendered.columns = columnConfig;

    const text = await findByText(rendered.shadowRoot, "Barry");
    expect(text).toBeTruthy();
  });
});
