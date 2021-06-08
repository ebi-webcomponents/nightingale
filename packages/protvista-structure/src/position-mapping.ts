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
  mappingDirection: Direction = "UP_PDB"
): {
  start: number;
  end: number;
  entity: number;
  chain: string;
} | null => {
  // return if they have been set to 'undefined'
  if (!start || !end || Number.isNaN(start) || Number.isNaN(end)) {
    throw new PositionMappingError("Invalid start, end coordinates");
  }
  /* eslint-disable no-restricted-syntax */
  for (const mapping of mappings) {
    if (
      mapping.unp_end - mapping.unp_start !==
      mapping.end.residue_number - mapping.start.residue_number
    ) {
      throw new PositionMappingError(
        "Mismatch between protein sequence and structure residues"
      );
    }
    if (
      (mappingDirection === "UP_PDB" &&
        (start < mapping.unp_start || end > mapping.unp_end)) ||
      (mappingDirection === "PDB_UP" &&
        (start < mapping.start.residue_number ||
          end > mapping.end.residue_number))
    ) {
      throw new PositionMappingError(
        "Start or end coordinate outside of mapping range"
      );
    }
    // TODO: this is wrong because there are gaps in the PDB sequence though if
    // this is the case PositionMappingError would have already been thrown and
    // we should reach this point.
    const offset =
      mappingDirection === "UP_PDB"
        ? mapping.start.residue_number - mapping.unp_start
        : mapping.unp_start - mapping.start.residue_number;
    return {
      entity: mapping.entity_id,
      chain: mapping.chain_id,
      start: start + offset,
      end: end + offset,
    };
  }
  return null;
};

export default translatePositions;
