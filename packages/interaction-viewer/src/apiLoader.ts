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

type AdjacencyMapItem = { accession: string; interactors: string[] };

export type AdjacencyMap = AdjacencyMapItem[];

export type ProcessedData = {
  adjacencyMap: AdjacencyMap;
  interactionsMap: Map<string, Interaction>;
  entryStore: Map<string, EntryData>;
  filterConfig: FilterDefinition[];
};

const compareAdjacencyEntries = (
  item1: AdjacencyMapItem,
  item2: AdjacencyMapItem
) => {
  if (item1.accession > item2.accession) {
    return -1;
  }
  if (item1.accession < item2.accession) {
    return 1;
  }
  return 0;
};

const process = (
  data: APIInteractionData[],
  primaryAccession: string
): ProcessedData => {
  const subcellulartreeMenu: Record<string, string[]> = {};
  const diseases: Record<string, string[]> = {};

  const interactionsMap = new Map<string, Interaction>();
  const entryStore = new Map<string, EntryData>();

  let mainEntry: AdjacencyMapItem;
  const isoforms: AdjacencyMap = [];
  const otherEntries: AdjacencyMap = [];

  data.forEach((entry) => {
    const returnEntry: AdjacencyMapItem = {
      accession: entry.accession,
      interactors: [],
    };
    if (entry.accession === primaryAccession) {
      mainEntry = returnEntry;
    } else if (entry.accession.startsWith(primaryAccession)) {
      isoforms.push(returnEntry);
    } else {
      otherEntries.push(returnEntry);
    }
  });

  const adjacencyMap = [
    mainEntry,
    ...isoforms.sort(compareAdjacencyEntries),
    ...otherEntries.sort(compareAdjacencyEntries),
  ];

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
      // Filter out any interactor not in the original list
      if (
        accessionList.includes(interaction.accession1) &&
        accessionList.includes(interaction.accession2)
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
  return {
    // Filter empty ones - these happen because they interact with isoforms which have been removed
    adjacencyMap: adjacencyMap.filter((item) => !!item.interactors.length),
    interactionsMap,
    entryStore,
    filterConfig,
  };
};

export default process;
