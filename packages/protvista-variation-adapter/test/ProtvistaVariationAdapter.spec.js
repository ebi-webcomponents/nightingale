import { transformData } from "../src/protvista-variation-adapter";
import variants from "./variants.json";

describe("ProtvistaVariationAdapter", () => {
  it("should transform the data adequately", () => {
    const data = transformData(variants);
    expect(data).toMatchSnapshot();
  });
});
