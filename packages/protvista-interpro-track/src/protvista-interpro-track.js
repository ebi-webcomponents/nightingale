import ProtVistaTrack from "protvista-track";
import InterproEntryLayout from "./InterproEntryLayout";

const height = 44,
  // width = 760,
  padding = {
    top: 2,
    right: 10,
    bottom: 2,
    left: 10
  };

class ProtVistaInterproTrack extends ProtVistaTrack {
  _createTrack() {
    this._layoutObj.expanded = this._expanded;
    super._createTrack();
    this.children_g = null;
  }
  connectedCallback() {
    super.connectedCallback();
    this._expanded = this.hasAttribute('expanded');
    this._haveCreatedFeatures = false;
  }

  set data(data) {
    this._data = this.normalizeLocations(data);
    // for (let feature of this._data) {
    //   feature.children = this.normalizeLocations(feature.children || []);
    //   feature.children.forEach(child=>child.parent = feature);
    // }
    this._createTrack();
  }
  set contributors(contributors) {
    this._contributors = this.normalizeLocations(contributors);
    if (this._data) this._createTrack();
  }
  getLayout(data) {
      return new InterproEntryLayout({
        layoutHeight:height,
        expanded: this._expanded,
        padding: 2,
      });
  }
  static get observedAttributes() {
    return ProtVistaTrack.observedAttributes.concat(['expanded','color']);
  }
  set color(value){
    if (this._color !== value) {
      this._color = value;
      this.refresh();
    }
  }

