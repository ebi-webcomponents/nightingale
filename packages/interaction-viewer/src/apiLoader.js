/* eslint-disable */
import clone from "lodash-es/clone";
import { addStringItem } from "./treeMenu";

export function load(accession) {
  return fetch(
    `https://www.ebi.ac.uk/proteins/api/proteins/interaction/${accession}.json`
  );
}

export function process(data) {
  const subcellulartreeMenu = [];
  const diseases = {};
  // The 2 blocks below are necesserary as there is an issue with the data: it's not symmetrical
  data = data.map(d => {
    if (!d.interactions) d.interactions = [];
    return d;
  });

  // Add symmetry if required
  for (const element of data) {
    for (const interactor of element.interactions) {
      const otherInteractor = data.find(d => d.accession === interactor.id);
      if (otherInteractor) {
        if (
          !otherInteractor.interactions.find(d => d.id === element.accession)
        ) {
          const interactorToAdd = clone(interactor);
          interactorToAdd.id = element.accession;
          otherInteractor.interactions.push(interactorToAdd);
        }
      }
    }
  }

  // remove interactions which are not part of current set
  for (const element of data) {
    element.filterTerms = [];
    const interactors = [];
    // Add source  to the nodes
    for (const interactor of element.interactions) {
      // Add interaction for SELF
      if (interactor.interactionType === "SELF") {
        interactor.source = element.accession;
        interactor.id = element.accession;
        addInteractor(interactor, interactors);
      } else if (
        data.some(function(d) {
          // Check that interactor is in the data
          return d.accession === interactor.id;
        })
      ) {
        interactor.source = element.accession;
        addInteractor(interactor, interactors);
      }
    }

    element.interactions = interactors;

    if (element.subcellularLocations) {
      for (const location of element.subcellularLocations) {
        if (!location.locations) {
          continue;
        }
        for (const actualLocation of location.locations) {
          addStringItem(actualLocation.location.value, subcellulartreeMenu);
          const locationSplit = actualLocation.location.value.split(", ");
          element.filterTerms = element.filterTerms.concat(locationSplit);
        }
      }
    }
    if (element.diseases) {
      for (const disease of element.diseases) {
        if (disease.diseaseId) {
          diseases[disease.diseaseId] = {
            name: disease.diseaseId,
            selected: false
          };
          element.filterTerms.push(disease.diseaseId);
        }
      }
    }
  }
  return { data, subcellulartreeMenu, diseases: values(diseases) };
}

function addInteractor(interactor, interactors) {
  const existingInteractor = interactors.find(i => interactor.id === i.id);
  if (existingInteractor) {
    // Merge objects
    if (interactor.isoform) {
      existingInteractor.isoform = interactor.isoform;
    }
  } else {
    interactors.push(interactor);
  }
}

function values(obj) {
  const ret = [];
  for (const [k, v] of Object.entries(obj)) {
    ret.push(v);
  }
  return ret;
}
