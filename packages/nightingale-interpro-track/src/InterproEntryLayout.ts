/* eslint-disable no-param-reassign */
import {
  DefaultLayout,
  Feature,
  FeatureLocation,
  LayoutOptions,
} from "@nightingale-elements/nightingale-track";

export const COLLAPSED_HEIGHT = 16;
export const EXPANDED_HEIGHT = 14;
export const CHILD_HEIGHT = 10;

export type ResidueLocation = FeatureLocation & {
  length: number;
  accession: string;
  feature: InterProFeature;
  description: string;
};
export type Residue = {
  accession: string;
  locations: Array<ResidueLocation>;
  feature: InterProFeature;
  location: ResidueLocation;
  i: number;
  j: number;
};

export type InterProFeature = Feature & {
  residues: Residue[];
  expanded: boolean;
  i?: number;
  j?: number;
  k?: number;
};

export default class InterproEntryLayout extends DefaultLayout {
  #heightMap = new Map<string, number>();
  #yPositionMap = new Map<string, number>();
  maxYPos = 0;
  expanded = false;

  constructor({
    expanded,
    ...otherOptions
  }: LayoutOptions & { expanded: boolean }) {
    super(otherOptions);
    this.expanded = expanded;
  }

  init(features: InterProFeature[], children?: InterProFeature[]) {
    let yPos = 0;
    this.#heightMap = new Map();
    this.#yPositionMap = new Map();
    this.maxYPos = 0;
    if (!features) return;
    const innerPadding = (COLLAPSED_HEIGHT - CHILD_HEIGHT) / 2;
    const residuesPos: Record<
      string,
      Record<string, Record<string, { height: number; yPos: number }>>
    > = {};
    for (let k = 0; k < features.length; k++) {
      const feature = features[k];
      this.#heightMap.set(
        feature.accession,
        this.expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT
      );
      this.#yPositionMap.set(feature.accession, this.padding);
      yPos = (this.#heightMap.get(feature.accession) || 0) + 2 * this.padding;
      this.maxYPos = Math.max(this.maxYPos, yPos);
      if (!(feature.accession in residuesPos))
        residuesPos[feature.accession] = {};
      if (feature.residues)
        yPos = this._initResidues(
          feature.residues,
          feature.accession,
          this.expanded ? yPos : this.#yPositionMap.get(feature.accession) || 0,
          k,
          innerPadding,
          feature.locations,
          residuesPos,
          this.expanded
        );
    }
    if (children)
      for (let k = 0; k < children.length; k++) {
        const child: InterProFeature = children[k];
        if (!this.#heightMap.has(child.accession)) {
          this.#heightMap.set(child.accession, CHILD_HEIGHT);
          this.#yPositionMap.set(
            child.accession,
            (this.expanded ? this.maxYPos : innerPadding) + this.padding
          );
          yPos +=
            2 * this.padding +
            (this.expanded
              ? this.#heightMap.get(child.accession) || EXPANDED_HEIGHT
              : 0);
          this.maxYPos = Math.max(this.maxYPos, yPos);
        }
        if (!(child.accession in residuesPos))
          residuesPos[child.accession] = {};
        if (child.residues) {
          yPos = this._initResidues(
            child.residues,
            child.accession,
            child.expanded
              ? yPos
              : this.#yPositionMap.get(child.accession) || 0,
            k,
            innerPadding,
            child.locations,
            residuesPos,
            child.expanded
          );
        }
      }
    this.maxYPos += this.padding;
  }

  _initResidues(
    residues: Residue[],
    featureAcc: string,
    yPos: number,
    k: number,
    innerPadding: number,
    locs?: FeatureLocation[],
    residuesPos: Record<
      string,
      Record<string, Record<string, { height: number; yPos: number }>>
    > = {},
    expanded = true
  ) {
    for (let i = 0; i < residues.length; i++) {
      const resGroup = residues[i];
      InterproEntryLayout.filterOutResidueFragmentsOutOfLocation(
        resGroup,
        locs || []
      );
      if (!(resGroup.accession in residuesPos[featureAcc]))
        residuesPos[featureAcc][resGroup.accession] = {};
      for (let j = 0; j < resGroup.locations.length; j++) {
        const desc = resGroup.locations[j].description;
        if (!(desc in residuesPos[featureAcc][resGroup.accession])) {
          residuesPos[featureAcc][resGroup.accession][desc] = {
            height: expanded
              ? CHILD_HEIGHT
              : this.#heightMap.get(featureAcc) ||
                EXPANDED_HEIGHT - 2 * innerPadding,
            yPos: expanded ? this.maxYPos + this.padding : yPos + innerPadding,
          };
          yPos = expanded
            ? this.maxYPos + 2 * this.padding + CHILD_HEIGHT
            : yPos;
        }
        this.#heightMap.set(
          `${resGroup.accession}_${k}_${i}_${j}`,
          residuesPos[featureAcc][resGroup.accession][desc].height
        );
        this.#yPositionMap.set(
          `${resGroup.accession}_${k}_${i}_${j}`,
          residuesPos[featureAcc][resGroup.accession][desc].yPos
        );
        this.maxYPos = Math.max(this.maxYPos, yPos);
      }
    }
    return expanded ? yPos : this.maxYPos + 2 * this.padding;
  }

  static filterOutResidueFragmentsOutOfLocation(
    residue: Residue,
    featureLocations: FeatureLocation[]
  ) {
    residue.locations.forEach(
      (locRes) =>
        (locRes.fragments = locRes.fragments.filter((fragRes) =>
          featureLocations.some((loc) =>
            loc.fragments.some(
              (frag) => fragRes.start >= frag.start && fragRes.end <= frag.end
            )
          )
        ))
    );
    residue.locations = residue.locations.filter(
      (locRes) => locRes.fragments.length
    );
  }

  static getAccFromFeature(feature: Feature | string) {
    let acc = "";
    if (typeof feature === "string") {
      acc = feature;
    } else if (feature.accession) {
      acc = feature.accession;
    }
    return acc;
  }

  getFeatureYPos(feature: Feature | string) {
    const acc = InterproEntryLayout.getAccFromFeature(feature);
    return this.#yPositionMap.get(acc) || 0;
  }

  getFeatureHeight(feature: Feature | string) {
    const acc = InterproEntryLayout.getAccFromFeature(feature);
    return this.#heightMap.get(acc) || 0;
  }
}
