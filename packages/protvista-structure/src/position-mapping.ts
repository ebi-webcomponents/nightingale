import groupBy from "lodash-es/groupBy";

export type Direction = "UP_PDB" | "PDB_UP";

/* eslint-disable camelcase */
export type Mappings = Array<{
  entity_id: number;
  chain_id: string;
  unp_end: number; // UniProt end coordinate
  unp_start: number; // UniProt start coordinate
  struct_asym_id: string;
  start: {
    residue_number: number; // PDB start coordinate
    author_insertion_code: string;
    author_residue_number: number;
  };
  end: {
    residue_number: number; // PDB end coordinate
    author_insertion_code: string;
    author_residue_number: number;
  };
}>;
/* eslint-enable camelcase */

export class PositionMappingError extends Error {}

/**
 * Translate between UniProt and PDBe positions using SIFTs mappings
 * @function translatePositions
 * @param  {Number}     start            The start index for the sequence (1-based)
 * @param  {Number}     end              The end index for the sequence (1-based)
 * @param  {Mappings}   mappings         The array of mapping objects
 * @param  {String}     mappingDirection Indicates direction of maping: UniProt to PDB or PDB to UniProt
 * @return {Translated}                  Object with: mapped entity ID; mapped chain ID; translated start & end positions
 */
const translatePositions = (
  start: number,
  end: number,
  mappings: Mappings,
  mappingDirection: Direction
): {
  start: number;
  end: number;
  entity: number;
  chain: string;
}[] => {
  // Return if mappings not ready
  if (!mappings) {
    return [];
  }
  // return if they have been set to 'undefined'
  if (!start || !end || Number.isNaN(start) || Number.isNaN(end)) {
    throw new PositionMappingError("Invalid start, end coordinates");
  }
  // return a translation separately for each chain (if it exists)
  return Object.entries(groupBy(mappings, (mapping) => mapping.chain_id))
    .map(([chain_id, chainMappings]) => {
      let startMapping = null;
      let endMapping = null;
      for (const mapping of chainMappings) {
        if (
          mapping.unp_end - mapping.unp_start !==
          mapping.end.residue_number - mapping.start.residue_number
        ) {
          throw new PositionMappingError(
            "Mismatch between protein sequence and structure residues"
          );
        }
        const regionStart =
          mappingDirection === "UP_PDB"
            ? mapping.unp_start
            : mapping.start.residue_number;
        const regionEnd =
          mappingDirection === "UP_PDB"
            ? mapping.unp_end
            : mapping.end.residue_number;
        if (start >= regionStart && start <= regionEnd) {
          startMapping = mapping;
        }
        if (end >= regionStart && end <= regionEnd) {
          endMapping = mapping;
        }
      }
      if (startMapping === null || endMapping === null) {
        throw new PositionMappingError(
          "Start or end coordinate outside of mapping range"
        );
      }
      const direction = mappingDirection === "UP_PDB" ? 1 : -1;
      return {
        entity: startMapping.entity_id,
        chain: startMapping.chain_id,
        start:
          start +
          direction *
            (startMapping.start.residue_number - startMapping.unp_start),
        end:
          end +
          direction * (endMapping.start.residue_number - endMapping.unp_start),
      };
    })
    .filter(Boolean);
};

export default translatePositions;
