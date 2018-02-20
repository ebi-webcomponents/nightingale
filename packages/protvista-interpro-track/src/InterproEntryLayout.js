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
    for (let feature of features) {
      this.height[feature.accession] = this.expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT;
      this.yPos[feature.accession] = this._padding;
      yPos = this.height[feature.accession] + 2*this._padding;
      this.maxYPos = Math.max(this.maxYPos, yPos);
      if (feature.residues){
        for (let i=0; i<feature.residues.length; i++) {
          const resGroup = feature.residues[i];
          for (let j=0; j<resGroup.locations.length; j++) {
            this.height[`${resGroup.accession}_${i}_${j}`] = this.expanded ? CHILD_HEIGHT: 0;
            this.yPos[`${resGroup.accession}_${i}_${j}`] = this.maxYPos + this._padding;
            yPos += (this.expanded ? 2*this._padding : 0) + this.height[`${resGroup.accession}_${i}_${j}`];
            this.maxYPos = Math.max(this.maxYPos, yPos)
          }
        }
      }
    }
    if (children) for (let child of children) {
      this.height[child.accession] = this.expanded ? CHILD_HEIGHT: 0;
      this.yPos[child.accession] = this.maxYPos + this._padding;
      yPos += 2*this._padding + this.height[child.accession];
      this.maxYPos = Math.max(this.maxYPos, yPos);
      if (child.residues){
        for (let i=0; i<child.residues.length; i++) {
          const resGroup = child.residues[i];
          for (let j=0; j<resGroup.locations.length; j++) {
            this.height[`${resGroup.accession}_${i}_${j}`] = this.expanded && child.expanded ? CHILD_HEIGHT: 0;
            this.yPos[`${resGroup.accession}_${i}_${j}`] = this.maxYPos + this._padding;
            yPos += (this.expanded ? 2*this._padding : 0) + this.height[`${resGroup.accession}_${i}_${j}`];
            this.maxYPos = Math.max(this.maxYPos, yPos)
          }
        }
      }
    }
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
