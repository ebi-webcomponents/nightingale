import ParserHelper from "./ParserHelper";

const featureType = "PDBE_COVER";
const featureCategory = "STRUCTURE_COVERAGE";

export default class StructureDataParser {
  constructor() {
    this._pdbFeatures = [];
  }

  parseEntry(data) {
    this._parseValidEntry(data);
    return this._pdbFeatures;
  }

  get pdbFeatures() {
    return this._pdbFeatures;
  }

  // Iterate over references and extract chain start and end
  static _getAllFeatureStructures(data) {
    return data.dbReferences
      .filter(reference => {
        return reference.type === "PDB";
      })
      .map(structureReference => {
        const parsedChain = structureReference.properties.chains
          ? ParserHelper.parseChainString(structureReference.properties.chains)
          : { start: 0, end: 0 };
        return {
          type: featureType,
          category: featureCategory,
          structures: [
            {
              description: ParserHelper.getDescription(
                structureReference.properties
              ),
              start: parsedChain.start,
              end: parsedChain.end,
              source: {
                id: structureReference.id,
                url: `http://www.ebi.ac.uk/pdbe-srv/view/entry/${structureReference.id}`
              }
            }
          ],
          start: parsedChain.start,
          end: parsedChain.end
        };
      });
  }

  static mergeOverlappingIntervals(structures) {
    if (!structures || structures.length <= 0) {
      return [];
    }
    // Sort by start position
    const sortedStructures = structures.sort((a, b) => a.start - b.start);
    const mergedIntervals = [];
    sortedStructures.forEach(structure => {
      const lastItem = mergedIntervals[mergedIntervals.length - 1];
      // If item doesn't overlap, push it
      if (
        !lastItem ||
        (lastItem.start < structure.start && lastItem.end < structure.end)
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
  }

  _parseValidEntry(data) {
    const allFeatureStructures = StructureDataParser._getAllFeatureStructures(
      data
    );
    this._pdbFeatures = StructureDataParser.mergeOverlappingIntervals(
      allFeatureStructures
    );
  }

  static _getStructuresHTML(structureList) {
    return `<ul>
            ${structureList
              .map(
                structure => `<li style="margin: 0.25rem 0"><a style="color:#FFF" href='${structure.source.url}' target='_blank'>
            ${structure.source.id}
        </a> (${structure.start}-${structure.end})</li>`
              )
              .join("")}
        </ul>`;
  }

  static formatTooltip(feature) {
    const structuresHTML = StructureDataParser._getStructuresHTML(
      feature.structures
    );
    return `${structuresHTML ? `<h5>Structures</h5>${structuresHTML}` : ``}`;
  }
}
