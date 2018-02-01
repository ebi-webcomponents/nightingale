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
    console.log("Features!!!");

    this._layoutObj.expanded = this._expanded;
    super._createTrack();
    this.children_g = null;
  }
  connectedCallback() {
    super.connectedCallback();
    this._expanded = this.hasAttribute('expanded');
    this._haveCreatedFeatures = false;
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name==='expanded' && oldValue !== newValue && this._contributors){
      for (let c of this._contributors){
        c.expanded = !oldValue;
      }
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  set data(data) {
    this._data = this.normalizeLocations(data);
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
  _createResidueGroup(baseG){
    return baseG.selectAll('g.residues-group')
      .data(d => d.residues ? d.residues.map(r => Object.assign({}, r, {feature: d})) : [])
        .enter().append('g')
          .attr('class', 'residues-group')
          .selectAll('g.residues-locations')
          .data((d, i) =>
            d.locations.map((loc) =>
             Object.assign({}, loc, {
               accession: d.accession,
               feature: d.feature,
               location: loc,
               i:i,
               // expended: true
             }))
          )
          .enter().append('g')
            .attr('class', 'residues-locations');
  }
  _createResiduePaths(baseG){
    return baseG
      .selectAll('g.residue')
      .data((d, j) => d.fragments.map((loc) => Object.assign({}, loc, {accession: d.accession, feature: d.feature, location: d.location, i: d.i, j:j})))
      .enter()
      .append('path')
        .attr('class', 'feature')
        .attr('d', (f,j) =>
          this._featureShape.getFeatureShape(
            this.xScale(2) - this.xScale(1), this._layoutObj.getFeatureHeight(`${f.accession}_${f.i}_${f.j}`),
              f.end ? f.end - f.start + 1 : 1, 'rectangle'
          )
        )
        .attr('transform',
          f =>'translate(' + this.xScale(f.start)+ ',' + (padding.top + this._layoutObj.getFeatureYPos(`${f.accession}_${f.i}_${f.j}`)) + ')'
        )
        .attr('fill', f => this._getFeatureColor(f))
        .attr('stroke', 'transparent');
  }
  _refreshResiduePaths(baseG){
    baseG
      .attr('d', f =>
        this._featureShape.getFeatureShape(
          this.xScale(2) - this.xScale(1), this._layoutObj.getFeatureHeight(`${f.accession}_${f.i}_${f.j}`),
            f.end ? f.end - f.start + 1 : 1, 'rectangle'
        )
      )
      .attr('transform',
        f =>'translate(' + this.xScale(f.start)+ ',' + (padding.top + this._layoutObj.getFeatureYPos(`${f.accession}_${f.i}_${f.j}`)) + ')'
      )
      .attr('fill', f => this._getFeatureColor(f));

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
      .selectAll('path.feature')
      .data(d => d.fragments.map((loc) => Object.assign({}, loc, {feature: d.feature})))
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
    this.residues_g = this._createResidueGroup(this.featuresG);
    this.residues_loc = this._createResiduePaths(this.residues_g);


    if (this._contributors) {
      if (!this.children_g)
        this.children_g = this.svg.append('g')
          .attr('class', 'children-features');

      this.childrenGroup = this.children_g.append('g')
        .attr('class', 'children-group')
        .attr('visibility', this._expanded ? 'visible' : 'hidden' );
      this.childGroup = this.childrenGroup.selectAll('g.child-group')
        .data(d => this._contributors)
        .enter()
        .append('g')
          .attr('class', 'child-group');
      this.featureChildren = this.childGroup.selectAll('g.child-location-group')
        .data(d => {
          d.expanded=this._expanded;
          return d.locations.map((loc) => Object.assign({}, loc, {feature: d}))
        })
        .enter().append('g')
          .attr('class', 'child-location-group')
          .selectAll('path.child-fragment')
          .data(d => d.fragments.map((fragment) => Object.assign({}, fragment, {feature: d.feature})))
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
              f.feature.expanded = !f.feature.expanded;
              this.refresh();
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
        this.child_residues_g = this._createResidueGroup(this.childGroup);
        this.child_residues_loc = this._createResiduePaths(this.child_residues_g);

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

      this.residues_g.attr('visibility', this._expanded ? 'visible' : 'hidden' );
      this._refreshResiduePaths(this.residues_loc);

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
        this.child_residues_g.attr('visibility', d => d.feature.expanded ? 'visible' : 'hidden');
        this._refreshResiduePaths(this.child_residues_loc);

      }
      this._updateHighlight();
      this.svg.attr("height", this._layoutObj.maxYPos);
      this.highlighted.attr('height', this._layoutObj.maxYPos);

    }
  }
}
export default ProtVistaInterproTrack;
