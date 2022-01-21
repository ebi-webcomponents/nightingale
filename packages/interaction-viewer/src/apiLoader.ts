import { APIInteractionData, Interaction } from "./data";

// function addInteractor(interactor, interactors) {
//   const existingInteractor = interactors.find((i) => interactor.id === i.id);
//   if (existingInteractor) {
//     // Merge objects
//     if (interactor.isoform) {
//       existingInteractor.isoform = interactor.isoform;
//     }
//   } else {
//     interactors.push(interactor);
//   }
// }

// export const createGraph = (data: APIInteractionData) => {
//   const nodes = data.map((node) => ({
//     accession: node.accession,
//     name: node.name,
//     proteinExistence: node.proteinExistence,
//     taxonomy: node.taxonomy,
//   }));

//   const edges = data.reduce((accumulator, node) => {
//     const interactions = node.interactions ? node.interactions : [];
//     return [
//       ...accumulator,
//       ...interactions.map((interaction) => ({
//         ...interaction,
//         accession1: interaction.accession1
//           ? interaction.accession1
//           : node.accession,
//       })),
//     ];
//   }, []);
//   return { nodes, edges };
// };

const process = (
  data: APIInteractionData[]
): {
  adjacencyMap: { accession: string; interactors: string[] }[];
  interactionsMap: Map<string, Interaction>;
  // subcellulartreeMenu: FilterNode[];
  // diseases: FilterNode[];
} => {
  // const subcellulartreeMenu: FilterNode[] = [];
  // const diseases = {};

  const interactionsMap = new Map<string, Interaction>();
  const adjacencyMap: { accession: string; interactors: string[] }[] = [];

  data.forEach((entry) => {
    console.log(entry.accession);
    entry.interactions.forEach((interaction) => {
      const id = `${interaction.accession1}${interaction.accession2}`;
      interactionsMap.set(id, interaction);

      const foundEntry = adjacencyMap.find(
        ({ accession }) => accession === entry.accession
      );
      if (foundEntry) {
        // TODO check unique here. Not using set as it makes things tricky with d3
        foundEntry.interactors.push(
          interaction.accession1 === entry.accession
            ? interaction.accession2
            : interaction.accession1
        );
      } else {
        adjacencyMap.push({
          accession: entry.accession,
          interactors: [
            interaction.accession1 === entry.accession
              ? interaction.accession2
              : interaction.accession1,
          ],
        });
      }
    });
    // Parse supporting data for filters
    // if (entry.subcellularLocations) {
    //   entry.subcellularLocations
    //     .filter((d) => d.locations)
    //     .forEach((location) => {
    //       for (const actualLocation of location.locations) {
    //         addStringItem(actualLocation.location.value, subcellulartreeMenu);
    //         const locationSplit = actualLocation.location.value.split(", ");
    //         entry.filterTerms = entry.filterTerms.concat(locationSplit);
    //       }
    //     });
    // }
    // if (entry.diseases) {
    //   for (const disease of entry.diseases) {
    //     if (disease.diseaseId) {
    //       diseases[disease.diseaseId] = {
    //         name: disease.diseaseId,
    //         selected: false,
    //       };
    //       entry.filterTerms.push(disease.diseaseId);
    //     }
    //   }
    // }
  });

  return { adjacencyMap, interactionsMap };

  // remove interactions which are not part of current set
  // data.forEach((element) => {
  //   element.filterTerms = [];
  //   const interactors = [];
  // // Add source  to the nodes
  // for (const interactor of element.interactions) {
  //   // Add interaction for SELF
  //   if (interactor.interactionType === "SELF") {
  //     interactor.source = element.accession;
  //     interactor.id = element.accession;
  //     addInteractor(interactor, interactors);
  //   } else if (
  //     data.some((d) => {
  //       // Check that interactor is in the data
  //       return d.accession === interactor.id;
  //     })
  //   ) {
  //     interactor.source = element.accession;
  //     addInteractor(interactor, interactors);
  //   }
  // }

  // element.interactions = interactors;
  // });
  // return { data, subcellulartreeMenu, diseases: Object.values(diseases) };
};

export default process;
