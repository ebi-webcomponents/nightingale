import translatePositions from "../position-mapping";
import testData from "./__mocks__/mapping-test-cases";

describe("translatePositions", () => {
  testData.forEach(({ entry, uniprot, pdb, mappings, error = false }) => {
    if (error) {
      it(`should throw ${error}`, () => {
        expect(() => {
          translatePositions(uniprot.start, uniprot.end, mappings);
        }).toThrow(error);
      });
    } else {
      it(`should convert UniProt to PDB for ${entry}`, () => {
        const translated = translatePositions(
          uniprot.start,
          uniprot.end,
          mappings,
          "UP_PDB"
        );
        expect(translated.start).toEqual(pdb.start);
        expect(translated.end).toEqual(pdb.end);
      });
      it(`should convert PDB to UniProt for ${entry}`, () => {
        const translated = translatePositions(
          pdb.start,
          pdb.end,
          mappings,
          "PDB_UP"
        );
        expect(translated.start).toEqual(uniprot.start);
        expect(translated.end).toEqual(uniprot.end);
      });
    }
  });
});
