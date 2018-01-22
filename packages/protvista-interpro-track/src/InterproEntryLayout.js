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
    }
    if (children) for (let child of children) {
      this.height[child.accession] = this.expanded ? CHILD_HEIGHT: 0;
      this.yPos[child.accession] = this.maxYPos + this._padding;
      yPos += 2*this._padding + this.height[child.accession];
      this.maxYPos = Math.max(this.maxYPos, yPos)
    }
  }
  getFeatureYPos(feature) {
    return feature.accession in this.yPos ? this.yPos[feature.accession] : 0;
  }
  getFeatureHeight(feature) {
    return feature.accession in this.height ? this.height[feature.accession] : 0;
  };
}
