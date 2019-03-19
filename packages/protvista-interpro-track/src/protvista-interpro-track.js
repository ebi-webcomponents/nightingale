import ProtvistaTrack from "protvista-track";
import InterproEntryLayout from "./InterproEntryLayout";

const padding = {
  top: 2,
  right: 10,
  bottom: 2,
  left: 10
};

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
      .attr("class", "feature")
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
      .attr("stroke", "transparent");
  }

  _refreshResiduePaths(baseG) {
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
      .attr("fill", f => this._getFeatureColor(f));
  }

  _addHoverEvents(features, type = "entry") {
    features
      .on("mouseover", (f, i, d) => {
        this.dispatchEvent(
          new CustomEvent("change", {
            detail: { highlightend: f.end, highlightstart: f.start, type },
            bubbles: true,
            cancelable: true
          })
        );
        this.dispatchEvent(
          new CustomEvent("entrymouseover", {
            detail: Object.assign(f, { target: d[i], type }),
            bubbles: true,
            cancelable: true
          })
        );
      })
      .on("mouseout", (f, i, d) => {
        this.dispatchEvent(
          new CustomEvent("change", {
            detail: { highlightend: null, highlightstart: null, type },
            bubbles: true,
            cancelable: true
          })
        );
        this.dispatchEvent(
          new CustomEvent("entrymouseout", {
            detail: Object.assign(f, { type }),
            bubbles: true,
            cancelable: true
          })
        );
      });
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
        d.fragments.map(loc => Object.assign({}, loc, { feature: d.feature }))
      )
      .enter()
      .append("path")
      .attr("class", "feature")
      .on("click", (f, i, d) => {
        if (this._expanded) this.removeAttribute("expanded");
        else this.setAttribute("expanded", "expanded");
        this.dispatchEvent(
          new CustomEvent("entryclick", {
            detail: Object.assign(f, { target: d[i] }),
            bubbles: true,
            cancelable: true
          })
        );
      });

    this._addHoverEvents(this.features);
    this.residues_g = this._createResidueGroup(this.featuresG);
    this.residues_loc = this._createResiduePaths(this.residues_g);
    this._addHoverEvents(this.residues_loc, "residue");

    if (this._contributors) {
      this._contributors.forEach((d, i) => (d.k = i));
      if (!this.children_g)
        this.children_g = this.svg
          .append("g")
          .attr("class", "children-features");

      this.childrenGroup = this.children_g
        .append("g")
        .attr("class", "children-group")
        .attr("visibility", this._expanded ? "visible" : "hidden");
      this.childGroup = this.childrenGroup
        .selectAll("g.child-group")
        .data(d => this._contributors)
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
        .attr("class", "child-location-group");

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
            Object.assign({}, fragment, { feature: d.feature })
          )
        )
        .enter()
        .append("path")
        .attr("class", "child-fragment")
        .on("click", (f, i, d) => {
          f.feature.expanded = !f.feature.expanded;
          this.refresh();
          this.dispatchEvent(
            new CustomEvent("entryclick", {
              detail: Object.assign(f, { target: d[i] }),
              bubbles: true,
              cancelable: true
            })
          );
        });
      this._addHoverEvents(this.featureChildren);

      this.child_residues_g = this._createResidueGroup(this.childGroup);
      this.child_residues_loc = this._createResiduePaths(this.child_residues_g);
      this._addHoverEvents(this.child_residues_loc, "residue");
    }
    this.svg.attr("height", this._layoutObj.maxYPos);
    this._haveCreatedFeatures = true;
  }

  _refreshFeatures(base) {
    base
      .attr("d", f =>
        this._featureShape.getFeatureShape(
          this.getSingleBaseWidth(),
          this._layoutObj.getFeatureHeight(f.feature),
          f.end ? f.end - f.start + 1 : 1,
          this._getShape(f.shape ? f : f.feature)
        )
      )
      .attr("fill", f => this._getFeatureColor(f.feature))
      .attr("stroke", f => this._getFeatureColor(f.feature))
      .attr(
        "transform",
        f =>
          "translate(" +
          this.getXFromSeqPosition(f.start) +
          "," +
          (padding.top + this._layoutObj.getFeatureYPos(f.feature)) +
          ")"
      );
  }
  _refreshCoverLine(base) {
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
      .attr("stroke", f => this._getFeatureColor(f.feature));
  }

  refresh() {
    if (this._haveCreatedFeatures) {
      this._layoutObj.expanded = this._expanded;
      this._layoutObj.init(this._data, this._contributors);
      this.height = this._layoutObj.maxYPos;

      this._refreshCoverLine(this.coverLines);
      this._refreshFeatures(this.features);

      this.residues_g.attr("visibility", this._expanded ? "visible" : "hidden");
      this._refreshResiduePaths(this.residues_loc);

      if (this._contributors) {
        this.childrenGroup.attr(
          "visibility",
          this._expanded ? "visible" : "hidden"
        );
        this._refreshCoverLine(this.coverLinesChildren);
        this._refreshFeatures(this.featureChildren);
        this.child_residues_g.attr("visibility", d =>
          d.feature.expanded ? "visible" : "hidden"
        );
        this._refreshResiduePaths(this.child_residues_loc);
      }
      this._updateHighlight();
      this.svg.attr("height", this._layoutObj.maxYPos);
    }
  }
}
export default ProtvistaInterproTrack;
