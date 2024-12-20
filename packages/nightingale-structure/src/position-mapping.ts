export type Direction = "UP_PDB" | "PDB_UP";

/* eslint-disable camelcase */
export type Mapping = {
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
};
/* eslint-enable camelcase */

export class PositionMappingError extends Error {}

export type TranslatedPosition = {
  start: number;
  end: number;
  entity: number;
  chain: string;
};

/**
 * Translate between UniProt and PDBe positions using SIFTs mappings
 * @function translatePositions
 * @param  {number}     start            The start index for the sequence (1-based)
 * @param  {number}     end              The end index for the sequence (1-based)
 * @param  {Direction}  mappingDirection Indicates direction of mapping: UniProt to PDB or PDB to UniProt
 * @param  {Mapping[]}  mappings         The array of mapping objects
 * @return {TranslatedPosition[]}        Array of translated positions
 */
const translatePositions = (
  start: number,
  end: number,
  mappingDirection: Direction,
  mappings?: Mapping[]
): TranslatedPosition[] => {
  // Return if mappings not ready
  if (!mappings) {
    return [];
  }

  // Validate start and end inputs
  if (!start || !end || Number.isNaN(start) || Number.isNaN(end)) {
    throw new PositionMappingError("Invalid start, end coordinates");
  }

  const chainMappingsMap = new Map<string, Mapping[]>();

  // Group mappings by chain_id
  for (const mapping of mappings) {
    const chainMapping = chainMappingsMap.get(mapping.chain_id) || [];
    chainMapping.push(mapping);
    chainMappingsMap.set(mapping.chain_id, chainMapping);
  }

  const translations: TranslatedPosition[] = [];

  for (const chainMappings of chainMappingsMap.values()) {
    let startMapping: Mapping | null = null;
    let endMapping: Mapping | null = null;

    for (const mapping of chainMappings) {
      if (
        mapping.unp_end - mapping.unp_start !==
        mapping.end.residue_number - mapping.start.residue_number
      ) {
        throw new PositionMappingError(
          "Mismatch between protein sequence and structure residues"
        );
      }

      const [regionStart, regionEnd] =
        mappingDirection === "UP_PDB"
          ? [mapping.unp_start, mapping.unp_end]
          : [mapping.start.residue_number, mapping.end.residue_number];

      // Set startMapping if the start coordinate is within the region
      if (!startMapping && start >= regionStart && start <= regionEnd) {
        startMapping = mapping;
      }
      // Set endMapping if the end coordinate is within the region
      if (!endMapping && end >= regionStart && end <= regionEnd) {
        endMapping = mapping;
      }

      // Early exit if both start and end mappings are found
      if (startMapping && endMapping) {
        break;
      }
    }

    if (startMapping && endMapping) {
      const direction = mappingDirection === "UP_PDB" ? 1 : -1;
      translations.push({
        entity: startMapping.entity_id,
        // Note that we iterate through mappings from one chain at a time,
        // so all mappings are guaranteed to come from the same chain
        chain: startMapping.chain_id,
        start:
          start +
          direction *
            (startMapping.start.residue_number - startMapping.unp_start),
        end:
          end +
          direction * (endMapping.start.residue_number - endMapping.unp_start),
      });
    }
  }

  if (!translations.length) {
    throw new PositionMappingError(
      "Start or end coordinate outside of mapping range"
    );
  }

  return translations;
};

export default translatePositions;
