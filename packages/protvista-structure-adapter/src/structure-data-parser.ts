import { ProtvistaTrackDatum } from "protvista-track";
import { UniProtkbEntry } from "./uniprotkbentry";

const capitalizeFirstLetter = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);

const getDescription = (properties: Record<string, string>) => {
  return Object.keys(properties).reduce(
    (accumulator, propertyKey) =>
      `${accumulator}${capitalizeFirstLetter(propertyKey)}: ${
        properties[propertyKey]
      }. `,
    ""
  );
};

const parseChainString = (value: string) => {
  const posEqual = value.indexOf("=");
  const posDash = value.indexOf("-");
  if (posEqual === -1 || posDash === -1) {
    return { start: 0, end: 0 };
  }
  return {
    start: +value.slice(posEqual + 1, posDash),
    end: +value.slice(posDash + 1),
  };
};

// Iterate over references and extract chain start and end
export const getAllFeatureStructures = (
  data: UniProtkbEntry
): ProtvistaTrackDatum[] =>
  data.dbReferences
    .filter((reference) => {
      return reference.type === "PDB";
    })
    .map((structureReference) => {
      const parsedChain = structureReference.properties.chains
        ? parseChainString(structureReference.properties.chains)
        : { start: 0, end: 0 };
      return {
        accession: data.accession,
        start: parsedChain.start,
        end: parsedChain.end,
        type: "PDBE_COVER",
        category: "STRUCTURE_COVERAGE",
        data: {
          Structures: [
            {
              description: getDescription(structureReference.properties),
              start: parsedChain.start,
              end: parsedChain.end,
              source: {
                id: structureReference.id,
                url: `http://www.ebi.ac.uk/pdbe-srv/view/entry/${structureReference.id}`,
              },
            },
          ],
        },
      };
    });

export const mergeOverlappingIntervals = (
  structures: ProtvistaTrackDatum[]
): ProtvistaTrackDatum[] => {
  if (!structures || structures.length <= 0) {
    return [];
  }
  // Sort by start position
  const sortedStructures = structures.sort((a, b) => a.start - b.start);
  const mergedIntervals: ProtvistaTrackDatum[] = [];
  sortedStructures.forEach((structure) => {
    const lastItem = mergedIntervals[mergedIntervals.length - 1];
    if (
      !lastItem ||
      // If item doesn't overlap, push it
      lastItem.end < structure.start
    ) {
      mergedIntervals.push(structure);
    }
    // If the end is bigger update the last one
    else if (lastItem.end < structure.end) {
      lastItem.end = structure.end;
      lastItem.data.Structures.push(structure.data.Structures[0]);
    }
    // Otherwise just add to last item
    else {
      lastItem.data.Structures.push(structure.data.Structures[0]);
    }
  });
  return mergedIntervals;
};
