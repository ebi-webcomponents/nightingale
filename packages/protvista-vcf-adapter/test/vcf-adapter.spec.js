import transformData, { JSONToHTML } from "../src/dataTransformer";
import vcfOutput from "./__mock__/vcfConverterOutput.json";

describe("vcf-adapter", () => {
  it("parses the object correctly to generate html", () => {
    const object = {
      attribute1: "attribute1",
      array1: [
        {
          item1: "item1",
          item2: "item2",
          item3: [{ itemA: "itemA", itemB: "itemB" }],
        },
      ],
      array2: ["item 1", "item 2"],
    };
    const html = JSONToHTML(object);
    expect(html).toMatchSnapshot();
  });

  it("converts the model", () => {
    expect(transformData(vcfOutput, "P01008")).toMatchSnapshot();
  });
});
