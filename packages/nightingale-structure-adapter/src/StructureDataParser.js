const featureType = "PDBE_COVER";
const featureCategory = "STRUCTURE_COVERAGE";

const capitalizeFirstLetter = (word) =>
  word.charAt(0).toUpperCase() + word.slice(1);

const getDescription = (properties) =>
  Object.keys(properties).reduce(
    (accumulator, propertyKey) =>
      `${accumulator}${capitalizeFirstLetter(propertyKey)}: ${
        properties[propertyKey]
      }. `,
    ""
  );

const parseChainString = (value) => {
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
export const getAllFeatureStructures = (data) =>
  data.dbReferences
    .filter((reference) => reference.type === "PDB")
    .map((structureReference) => {
      const parsedChain = structureReference.properties.chains
        ? parseChainString(structureReference.properties.chains)
        : { start: 0, end: 0 };
      return {
        type: featureType,
        category: featureCategory,
        structures: [
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
        start: parsedChain.start,
        end: parsedChain.end,
      };
    });

export const mergeOverlappingIntervals = (structures) => {
  if (!structures || structures.length <= 0) {
    return [];
  }
  // Sort by start position
  const sortedStructures = structures.sort((a, b) => a.start - b.start);
  const mergedIntervals = [];
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
      lastItem.structures.push(structure.structures[0]);
    }
    // Otherwise just add to last item
    else {
      lastItem.structures.push(structure.structures[0]);
    }
  });
  return mergedIntervals;
};

export const getStructuresHTML = (structureList) => `<ul>
            ${structureList
              .map(
                (
                  structure
                ) => `<li style="margin: 0.25rem 0"><a style="color:#FFF" href='${structure.source.url}' target='_blank'>
            ${structure.source.id}
        </a> (${structure.start}-${structure.end})</li>`
              )
              .join("")}
        </ul>`;

export const formatTooltip = (feature) => {
  const structuresHTML = getStructuresHTML(feature.structures);
  return `${structuresHTML ? `<h5>Structures</h5>${structuresHTML}` : ``}`;
};
