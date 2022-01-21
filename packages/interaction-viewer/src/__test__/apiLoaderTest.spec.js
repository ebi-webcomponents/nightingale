import process from "../apiLoader";
import data from "./resources/data";
import diseasesJson from "./resources/diseases.json";

describe("interaction-viewer apiLoader", () => {
  it("should process the data", () => {
    const { adjacencyMap, interactionsMap } = process(data);
    expect(adjacencyMap).toMatchSnapshot();
    expect(interactionsMap).toMatchSnapshot();
  });
});
