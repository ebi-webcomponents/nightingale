/* eslint-disable no-param-reassign */
// import clone from "lodash-es/clone";
import { APIInteractionData } from "./data";
import { addStringItem, FilterNode } from "./treeMenu";

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

export function process(data: APIInteractionData[]): {
  data: APIInteractionData[];
  subcellulartreeMenu: FilterNode[];
  diseases: FilterNode[];
} {
  const subcellulartreeMenu: FilterNode[] = [];
  const diseases = {};

  // The 2 blocks below are necesserary as there is an issue with the data: it's not symmetrical
  data = data.map((d) => {
    if (!d.interactions) d.interactions = [];
    return d;
  });

  // Add symmetry if required
  // data.forEach((entry) => {
  //   entry.interactions.forEach((interactor) => {
  //     const otherInteractor = data.find(
  //       (entry2) => entry2.accession === interactor.accession2
  //     );
  //     if (otherInteractor) {
  //       if (
  //         !otherInteractor.interactions.find(
  //           (d) =>
  //             d.interactor1 === entry.accession ||
  //             d.interactor2 === entry.accession
  //         )
  //       ) {
  //         const interactorToAdd = clone(interactor);
  //         interactorToAdd.id = entry.accession;
  //         otherInteractor.interactions.push(interactorToAdd);
  //       }
  //     }
  //   });
  // });

  // remove interactions which are not part of current set
  data.forEach((element) => {
    element.filterTerms = [];
    const interactors = [];
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

    element.interactions = interactors;

    if (element.subcellularLocations) {
      element.subcellularLocations
        .filter((d) => d.locations)
        .forEach((location) => {
          for (const actualLocation of location.locations) {
            addStringItem(actualLocation.location.value, subcellulartreeMenu);
            const locationSplit = actualLocation.location.value.split(", ");
            element.filterTerms = element.filterTerms.concat(locationSplit);
          }
        });
    }
    if (element.diseases) {
      for (const disease of element.diseases) {
        if (disease.diseaseId) {
          diseases[disease.diseaseId] = {
            name: disease.diseaseId,
            selected: false,
          };
          element.filterTerms.push(disease.diseaseId);
        }
      }
    }
  });
  return { data, subcellulartreeMenu, diseases: Object.values(diseases) };
}

export function load(accession: string): Promise<APIInteractionData[]> {
  const url = `https://www.ebi.ac.uk/proteins/api/proteins/interaction/${accession}.json`;
  return fetch(url)
    .then((response) => {
      if (response.status === 404) return null;
      if (!response.ok) {
        console.error(
          new Error(
            `Request Failed: Status = ${
              response.status
            }; URI = ${url}; Time = ${new Date()}`
          )
        );
        return null;
      }
      if (response.status === 204) return null;
      return response.json();
    })
    .then((json) => json);
}