  _createFeatures(){
    this._layoutObj.init(this._data, this._contributors);
    this.featuresG = this.seq_g.selectAll('g.feature-group')
      .data(this._data)
      .enter()
      .append('g')
        .attr('class', 'feature-group')
        .attr('id', d => `g_${d.accession}`);

    this.locations = this.featuresG.selectAll('g.location-group')
      .data(d => d.locations.map((loc) => Object.assign({}, loc, {feature: d})))
        .enter().append('g')
          .attr('class', 'location-group');

    this.features = this.locations
      .selectAll('g.fragment-group')
      .data(d => d.fragments.map((loc) => Object.assign({}, loc, {feature: d.feature})))
      // .data(d=>d.fragments.map(({...l})=>({feature:d.feature, ...l})))
      .enter()
      .append('path')
        .attr('class', 'feature')
        .attr('d', f =>
          this._featureShape.getFeatureShape(
            this.xScale(2) - this.xScale(1), this._layoutObj.getFeatureHeight(f.feature),
              f.end ? f.end - f.start + 1 : 1, this._getShape(f.feature)
          )
        )
        .attr('transform', f =>
          'translate(' + this.xScale(f.start)+ ',' + (padding.top + this._layoutObj.getFeatureYPos(f.feature)) + ')'
        )
        .attr('fill', f => this._getFeatureColor(f.feature))
        .attr('stroke', f => this._getFeatureColor(f.feature))
        .on('click', (f, i, d) => {
          if (this._expanded)
            this.removeAttribute('expanded')
          else
            this.setAttribute('expanded', 'expanded')
          this.dispatchEvent(new CustomEvent("entryclick", {
            detail: Object.assign(f, {target: d[i]}), bubbles:true, cancelable: true
          }));
        })
        .on('mouseover', (f, i, d) => {
          this.dispatchEvent(new CustomEvent("change", {
            detail: {highlightend: f.end, highlightstart: f.start}, bubbles:true, cancelable: true
          }));
          this.dispatchEvent(new CustomEvent("entrymouseover", {
            detail: Object.assign(f, {target: d[i]}), bubbles:true, cancelable: true
          }));
        })
        .on('mouseout', (f, i, d) => {
          this.dispatchEvent(new CustomEvent("change", {
            detail: {highlightend: null, highlightstart: null}, bubbles:true, cancelable: true
          }));
          this.dispatchEvent(new CustomEvent("entrymouseout", {
            detail: f, bubbles:true, cancelable: true
          }));
        });


    if (this._contributors) {
      if (!this.children_g)
        this.children_g = this.svg.append('g')
          .attr('class', 'children-features');

      this.childrenGroup = this.children_g.append('g')
        .attr('class', 'children-group')
        .attr('visibility', this._expanded ? 'visible' : 'hidden' );
      this.featureChildren = this.childrenGroup.selectAll('g.child-group')
        .data(d => this._contributors)
        .enter()
        .append('g')
          .attr('class', 'child-group')
          .selectAll('g.child-location-group')
            .data(d => d.locations.map((loc) => Object.assign({}, loc, {feature: d})))
            .enter().append('g')
              .attr('class', 'child-location-group')
              .selectAll('path.child-fragment')
              .data(d => d.fragments.map((loc) => Object.assign({}, loc, {feature: d.feature})))
              .enter()
              .append('path')
                .attr('class', 'child-fragment')
                .attr('d', f =>
                  this._featureShape.getFeatureShape(
                    this.xScale(2) - this.xScale(1), this._layoutObj.getFeatureHeight(f.feature),
                      f.end ? f.end - f.start + 1: 1, this._getShape(f.feature)
                  )
                )
                .attr('transform', f =>
                  'translate(' + this.xScale(f.start)+ ',' + (padding.top + this._layoutObj.getFeatureYPos(f.feature)) + ')'
                )
                .attr('fill', f => this._getFeatureColor(f.feature))
                .attr('stroke', f => this._getFeatureColor(f.feature))
                .on('click', (f, i, d) => {
                  this.dispatchEvent(new CustomEvent("entryclick", {
                    detail: Object.assign(f, {target: d[i]}), bubbles:true, cancelable: true
                  }));
                })
                .on('mouseover', (f, i, d) => {
                  this.dispatchEvent(new CustomEvent("change", {
                    detail: {highlightend: f.end, highlightstart: f.start}, bubbles:true, cancelable: true
                  }));
                  this.dispatchEvent(new CustomEvent("entrymouseover", {
                    detail: Object.assign(f, {target: d[i]}), bubbles:true, cancelable: true
                  }));
                })
                .on('mouseout', (f, i, d) => {
                  this.dispatchEvent(new CustomEvent("change", {
                    detail: {highlightend: null, highlightstart: null}, bubbles:true, cancelable: true
                  }));
                  this.dispatchEvent(new CustomEvent("entrymouseout", {
                    detail: Object.assign(f, {target: d[i]}), bubbles:true, cancelable: true
                  }));
                });
    }
    this.svg.attr("height", this._layoutObj.maxYPos);
    this._haveCreatedFeatures = true;
  }
  refresh(){
    if (this._haveCreatedFeatures) {
      // this.xScale.domain([this._displaystart, this._displayend]);
      this._layoutObj.expanded = this._expanded;
      this._layoutObj.init(this._data, this._contributors);
      this.features
        .attr('d', f =>
          this._featureShape.getFeatureShape(
            this.xScale(2) - this.xScale(1), this._layoutObj.getFeatureHeight(f.feature),
              f.end ? f.end - f.start + 1: 1, this._getShape(f.feature)
          )
        )
        .attr('fill', f => this._getFeatureColor(f.feature))
        .attr('stroke', f => this._getFeatureColor(f.feature))
        .attr('transform', f =>
          'translate(' + this.xScale(f.start)+ ',' + (padding.top + this._layoutObj.getFeatureYPos(f.feature)) + ')'
        );
      if (this._contributors) {
        this.childrenGroup.attr('visibility', this._expanded ? 'visible' : 'hidden' );
        this.featureChildren
          .attr('d', f =>
            this._featureShape.getFeatureShape(
              this.xScale(2) - this.xScale(1), this._layoutObj.getFeatureHeight(f.feature),
                f.end ? f.end - f.start + 1 : 1, this._getShape(f.feature)
            )
          )
          .attr('transform', f =>
            'translate(' + this.xScale(f.start)+ ',' + (padding.top + this._layoutObj.getFeatureYPos(f.feature)) + ')'
          )
          .attr('fill', f => this._getFeatureColor(f.feature))
          .attr('stroke', f => this._getFeatureColor(f.feature));
      }
      this._updateHighlight();
      this.svg.attr("height", this._layoutObj.maxYPos);
      this.highlighted.attr('height', this._layoutObj.maxYPos);

    }
  }
}
export default ProtVistaInterproTrack;
