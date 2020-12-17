import { process } from "../src/apiLoader";
import jsonData from "./mockData/O60941.json";
import diseasesJson from "./mockData/diseases.json";
import dataJson from "./mockData/data.json";

describe("interaction-viewer apiLoader", () => {
  it("should process the data", () => {
    const { data, diseases } = process(jsonData);
    // subcellulartreeMenu: TypeError: Converting circular structure to JSON
    // console.log(JSON.stringify(data));
    expect(diseases).toEqual(diseasesJson);
    expect(data).toEqual(dataJson);
  });
});
