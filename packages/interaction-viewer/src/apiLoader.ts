import {
  APIInteractionData,
  Disease,
  Interaction,
  SubcellularLocation,
} from "./data";
import { FilterDefinition } from "./interaction-filters";

export type EntryData = {
  name: string;
  proteinExistence: string;
  taxonomy: number;
  diseases?: Disease[];
  subcellularLocations?: SubcellularLocation[];
  filterTerms?: Record<string, string[]>;
};

export type AdjacencyMap = { accession: string; interactors: string[] }[];

export type ProcessedData = {
  adjacencyMap: AdjacencyMap;
  interactionsMap: Map<string, Interaction>;
  entryStore: Map<string, EntryData>;
  filterConfig: FilterDefinition[];
};

const process = (data: APIInteractionData[]): ProcessedData => {
  const subcellulartreeMenu: Record<string, string[]> = {};
  const diseases: Record<string, string[]> = {};

  const interactionsMap = new Map<string, Interaction>();
  const entryStore = new Map<string, EntryData>();
  const adjacencyMap: { accession: string; interactors: string[] }[] = data.map(
    (entry) => ({ accession: entry.accession, interactors: [] })
  );
  const accessionList = adjacencyMap.map(({ accession }) => accession);

  data.forEach((entry) => {
    entryStore.set(entry.accession, {
      name: entry.name,
      proteinExistence: entry.proteinExistence,
      taxonomy: entry.taxonomy,
      diseases: entry.diseases,
      subcellularLocations: entry.subcellularLocations,
    });

    entry.interactions.forEach((interaction) => {
      // Filter out rogue isoforms...
      if (
        !interaction.accession1.startsWith(`${entry.accession}-`) ||
        !interaction.accession2.startsWith(`${entry.accession}-`)
      ) {
        const id = `${interaction.accession1}${interaction.accession2}`;
        interactionsMap.set(id, interaction);
        const foundEntry = adjacencyMap.find(
          ({ accession }) => accession === entry.accession
        );
        if (
          accessionList.includes(interaction.accession1) &&
          accessionList.includes(interaction.accession2)
        ) {
          foundEntry.interactors.push(
            interaction.accession1 === entry.accession
              ? interaction.accession2
              : interaction.accession1
          );
        }
      }
    });
    // Parse supporting data for filters
    if (entry.subcellularLocations) {
      entry.subcellularLocations
        .filter((d) => d.locations)
        .forEach((location) => {
          for (const actualLocation of location.locations) {
            subcellulartreeMenu[actualLocation.location.value] =
              subcellulartreeMenu[actualLocation.location.value]
                ? [
                    ...subcellulartreeMenu[actualLocation.location.value],
                    entry.accession,
                  ]
                : [entry.accession];
          }
        });
    }
    if (entry.diseases) {
      for (const disease of entry.diseases) {
        if (disease.diseaseId) {
          diseases[disease.diseaseId] = diseases[disease.diseaseId]
            ? [...diseases[disease.diseaseId], entry.accession]
            : [entry.accession];
        }
      }
    }
  });

  const filterConfig = [
    {
      name: "subcellularLocations",
      label: "Subcellular location",
      type: "tree",
      items: subcellulartreeMenu,
    },
    {
      name: "diseases",
      label: "Diseases",
      items: diseases,
    },
  ];
  return { adjacencyMap, interactionsMap, entryStore, filterConfig };
};

export default process;
