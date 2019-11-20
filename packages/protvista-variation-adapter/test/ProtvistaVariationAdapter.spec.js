import { transformData } from "../src/ProtvistaVariationAdapter";
import variants from "./variants.json";

describe("ProtvistaVariationAdapter", () => {
  it("should transform the data adequately", () => {
    const transformedVariants = transformData(variants);
    expect(transformedVariants).toMatchSnapshot();
  });
});
