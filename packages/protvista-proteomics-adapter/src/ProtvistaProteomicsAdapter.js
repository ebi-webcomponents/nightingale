import ProtvistaFeatureAdapter, {
  renameProperties,
  formatTooltip,
} from "protvista-feature-adapter";
import { v1 } from "uuid";

const proteomicsTrackProperties = (feature) => {
  return {
    category: "PROTEOMICS",
    type: feature.unique ? "unique" : "non_unique",
    tooltipContent: formatTooltip(feature),
    protvistaFeatureId: v1(),
  };
};

export const transformData = (data) => {
  let adaptedData = [];

  if (data && data.length !== 0) {
    // To merge PTM data present in same residue in a same length peptide, have a map [key: start-end-phospho site 1-... phosphosite n, value: corresponding feature elements]
    const ptmMap = {};
    data.features.forEach((feature) => {
      let ft = `${feature.begin}-${feature.end}`;
      if (feature.ptms) {
        feature.ptms.forEach((ptm) => {
          ft += `-${ptm.position}`;
        });
        if (ptmMap[ft]) {
          ptmMap[ft] = [...ptmMap[ft], feature];
          ptmMap[ft].push(feature);
        } else {
          ptmMap[ft] = [feature];
        }
      }
    });

    if (Object.keys(ptmMap).length) {
      adaptedData = Object.values(ptmMap).map((value) => {
        // ONly the dbReferences have to be merged as the rest is all the same
        const mergedDbReferences = [];
        value.forEach((feature) => {
          feature.ptms.forEach((ptm) => {
            ptm.dbReferences.forEach((dbReference) => {
              const refExists = mergedDbReferences.find(
                (ref) => ref.id === dbReference.id
              );
              if (!refExists) {
                mergedDbReferences.push(dbReference);
              }
            });
          });
        });

        const mergedFeatures = {
          type: value[0].type,
          begin: value[0].begin,
          end: value[0].end,
          xrefs: value[0].xrefs,
          evidences: value[0].evidences,
          peptide: value[0].peptide,
          unique: value[0].unique,
          ptms: value[0].ptms.map((ptm) => ({
            name: ptm.name,
            position: ptm.position,
            sources: ptm.sources,
          })),
        };

        // if more than one PTM is present, mergedDbReferences will be the same as the value and it has be assigned to each PTM to avoid errors
        mergedFeatures.ptms.forEach(
          (ptm) => (ptm.dbReferences = mergedDbReferences)
        );
        return Object.assign(
          mergedFeatures,
          proteomicsTrackProperties(mergedFeatures)
        );
      }, []);
    } else {
      adaptedData = data.features.map((feature) => {
        return Object.assign(feature, proteomicsTrackProperties(feature));
      });
    }

    adaptedData = renameProperties(adaptedData);
  }
  return adaptedData;
};

class ProtvistaProteomicsAdapter extends ProtvistaFeatureAdapter {
  parseEntry(data) {
    this._adaptedData = transformData(data);
    return this._adaptedData;
  }
}

export default ProtvistaProteomicsAdapter;
