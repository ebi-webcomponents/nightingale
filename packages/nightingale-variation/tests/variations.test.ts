import { transformData } from "../src";

import P99999 from "./mocks/P99999";

describe("variation viewer tests", () => {
  it("should transform Proteins API data correctly", () => {
    const transformed = transformData(P99999);
    expect(transformed).toMatchSnapshot();
  });
});
