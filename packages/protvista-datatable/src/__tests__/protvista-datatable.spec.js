import ProtvistaDatatable from "../protvista-datatable";

let rendered;

describe("protvista-datatable", () => {
  beforeAll(() => {
    // TODO remove when the definition is part of the import
    window.customElements.define("protvista-datatable", ProtvistaDatatable);
  });
  beforeEach(() => {
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
</protvista-datatable>
`;
    rendered = document.querySelector("protvista-datatable");
  });

  afterEach(() => {
    document.querySelector("protvista-datatable").remove();
  });

  test("it should display the datatable correctly", async () => {
    expect(rendered).toMatchSnapshot();
  });
});
