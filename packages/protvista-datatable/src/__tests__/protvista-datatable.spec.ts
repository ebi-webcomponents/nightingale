import {
  fireEvent,
  getByRole,
  getByTestId,
  getByText,
  waitFor,
} from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";

import ProtvistaDatatable from "../protvista-datatable";

describe("protvista-datatable", () => {
  beforeAll(() => {
    // TODO remove when the definition is part of the import
    window.customElements.define("protvista-datatable", ProtvistaDatatable);
  });

  afterEach(() => {
    document.querySelector("protvista-datatable").remove();
    document.documentElement.innerHTML = "";
  });

  test("it should display the datatable correctly", async () => {
    document.documentElement.innerHTML = `
<protvista-datatable>
    <table>
        <thead>
            <tr>
                <th>Col A</th>
                <th>Col B</th>
                <th>Col C</th>
                <th>Col D</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Row 1 A</td>
                <td>Row 1 B</td>
                <td>Row 1 C</td>
                <td>Row 1 D</td>
            </tr>
            <tr>
                <td>Row 2 A</td>
                <td>Row 2 B</td>
                <td>Row 2 C</td>
                <td>Row 2 D</td>
            </tr>
        </tbody>
    </table>
</protvista-datatable>
    `;
    const rendered = document.querySelector("protvista-datatable");
    expect(rendered).toMatchSnapshot();
  });

  it("should handle grouped rows", async () => {
    document.documentElement.innerHTML = `
    <protvista-datatable>
        <table>
            <thead>
                <tr>
                    <th>Col A</th>
                    <th>Col B</th>
                    <th>Col C</th>
                </tr>
            </thead>
            <tbody>
                <tr data-id="id1">
                    <td>Row 1 A</td>
                    <td>Row 1 B</td>
                    <td>Row 1 C</td>
                    <td>Row 1 D</td>
                </tr>
                <tr data-group-for="id1">
                    <td>Long row</td>
                </tr>
        </tbody>
    </table>
</protvista-datatable>
        `;
    const rendered = document.querySelector<HTMLElement>("protvista-datatable");
    const lr = getByText(rendered, "Long row") as HTMLTableCellElement;
    expect(lr).not.toBeVisible();
    expect(lr.colSpan).toBe(4);
    const button = getByRole(rendered, "button");
    fireEvent.click(button);
    await waitFor(() => {
      expect(lr).toBeVisible();
    });
  });

  it("should handle filters", async () => {
    document.documentElement.innerHTML = `
    <protvista-datatable>
        <table>
            <thead>
                <tr>
                    <th>Col A</th>
                    <th data-filter="col_b">Col B</th>
                    <th>Col C</th>
                </tr>
            </thead>
            <tbody>
                <tr data-id="id1" data-testid="id1">
                    <td>Row 1 A</td>
                    <td data-filter="col_b">Row 1 B</td>
                    <td>Row 1 C</td>
                </tr>
                <tr data-id="id2" data-testid="id2">
                    <td>Row 2 A</td>
                    <td data-filter="col_b">Row 2 B</td>
                    <td>Row 2 C</td>
                </tr>
                <tr data-id="id3" data-testid="id3">
                    <td>Row 3 A</td>
                    <td data-filter="col_b">Row 3 B</td>
                    <td>Row 3 C</td>
                </tr>
        </tbody>
    </table>
</protvista-datatable>
        `;
    const rendered = document.querySelector<HTMLElement>("protvista-datatable");
    const selectMenu = getByTestId(rendered, "select") as HTMLSelectElement;
    expect(selectMenu.childNodes.length).toBe(4);
    // Now change a filter
    fireEvent.change(selectMenu, { target: { value: "Row 2 B" } });
    await waitFor(() => {
      expect(getByTestId(rendered, "id1")).not.toBeVisible();
      expect(getByTestId(rendered, "id2")).toBeVisible();
      expect(getByTestId(rendered, "id3")).not.toBeVisible();
    });
    // Now reset
    fireEvent.change(selectMenu, { target: { value: undefined } });
    await waitFor(() => {
      expect(getByTestId(rendered, "id1")).toBeVisible();
      expect(getByTestId(rendered, "id2")).toBeVisible();
      expect(getByTestId(rendered, "id3")).toBeVisible();
    });
  });
});
