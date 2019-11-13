/* eslint-disable no-param-reassign */
import { DefaultLayout } from "protvista-track";

export const COLLAPSED_HEIGHT = 16;
export const EXPANDED_HEIGHT = 14;
export const CHILD_HEIGHT = 10;

export default class InterproEntryLayout extends DefaultLayout {
  init(features, children) {
    let yPos = 0;
    this.height = {};
    this.yPos = {};
    this.maxYPos = 0;
    if (!features) return;
    this.innerPadding = (COLLAPSED_HEIGHT - CHILD_HEIGHT) / 2;
    const residuesPos = {};
    for (let k = 0; k < features.length; k++) {
      const feature = features[k];
      this.height[feature.accession] = this.expanded
        ? EXPANDED_HEIGHT
        : COLLAPSED_HEIGHT;
      this.yPos[feature.accession] = this._padding;
      yPos = this.height[feature.accession] + 2 * this._padding;
      this.maxYPos = Math.max(this.maxYPos, yPos);
      if (!(feature.accession in residuesPos))
        residuesPos[feature.accession] = {};
      if (feature.residues)
        yPos = this._initResidues(
          feature.residues,
          feature.accession,
          feature.locations,
          this.expanded ? yPos : this.yPos[feature.accession],
          k,
          residuesPos,
          this.expanded
        );
    }
    if (children)
      for (let k = 0; k < children.length; k++) {
        const child = children[k];
        if (!(child.accession in this.height)) {
          this.height[child.accession] = CHILD_HEIGHT;
          this.yPos[child.accession] =
            (this.expanded ? this.maxYPos : this.innerPadding) + this._padding;
          yPos +=
            2 * this._padding +
            (this.expanded ? this.height[child.accession] : 0);
          this.maxYPos = Math.max(this.maxYPos, yPos);
        }
        if (!(child.accession in residuesPos))
          residuesPos[child.accession] = {};
        if (child.residues) {
          yPos = this._initResidues(
            child.residues,
            child.accession,
            child.locations,
            child.expanded ? yPos : this.yPos[child.accession],
            k,
            residuesPos,
            child.expanded
          );
        }
      }
    this.maxYPos += this._padding;
  }

  _initResidues(
    residues,
    featureAcc,
    locs,
    yPos,
    k,
    residuesPos = {},
    expanded = true
  ) {
    for (let i = 0; i < residues.length; i++) {
      const resGroup = residues[i];
      InterproEntryLayout._filterOutResidueFragmentsOutOfLocation(
        resGroup,
        locs
      );
      if (!(resGroup.accession in residuesPos[featureAcc]))
        residuesPos[featureAcc][resGroup.accession] = {};
      for (let j = 0; j < resGroup.locations.length; j++) {
        const desc = resGroup.locations[j].description;
        if (!(desc in residuesPos[featureAcc][resGroup.accession])) {
          residuesPos[featureAcc][resGroup.accession][desc] = {
            height: expanded
              ? CHILD_HEIGHT
              : this.height[featureAcc] - 2 * this.innerPadding,
            yPos: expanded
              ? this.maxYPos + this._padding
              : yPos + this.innerPadding
          };
          yPos = expanded
            ? this.maxYPos + 2 * this._padding + CHILD_HEIGHT
            : yPos;
        }
        this.height[`${resGroup.accession}_${k}_${i}_${j}`] =
          residuesPos[featureAcc][resGroup.accession][desc].height;
        this.yPos[`${resGroup.accession}_${k}_${i}_${j}`] =
          residuesPos[featureAcc][resGroup.accession][desc].yPos;
        this.maxYPos = Math.max(this.maxYPos, yPos);
      }
    }
    return expanded ? yPos : this.maxYPos + 2 * this._padding;
  }

  static _filterOutResidueFragmentsOutOfLocation(residue, featureLocations) {
    residue.locations.forEach(
      locRes =>
        (locRes.fragments = locRes.fragments.filter(fragRes =>
          featureLocations.some(loc =>
            loc.fragments.some(
              frag => fragRes.start >= frag.start && fragRes.end <= frag.end
            )
          )
        ))
    );
    residue.locations = residue.locations.filter(
      locRes => locRes.fragments.length
    );
  }

  static _getAccFromFeature(feature) {
    let acc = "";
    if (typeof feature === "string") {
      acc = feature;
    } else if (feature.accession) {
      acc = feature.accession;
    }
    return acc;
  }

  getFeatureYPos(feature) {
    const acc = InterproEntryLayout._getAccFromFeature(feature);
    return acc in this.yPos ? this.yPos[acc] : 0;
  }

  getFeatureHeight(feature) {
    const acc = InterproEntryLayout._getAccFromFeature(feature);
    return acc in this.height ? this.height[acc] : 0;
  }
}
