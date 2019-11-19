import ParserHelper from "../src/ParserHelper";

const properties = {
  method: "X-ray",
  chains: "B=287-344",
  resolution: "1.80 A"
};

describe("ParserHelper", () => {
  it("should capitalize first letter", () => {
    expect(ParserHelper.capitalizeFirstLetter("method")).toEqual("Method");
  });

  it("should get a description from properties", () => {
    const description =
      "Method: X-ray. Chains: B=287-344. Resolution: 1.80 A. ";
    expect(ParserHelper.getDescription(properties)).toEqual(description);
  });

  it("should get a begin-end from a value", () => {
    const expectedBeginEnd = { start: 287, end: 344 };
    const beginEnd = ParserHelper.parseChainString(properties.chains);
    expect(beginEnd.begin).toEqual(expectedBeginEnd.begin);
    expect(beginEnd.end).toEqual(expectedBeginEnd.end);
  });

  it("should get a default begin-end from a value", () => {
    const expectedBeginEnd = { start: 0, end: 0 };
    const beginEnd = ParserHelper.parseChainString("");
    expect(beginEnd.begin).toEqual(expectedBeginEnd.begin);
    expect(beginEnd.end).toEqual(expectedBeginEnd.end);
  });
});
