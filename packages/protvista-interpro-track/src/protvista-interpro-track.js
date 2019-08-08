import ProtvistaTrack from "protvista-track";
import InterproEntryLayout, { COLLAPSED_HEIGHT } from "./InterproEntryLayout";
import { getCoverage } from "./coverage";

const padding = {
  top: 2,
  right: 10,
  bottom: 2,
  left: 10
};

const MAX_OPACITY_WHILE_COLAPSED = 0.8;

class ProtvistaInterproTrack extends ProtvistaTrack {
  _createTrack() {
    this._layoutObj.expanded = this._expanded;
    super._createTrack();
    this.children_g = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._expanded = this.hasAttribute("expanded");
    this._haveCreatedFeatures = false;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "expanded" && oldValue !== newValue && this._contributors) {
      for (let c of this._contributors) {
        c.expanded = !oldValue;
      }
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  set contributors(contributors) {
    this._contributors = this.normalizeLocations(contributors);
    this._coverage = getCoverage(this._contributors, this._length);
    if (this._data) this._createTrack();
  }

  getLayout(data) {
    return new InterproEntryLayout({
      layoutHeight: this._height,
      expanded: this._expanded,
      padding: 2
    });
  }

  static get observedAttributes() {
    return ProtvistaTrack.observedAttributes.concat(["expanded", "color"]);
  }
  set color(value) {
    if (this._color !== value) {
      this._color = value;
      this.refresh();
    }
  }

  _createResidueGroup(baseG) {
    return baseG
      .selectAll("g.residues-group")
      .data(d =>
        d.residues
          ? d.residues.map((r, i) => Object.assign({}, r, { feature: d, i: i }))
          : []
      )
      .enter()
      .append("g")
      .attr("class", "residues-group")
      .selectAll("g.residues-locations")
      .data(d =>
        d.locations.map((loc, j) =>
          Object.assign({}, loc, {
            accession: d.accession,
            feature: d.feature,
            location: loc,
            i: d.i,
            j: j
            // expended: true
          })
        )
      )
      .enter()
      .append("g")
      .attr("class", "residues-locations");
  }

  _createResiduePaths(baseG) {
    return baseG
      .selectAll("g.residue")
      .data(d =>
        d.fragments.map(loc =>
          Object.assign({}, loc, {
            accession: d.accession,
            feature: d.feature,
            location: d.location,
            k: d.feature.k,
            i: d.i,
            j: d.j
          })
        )
      )
      .enter()
      .append("path")
      .attr("class", "feature rectangle")
      .attr("d", (f, j) =>
        this._featureShape.getFeatureShape(
          this.getSingleBaseWidth(),
          this._layoutObj.getFeatureHeight(
            `${f.accession}_${f.k}_${f.i}_${f.j}`
          ),
          f.end ? f.end - f.start + 1 : 1,
          "rectangle"
        )
      )
      .attr(
        "transform",
        f =>
          "translate(" +
          this.getXFromSeqPosition(f.start) +
          "," +
          (padding.top +
            this._layoutObj.getFeatureYPos(
              `${f.accession}_${f.k}_${f.i}_${f.j}`
            )) +
          ")"
      )
      .attr("fill", f => this._getFeatureColor(f))
      .attr("stroke", "transparent")
      .call(this.bindEvents, this);
  }

  _refreshResiduePaths(baseG, expanded) {
    const numberOfSibillings = new Set(
      baseG.data().map(f => `${f.feature.accession}-${f.location.description}`)
    ).size;
    baseG
      .attr("d", f =>
        this._featureShape.getFeatureShape(
          this.getSingleBaseWidth(),
          this._layoutObj.getFeatureHeight(
            `${f.accession}_${f.k}_${f.i}_${f.j}`
          ),
          f.end ? f.end - f.start + 1 : 1,
          "rectangle"
        )
      )
      .attr(
        "transform",
        f =>
          "translate(" +
          this.getXFromSeqPosition(f.start) +
          "," +
          (padding.top +
            this._layoutObj.getFeatureYPos(
              `${f.accession}_${f.k}_${f.i}_${f.j}`
            )) +
          ")"
      )
      .style("pointer-events", f =>
        expanded || (f.feature && f.feature.expanded) ? "auto" : "none"
      )
      .style("stroke", f => (expanded ? null : "none"))
      .style("opacity", f =>
        expanded ? null : MAX_OPACITY_WHILE_COLAPSED / numberOfSibillings
      )
      .attr("fill", f =>
        expanded || (f.feature && f.feature.expanded)
          ? this._getFeatureColor(f)
          : "white"
      );
  }

  get margin() {
    return {
      top: 0,
      right: 10,
      bottom: 0,
      left: 10
    };
  }

  _createFeatures() {
    this._layoutObj.init(this._data, this._contributors);
    this._data.forEach((d, i) => (d.k = i));
    this.featuresG = this.seq_g
      .selectAll("g.feature-group")
      .data(this._data)
      .enter()
      .append("g")
      .attr("class", "feature-group")
      .attr("id", d => `g_${d.accession}`);

    this.locations = this.featuresG
      .selectAll("g.location-group")
      .data(d => d.locations.map(loc => Object.assign({}, loc, { feature: d })))
      .enter()
      .append("g")
      .attr("class", "location-group");

    this.coverLines = this.locations
      .selectAll("line.cover")
      .data(d => [
        d.fragments.reduce(
          (agg, v) => ({
            start: Math.min(agg.start, v.start),
            end: Math.max(agg.end, v.end),
            feature: d.feature
          }),
          { start: Infinity, end: -Infinity }
        )
      ])
      .enter()
      .append("line")
      .attr("class", "cover");

    this.features = this.locations
      .selectAll("path.feature")
      .data(d =>
        d.fragments.map(loc =>
          Object.assign({}, loc, { feature: d.feature, fragments: d.fragments })
        )
      )
      .enter()
      .append("path")
      .attr("class", f => this._getShape(f) + " feature")
      .on("click.expanded", (f, i, d) => {
        if (this._expanded) this.removeAttribute("expanded");
        else this.setAttribute("expanded", "expanded");
      })
      .call(this.bindEvents, this);

    this.residues_g = this._createResidueGroup(this.featuresG);
    this.residues_loc = this._createResiduePaths(this.residues_g);

    if (this._contributors) {
      this._contributors.forEach((d, i) => (d.k = i));
      if (!this.children_g)
        this.children_g = this.svg
          .append("g")
          .attr("class", "children-features");

      this.childrenGroup = this.children_g
        .append("g")
        .attr("class", "children-group");
      this.childGroup = this.childrenGroup
        .selectAll("g.child-group")
        .data(this._contributors)
        .enter()
        .append("g")
        .attr("class", "child-group");
      const locationChildrenG = this.childGroup
        .selectAll("g.child-location-group")
        .data(d => {
          d.expanded = this._expanded;
          return d.locations.map(loc => Object.assign({}, loc, { feature: d }));
        })
        .enter()
        .append("g")
        .attr("class", (_, i) => `child-location-group clg-${i}`);

      this.coverLinesChildren = locationChildrenG
        .selectAll("line.cover")
        .data(d => [
          d.fragments.reduce(
            (agg, v) => ({
              start: Math.min(agg.start, v.start),
              end: Math.max(agg.end, v.end),
              feature: d.feature
            }),
            { start: Infinity, end: -Infinity }
          )
        ])
        .enter()
        .append("line")
        .attr("class", "cover");

      this.featureChildren = locationChildrenG
        .selectAll("path.child-fragment")
        .data(d =>
          d.fragments.map(fragment =>
            Object.assign({}, fragment, {
              feature: d.feature,
              fragments: d.fragments
            })
          )
        )
        .enter()
        .append("path")
        .attr("class", f => this._getShape(f) + " child-fragment feature")
        .call(this.bindEvents, this)
        .on("click.expanded", (f, i, d) => {
          f.feature.expanded = !f.feature.expanded;
          this.refresh();
        });

      this.child_residues_g = this._createResidueGroup(this.childGroup);
      this.child_residues_loc = this._createResiduePaths(this.child_residues_g);
      if (this._coverage && this._coverage.length) this._createCoverage();
    }
    this.svg.attr("height", this._layoutObj.maxYPos);
    this._haveCreatedFeatures = true;
  }

  _createCoverage() {
    this._accession =
      (this._data && this._data[0] && this._data[0].accession) || "_";

    this.coverage_mask = this.svg
      .append("defs")
      .append("mask")
      .attr("id", `mask-${this._accession}`);

    this.coverageMaskFragment = this.coverage_mask
      .selectAll("rect")
      .data(this._coverage)
      .enter()
      .append("rect")
      .attr("y", 0)
      .attr("height", this._height);

    // this.coverage_g = this.svg.append("g").attr("class", "coverage-features");

    // this.coverageFragment = this.coverage_g
    //   .selectAll("rect.coverage-fragment")
    //   .data(this._coverage)
    //   .enter()
    //   .append("rect")
    //   .attr("class", "coverage-fragment")
    //   .attr("y", padding.top*2)
    //   .attr("height", COLLAPSED_HEIGHT);
  }
  _refreshCoverage() {
    // this.coverage_mask.attr("visibility", this._expanded ? "hidden" : "visible");
    this.featuresG.attr(
      "mask",
      this._expanded ? null : `url(#mask-${this._accession})`
    );
    this.coverageMaskFragment
      .attr("x", f => this.getXFromSeqPosition(f.start))
      .attr("width", f => this.getSingleBaseWidth() * (f.end - f.start + 1))
      .attr("fill", "white")
      // .attr("pointer-events", "none")
      .attr("opacity", f => f.value / this._contributors.length);

    // this.coverage_g.attr("visibility", this._expanded ? "hidden" : "visible");
    // this.coverageFragment
    //   .attr("x", f => this.getXFromSeqPosition(f.start))
    //   .attr("width", f => this.getSingleBaseWidth()*(f.end-f.start+1))
    //   .attr("fill", "white")
    //   .attr("pointer-events", "none")
    //   .attr("opacity", f=> 1 - f.value/this._contributors.length);
  }
  _refreshFeatures(base, expanded = true) {
    const numberOfSibillings = new Set(
      base.data().map(f => f.feature.accession)
    ).size;
    base
      .attr("d", f =>
        this._featureShape.getFeatureShape(
          this.getSingleBaseWidth(),
          this._layoutObj.getFeatureHeight(f.feature),
          f.end ? f.end - f.start + 1 : 1,
          expanded ? this._getShape(f.shape ? f : f.feature) : "rectangle"
        )
      )
      .attr("fill", f =>
        expanded ? this._getFeatureColor(f.feature) : "white"
      )
      .attr(
        "opacity",
        expanded ? 1 : MAX_OPACITY_WHILE_COLAPSED / numberOfSibillings
      )
      .attr("stroke", f =>
        expanded ? this._getFeatureColor(f.feature) : "none"
      )
      .attr(
        "transform",
        f =>
          "translate(" +
          this.getXFromSeqPosition(f.start) +
          "," +
          (padding.top + this._layoutObj.getFeatureYPos(f.feature)) +
          ")"
      )
      .style("pointer-events", expanded ? "auto" : "none");
  }

  _refreshCoverLine(base, expanded = true) {
    base
      .attr("x1", f => this.getXFromSeqPosition(f.start))
      .attr("x2", f => this.getXFromSeqPosition(f.end + 1))
      .attr(
        "y1",
        f =>
          padding.top +
          this._layoutObj.getFeatureYPos(f.feature) +
          this._layoutObj.getFeatureHeight(f.feature) / 2
      )
      .attr(
        "y2",
        f =>
          padding.top +
          this._layoutObj.getFeatureYPos(f.feature) +
          this._layoutObj.getFeatureHeight(f.feature) / 2
      )
      .attr("stroke", f => this._getFeatureColor(f.feature))
      .attr("visibility", expanded ? "visible" : "hidden");
  }

  refresh() {
    if (this._haveCreatedFeatures) {
      this._layoutObj.expanded = this._expanded;
      this._layoutObj.init(this._data, this._contributors);
      this.height = this._layoutObj.maxYPos;

      this._refreshCoverLine(this.coverLines);
      this._refreshFeatures(this.features);

      // this.residues_g.attr("visibility", this._expanded ? "visible" : "hidden");
      this._refreshResiduePaths(this.residues_loc, this._expanded);

      if (this._contributors) {
        this.childrenGroup.attr(
          "visibility",
          this._expanded ? "visible" : "hidden"
        );
        this._refreshCoverLine(this.coverLinesChildren, this._expanded);
        this._refreshFeatures(this.featureChildren, this._expanded);
        this.child_residues_g.attr("visibility", d =>
          this._expanded ? "visible" : "hidden"
        );
        this._refreshResiduePaths(this.child_residues_loc);
        if (this._coverage && this._coverage.length) this._refreshCoverage();
      }
      this._updateHighlight();
      this.svg.attr("height", this._layoutObj.maxYPos);
    }
  }
}
export default ProtvistaInterproTrack;
