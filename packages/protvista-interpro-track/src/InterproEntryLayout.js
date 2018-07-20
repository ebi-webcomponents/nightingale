import {DefaultLayout} from 'protvista-track';

const COLLAPSED_HEIGHT = 16;
const EXPANDED_HEIGHT = 14;
const CHILD_HEIGHT = 10;

export default class InterproEntryLayout extends DefaultLayout{
  init(features, children){
    let yPos = 0;
    this.height = {}
    this.yPos = {}
    this.maxYPos = 0;
    if (!features) return;
    const residues_pos = {};
    for (let k=0; k<features.length; k++) {
      let feature = features[k];
      this.height[feature.accession] = this.expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT;
      this.yPos[feature.accession] = this._padding;
      yPos = this.height[feature.accession] + 2*this._padding;
      this.maxYPos = Math.max(this.maxYPos, yPos);
      if (!(feature.accession in residues_pos))
        residues_pos[feature.accession]={};
      if (feature.residues)
        yPos = this._initResidues(feature.residues, feature.accession, feature.locations, yPos, k, residues_pos);
    }
    if (children) for (let k=0; k<children.length; k++) {
      const child = children[k];
      // for (let child of children) {
      if (!(child.accession in this.height)){
        this.height[child.accession] = this.expanded ? CHILD_HEIGHT: 0;
        this.yPos[child.accession] = this.maxYPos + this._padding;
        yPos += 2*this._padding + this.height[child.accession];
        this.maxYPos = Math.max(this.maxYPos, yPos);
      }
      if (!(child.accession in residues_pos))
        residues_pos[child.accession]={};
      if (child.residues)
        yPos = this._initResidues(child.residues, child.accession, child.locations, yPos, k, residues_pos);
    }
    this.maxYPos += this._padding;
  }

  _initResidues(residues, feature_acc, locs, yPos, k, residues_pos ={}){
    for (let i=0; i<residues.length; i++) {
      const resGroup = residues[i];
      this._filterOutResidueFragmentsOutOfLocation(resGroup, locs);
      if (!(resGroup.accession in residues_pos[feature_acc]))
        residues_pos[feature_acc][resGroup.accession]={};
      for (let j=0; j<resGroup.locations.length; j++) {
        const desc = resGroup.locations[j].description;
        if (!(desc in residues_pos[feature_acc][resGroup.accession])) {
          residues_pos[feature_acc][resGroup.accession][desc] = {
            height: this.expanded ? CHILD_HEIGHT: 0,
            yPos: this.maxYPos + this._padding
          };
          yPos = (this.expanded ? this.maxYPos +2*this._padding + CHILD_HEIGHT: yPos);
        }
        this.height[`${resGroup.accession}_${k}_${i}_${j}`] = residues_pos[feature_acc][resGroup.accession][desc].height;
        this.yPos[`${resGroup.accession}_${k}_${i}_${j}`] = residues_pos[feature_acc][resGroup.accession][desc].yPos;
        this.maxYPos = Math.max(this.maxYPos, yPos);
      }
    }
    return yPos;
  }
  _filterOutResidueFragmentsOutOfLocation(residue, feature_locations){

    residue.locations.forEach(
      loc_res => loc_res.fragments = loc_res.fragments.filter(
        frag_res => feature_locations.some(
          loc => loc.fragments.some(
            frag => frag_res.start >= frag.start && frag_res.end <= frag.end
          )
        )
      )
    )
    residue.locations = residue.locations.filter(
      loc_res => loc_res.fragments.length
    );
  }
  _getAccFromFeature(feature){
    let acc = '';
    if (typeof feature === 'string') {
      acc = feature;
    } else if (feature.accession){
        acc = feature.accession;
    }
    return acc;
  }
  getFeatureYPos(feature) {
    const acc = this._getAccFromFeature(feature);
    return acc in this.yPos ? this.yPos[acc] : 0;
  }
  getFeatureHeight(feature) {
    const acc = this._getAccFromFeature(feature);
    return acc in this.height ? this.height[acc] : 0;
  };
}
