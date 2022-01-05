import ProtvistaFeatureAdapter from "protvista-feature-adapter";
import { ProtvistaTrackDatum } from "protvista-track";
import { v1 } from "uuid";

import {
  getAllFeatureStructures,
  mergeOverlappingIntervals,
} from "./structure-data-parser";
import { UniProtkbEntry } from "./uniprotkbentry";

export const transformData = (data: UniProtkbEntry): ProtvistaTrackDatum[] => {
  let transformedData: ProtvistaTrackDatum[] = [];
  if (data) {
    const allFeatureStructures = getAllFeatureStructures(data);
    transformedData = mergeOverlappingIntervals(allFeatureStructures);

    transformedData.forEach((feature) => {
      /* eslint-disable no-param-reassign */
      feature.protvistaFeatureId = v1();
    });
  }
  return transformedData;
};

export default class ProtVistaStructureAdapter extends ProtvistaFeatureAdapter<
  ProtvistaTrackDatum[],
  UniProtkbEntry
> {
  static get is(): string {
    return "protvista-structure-adapter";
  }

  parseEntry(data: UniProtkbEntry): void {
    super.parseEntry(data);
    this._adaptedData = transformData(data);
  }
}
