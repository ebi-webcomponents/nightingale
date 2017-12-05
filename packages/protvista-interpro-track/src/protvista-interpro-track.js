import ProtVistaTrack from "protvista-track";
import InterproEntryLayout from "./InterproEntryLayout";

const height = 44,
  width = 760,
  padding = {
    top: 2,
    right: 10,
    bottom: 2,
    left: 10
  };

class ProtVistaInterproTrack extends ProtVistaTrack {
  constructor() {
    super();
    this._expanded = this.hasAttribute('expanded');
  }
  _createTrack() {
    this._layoutObj.expanded = this._expanded;
    super._createTrack();
  }

  set data(data) {
    this._data = this.normalizeLocations(data);
    for (let feature of this._data) {
      feature.children = this.normalizeLocations(feature.children || []);
      feature.children.forEach(child=>child.parent = feature);
    }
    this._createTrack();
  }
  getLayout(data) {
      return new InterproEntryLayout({
        layoutHeight:height,
        expanded: this._expanded,
        padding: 2,
      });
  }
  static get observedAttributes() {
    return ProtVistaTrack.observedAttributes.concat('expanded');
  }

  _createFeatures(){
    this.featuresG = this.seq_g.selectAll('g.feature-group')
      .data(this._data)
      .enter()
      .append('g')
        .attr('class', 'feature-group')
        .attr('id', d => `g_${d.accession}`);

    this.locations = this.featuresG.selectAll('g.location-group')
        .data(d => d.locations.map(({...l})=>({feature:d, ...l})))
        .enter().append('g')
          .attr('class', 'location-group');

    this.features = this.locations
      .selectAll('g.fragment-group')
      .data(d=>d.fragments.map(({...l})=>({feature:d.feature, ...l})))
      .enter()
      .append('path')
        .attr('class', 'feature')
        .attr('d', f =>
          this._featureShape.getFeatureShape(
            this._xScale(2) - this._xScale(1), this._layoutObj.getFeatureHeight(f.feature),
              f.end ? f.end - f.start + 1 : 1, this._getShape(f.feature)
          )
        )
        .attr('transform', f =>
          'translate(' + this._xScale(f.start)+ ',' + (padding.top + this._layoutObj.getFeatureYPos(f.feature)) + ')'
        )
        .attr('fill', f => this._getFeatureColor(f.feature))
        .attr('stroke', f => this._getFeatureColor(f.feature))
        .on('click', f => {
          if (this._expanded)
            this.removeAttribute('expanded')
          else
            this.setAttribute('expanded', 'expanded')
        })
        .on('mouseover', f => {
          this.dispatchEvent(new CustomEvent("change", {
            detail: {highlightend: f.end, highlightstart: f.start}, bubbles:true, cancelable: true
          }));
        })
        .on('mouseout', () => {
          this.dispatchEvent(new CustomEvent("change", {
            detail: {highlightend: null, highlightstart: null}, bubbles:true, cancelable: true
          }));
        });

    this.childrenGroup = this.featuresG.append('g')
      .attr('class', 'children-group')
      .attr('visibility', this._expanded ? 'visible' : 'hidden' );

    this.featureChildren = this.childrenGroup.selectAll('g.child-group')
      .data(d => d.children)
      .enter()
      .append('g')
        .attr('class', 'child-group')
        .selectAll('g.child-location-group')
          .data(d => d.locations.map(({...l})=>({feature:d, ...l})))
          .enter().append('g')
            .attr('class', 'child-location-group')
            .selectAll('path.child-fragment')
            .data(d=>d.fragments.map(({...l})=>({feature:d.feature, ...l})))
            .enter()
            .append('path')
              .attr('class', 'child-fragment')
              .attr('d', f =>
                this._featureShape.getFeatureShape(
                  this._xScale(2) - this._xScale(1), this._layoutObj.getFeatureHeight(f.feature),
                    f.end ? f.end - f.start + 1: 1, this._getShape(f.feature.parent)
                )
              )
              .attr('transform', f =>
                'translate(' + this._xScale(f.start)+ ',' + (padding.top + this._layoutObj.getFeatureYPos(f.feature)) + ')'
              )
              .attr('fill', f => this._getFeatureColor(f.feature.parent))
              .attr('stroke', f => this._getFeatureColor(f.feature.parent));
    this.svg.attr("height", this._layoutObj.maxYPos);
  }
  _updateTrack(){
    if (this._xScale) {
      this._xScale.domain([this._displaystart, this._displayend]);
      this._layoutObj.expanded = this._expanded;
      this._layoutObj.init(this._data);
      this.childrenGroup.attr('visibility', this._expanded ? 'visible' : 'hidden' );
      this.features
        .attr('d', f =>
          this._featureShape.getFeatureShape(
            this._xScale(2) - this._xScale(1), this._layoutObj.getFeatureHeight(f.feature),
              f.end ? f.end - f.start + 1: 1, this._getShape(f.feature)
          )
        )
        .attr('transform', f =>
          'translate(' + this._xScale(f.start)+ ',' + (padding.top + this._layoutObj.getFeatureYPos(f.feature)) + ')'
        );
      this.featureChildren
        .attr('d', f =>
          this._featureShape.getFeatureShape(
            this._xScale(2) - this._xScale(1), this._layoutObj.getFeatureHeight(f.feature),
              f.end ? f.end - f.start + 1 : 1, this._getShape(f.feature.parent)
          )
        )
        .attr('transform', f =>
          'translate(' + this._xScale(f.start)+ ',' + (padding.top + this._layoutObj.getFeatureYPos(f.feature)) + ')'
        );
      this._updateHighlight();
      this.svg.attr("height", this._layoutObj.maxYPos);
    }
  }
}
export default ProtVistaInterproTrack;
