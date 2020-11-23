import { transformData } from "../src/vcf-adapter";
import vcfDataMock from "./__mock__/variant_example.json";
import converted from "./__mock__/converted.json";

describe("vcf-adapter", () => {
  it("converts the model", () => {
    expect(transformData(vcfDataMock)).toEqual(converted);
  });
});
