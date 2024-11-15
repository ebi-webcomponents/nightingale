import NonOverlappingLayout from "../src/NonOverlappingLayout";

const features = [
  {
    start: 1,
    end: 15,
  },
  {
    start: 6,
    end: 15,
  },
  {
    start: 17,
    end: 78,
  },
  {
    start: 4,
    end: 17,
  },
  {
    start: 1,
    end: 3,
  },
];

let layout;

describe("Layout bumping", () => {
  beforeEach(() => {
    layout = new NonOverlappingLayout({
      layoutHeight: 18,
    });
    layout.init(features);
  });

  test("should be on first row", () => {
    expect(layout.getFeatureYPos(features[0])).toEqual(2);
  });

  test("should be on second row", () => {
    expect(layout.getFeatureYPos(features[1])).toBeCloseTo(7.3333, 3);
  });

  test("should be back on first row", () => {
    expect(layout.getFeatureYPos(features[2])).toEqual(2);
  });

  test("should be back on third row", () => {
    expect(layout.getFeatureYPos(features[3])).toBeCloseTo(12.6666, 3);
  });

  test("should be on second row again", () => {
    expect(layout.getFeatureYPos(features[4])).toBeCloseTo(7.3333, 3);
  });
});
