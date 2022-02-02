import {
  APIInteractionData,
  Disease,
  Interaction,
  SubcellularLocation,
} from "./data";

export type EntryData = {
  name: string;
  proteinExistence: string;
  taxonomy: number;
  diseases?: Disease[];
  subcellularLocations?: SubcellularLocation[];
  filterTerms?: string[];
};

const process = (
  data: APIInteractionData[]
): {
  adjacencyMap: { accession: string; interactors: string[] }[];
  interactionsMap: Map<string, Interaction>;
  entryStore: Map<string, EntryData>;
  // subcellulartreeMenu: FilterNode[];
  // diseases: FilterNode[];
} => {
  // const subcellulartreeMenu: FilterNode[] = [];
  // const diseases = {};

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
      filterTerms: [],
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
            console.log(actualLocation.location.value);
            // addStringItem(actualLocation.location.value, subcellulartreeMenu);
            // const locationSplit = actualLocation.location.value.split(", ");
            // entry.filterTerms = entry.filterTerms.concat(locationSplit);
          }
        });
    }
    if (entry.diseases) {
      for (const disease of entry.diseases) {
        if (disease.diseaseId) {
          console.log(disease.diseaseId);
          //       diseases[disease.diseaseId] = {
          //         name: disease.diseaseId,
          //         selected: false,
          //       };
          //       entry.filterTerms.push(disease.diseaseId);
        }
      }
    }
  });

  return { adjacencyMap, interactionsMap, entryStore };
};

export default process;
