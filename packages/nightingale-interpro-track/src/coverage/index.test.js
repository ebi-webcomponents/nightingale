/* eslint-disable */
import { addContributor } from ".";

const firstFeature = { start: 10, end: 20 };
const featureBefore = { start: 3, end: 8 };
const overlapsBefore = { start: 5, end: 15 };
const containedFeature = { start: 12, end: 15 };

describe("coverage", () => {
  test("adding a single contributor to an empty covergae", () => {
    let coverage = [];
    coverage = addContributor(firstFeature, coverage);
    expect(coverage).toEqual([{ ...firstFeature, value: 1 }]);
  });
  test("adding 2 not overlapping features. In order", () => {
    let coverage = [];
    coverage = addContributor(featureBefore, coverage);
    coverage = addContributor(firstFeature, coverage);
    expect(coverage).toEqual([
      { ...featureBefore, value: 1 },
      { ...firstFeature, value: 1 },
    ]);
  });
  test("adding 2 not overlapping features. In  reverse order", () => {
    let coverage = [];
    coverage = addContributor(firstFeature, coverage);
    coverage = addContributor(featureBefore, coverage);
    expect(coverage).toEqual([
      { ...featureBefore, value: 1 },
      { ...firstFeature, value: 1 },
    ]);
  });
  test("adding 2 overlapping features. In order", () => {
    let coverage = [];
    coverage = addContributor(overlapsBefore, coverage);
    coverage = addContributor(firstFeature, coverage);
    expect(coverage).toEqual([
      { start: overlapsBefore.start, end: firstFeature.start - 1, value: 1 },
      { start: firstFeature.start, end: overlapsBefore.end, value: 2 },
      { start: overlapsBefore.end + 1, end: firstFeature.end, value: 1 },
    ]);
  });
  test("adding 2 overlapping features. In reverse order", () => {
    let coverage = [];
    coverage = addContributor(firstFeature, coverage);
    coverage = addContributor(overlapsBefore, coverage);
    expect(coverage).toEqual([
      { start: overlapsBefore.start, end: firstFeature.start - 1, value: 1 },
      { start: firstFeature.start, end: overlapsBefore.end, value: 2 },
      { start: overlapsBefore.end + 1, end: firstFeature.end, value: 1 },
    ]);
  });
  test("adding 2 features. One contains the other. small first", () => {
    let coverage = [];
    coverage = addContributor(containedFeature, coverage);
    coverage = addContributor(firstFeature, coverage);
    expect(coverage).toEqual([
      { start: firstFeature.start, end: containedFeature.start - 1, value: 1 },
      { start: containedFeature.start, end: containedFeature.end, value: 2 },
      { start: containedFeature.end + 1, end: firstFeature.end, value: 1 },
    ]);
  });
  test("adding 2 features. One contains the other. big first", () => {
    let coverage = [];
    coverage = addContributor(firstFeature, coverage);
    coverage = addContributor(containedFeature, coverage);
    expect(coverage).toEqual([
      { start: firstFeature.start, end: containedFeature.start - 1, value: 1 },
      { start: containedFeature.start, end: containedFeature.end, value: 2 },
      { start: containedFeature.end + 1, end: firstFeature.end, value: 1 },
    ]);
  });
  test("adding the same Feature multiple times.", () => {
    let coverage = [];
    for (let i = 1; i <= 10; i++) {
      coverage = addContributor(firstFeature, coverage);
      expect(coverage).toEqual([
        { start: firstFeature.start, end: firstFeature.end, value: i },
      ]);
    }
  });
  test("adding the 4 features. ", () => {
    let coverage = [];
    const expected = [
      { start: 3, end: 4, value: 1 },
      { start: 5, end: 8, value: 2 },
      { start: 9, end: 9, value: 1 },
      { start: 10, end: 11, value: 2 },
      { start: 12, end: 15, value: 3 },
      { start: 16, end: 20, value: 1 },
    ];
    const combinations = makePermutationiterator([
      firstFeature,
      featureBefore,
      containedFeature,
      overlapsBefore,
    ]);

    for (const oredererFeatures of combinations) {
      coverage = [];
      coverage = addContributor(oredererFeatures[0], coverage);
      coverage = addContributor(oredererFeatures[1], coverage);
      coverage = addContributor(oredererFeatures[2], coverage);
      coverage = addContributor(oredererFeatures[3], coverage);
      expect(coverage).toEqual(expected);
    }
  });
});

function* makePermutationiterator(list = []) {
  for (let i = 0; i < list.length; i++) {
    const val = list[i];
    const newList = list.slice(0, i).concat(list.slice(i + 1));
    if (newList.length > 1) {
      const it = makePermutationiterator(newList);
      let permuted = it.next();
      while (!permuted.done) {
        yield [val, ...permuted.value];
        permuted = it.next();
      }
    } else {
      yield [val, ...newList];
    }
  }
}
