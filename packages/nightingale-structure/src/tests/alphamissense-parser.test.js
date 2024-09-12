import { parseAMData } from '../AlphaMissenseColorTheme';

import mockData from "./__mocks__/am-data.js";

describe("parse alphamissense data", () => {
    test("get scores from raw text", () => {
        expect(typeof parseAMData).toEqual("function");
        const scores = parseAMData(mockData);
        expect(scores.length).toEqual(770); // Sequence length
        expect(scores[0].length).toEqual(19); // Scores for first residue
    });
});
