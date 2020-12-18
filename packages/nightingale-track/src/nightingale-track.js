import { select } from "d3";
import _includes from "lodash-es/includes";
import _groupBy from "lodash-es/groupBy";
import _union from "lodash-es/union";
import _intersection from "lodash-es/intersection";

import NightingaleZoomable from "@nightingale-elements/nightingale-zoomable";
import FeatureShape from "./FeatureShape";
import NonOverlappingLayout from "./NonOverlappingLayout";
import DefaultLayout from "./DefaultLayout";
import { getShapeByType, getColorByType } from "./ConfigHelper";

class NightingaleTrack extends NightingaleZoomable {
  static is = "nightingale-track";

  getLayout() {
    if (String(this.getAttribute("layout")).toLowerCase() === "non-overlapping")
      return new NonOverlappingLayout({
        layoutHeight: this._height,
      });
    return new DefaultLayout({
      layoutHeight: this._height,
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this._color = this.getAttribute("color");
    this._shape = this.getAttribute("shape");
    this._featureShape = new FeatureShape();
    this._layoutObj = this.getLayout();

    if (this._data) this._createTrack();

    this.addEventListener("load", (e) => {
      if (_includes(this.children, e.target)) {
        this.data = e.detail.payload;
      }
    });
  }

  static normalizeLocations(data) {
    return data.map((obj) => {
      const { locations, start, end } = obj;
      return locations
        ? obj
        : Object.assign(obj, {
            locations: [
              {
                fragments: [
                  {
                    start,
                    end,
                  },
                ],
              },
            ],
          });
    });
  }

  processData(data) {
    this._originalData = NightingaleTrack.normalizeLocations(data);
  }

  set data(data) {
    this.processData(data);
    this._applyFilters();
    this._layoutObj = this.getLayout();
    this._createTrack();
  }

  set filters(filters) {
    this._filters = filters;
    this._applyFilters();
    this._createTrack();
  }

  static get observedAttributes() {
    return NightingaleZoomable.observedAttributes.concat([
      "color",
      "shape",
      "filters",
      "layout",
    ]);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "layout") {
      this._applyFilters();
      this._layoutObj = this.getLayout();
      this._createTrack();
    }
  }

  _getFeatureColor(f) {
    if (f.color) {
      return f.color;
    }
    if (f.feature && f.feature.color) {
      return f.feature.color;
    }
    if (this._color) {
      return this._color;
    }
    if (f.type) {
      return getColorByType(f.type);
    }
    if (f.feature && f.feature.type) {
      return getColorByType(f.feature.type);
    }
    return "black";
  }

  _getFeatureFillColor(f) {
    if (f.fill) {
      return f.fill;
    }
    if (f.feature && f.feature.fill) {
      return f.feature.fill;
    }
    return this._getFeatureColor(f);
  }

  _getShape(f) {
    if (f.shape) {
      return f.shape;
    }
    if (f.feature && f.feature.shape) {
      return f.feature.shape;
    }
    if (this._shape) {
      return this._shape;
    }
    if (f.type) {
      return getShapeByType(f.type);
    }
    if (f.feature && f.feature.type) {
      return getShapeByType(f.feature.type);
    }
    return "rectangle";
  }

  _createTrack() {
    if (!this._data) {
      return;
    }
    this._layoutObj.init(this._data);

    select(this).selectAll("div").remove();

    this.svg = select(this)
      .append("div")
      .style("line-height", 0)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this._height);

    this.trackHighlighter.appendHighlightTo(this.svg);

    this.seq_g = this.svg.append("g").attr("class", "sequence-features");

    this._createFeatures();
  }

  _createFeatures() {
    this.featuresG = this.seq_g.selectAll("g.feature-group").data(this._data);

    this.locations = this.featuresG
      .enter()
      .append("g")
      .attr("class", "feature-group")
      .attr("id", (d) => `g_${d.accession}`)
      .selectAll("g.location-group")
      .data((d) =>
        d.locations.map((loc) =>
          Object.assign({}, loc, {
            feature: d,
          })
        )
      )
      .enter()
      .append("g")
      .attr("class", "location-group");

    const fragmentGroup = this.locations
      .selectAll("g.fragment-group")
      .data((d) =>
        d.fragments.map((loc) =>
          Object.assign({}, loc, {
            feature: d.feature,
          })
        )
      )
      .enter()
      .append("g")
      .attr("class", "fragment-group");

    fragmentGroup
      .append("path")
      .attr("class", (f) => `${this._getShape(f)} feature`)
      .attr("d", (f) =>
        this._featureShape.getFeatureShape(
          this.getSingleBaseWidth(),
          this._layoutObj.getFeatureHeight(f),
          f.end ? f.end - f.start + 1 : 1,
          this._getShape(f)
        )
      )
      .attr(
        "transform",
        (f) =>
          `translate(${this.getXFromSeqPosition(
            f.start
          )},${this._layoutObj.getFeatureYPos(f.feature)})`
      )
      .attr("fill", (f) => this._getFeatureFillColor(f))
      .attr("stroke", (f) => this._getFeatureColor(f))
      .style("fill-opacity", ({ feature }) =>
        feature.opacity ? feature.opacity : 0.9
      )
      .style("stroke-opacity", ({ feature }) =>
        feature.opacity ? feature.opacity : 0.9
      );

    fragmentGroup
      .append("rect")
      .attr("class", "outer-rectangle feature")
      .attr(
        "width",
        (f) => this.getSingleBaseWidth() * (f.end ? f.end - f.start + 1 : 1)
      )
      .attr("height", (f) => this._layoutObj.getFeatureHeight(f))
      .attr(
        "transform",
        (f) =>
          `translate(${this.getXFromSeqPosition(
            f.start
          )},${this._layoutObj.getFeatureYPos(f.feature)})`
      )
      .attr("fill", "transparent")
      .attr("stroke", "transparent")
      .call(this.bindEvents, this);
  }

  _applyFilters() {
    if (!this._filters || this._filters.length <= 0) {
      this._data = this._originalData;
      return;
    }
    // Filters are OR-ed within a category and AND-ed between categories
    const groupedFilters = _groupBy(this._filters, "category");
    const filteredGroups = Object.values(groupedFilters).map((filterGroup) => {
      const filteredData = filterGroup.map((filterItem) =>
        filterItem.filterFn(this._originalData)
      );
      return _union(...filteredData);
    });
    const intersection = _intersection(...filteredGroups);
    this._data = intersection;
  }

  refresh() {
    if (this.xScale && this.seq_g) {
      const fragmentG = this.seq_g.selectAll("g.fragment-group").data(
        this._data.reduce(
          (acc, f) =>
            acc.concat(
              f.locations.reduce(
                (acc2, e) =>
                  acc2.concat(
                    e.fragments.map((loc) =>
                      Object.assign({}, loc, {
                        feature: f,
                      })
                    )
                  ),
                []
              )
            ),
          []
        )
      );

      fragmentG
        .selectAll("path.feature")
        .attr("d", (f) =>
          this._featureShape.getFeatureShape(
            this.getSingleBaseWidth(),
            this._layoutObj.getFeatureHeight(f),
            f.end ? f.end - f.start + 1 : 1,
            this._getShape(f)
          )
        )
        .attr(
          "transform",
          (f) =>
            `translate(${this.getXFromSeqPosition(
              f.start
            )},${this._layoutObj.getFeatureYPos(f.feature)})`
        );

      fragmentG
        .selectAll("rect.outer-rectangle")
        .attr(
          "width",
          (f) => this.getSingleBaseWidth() * (f.end ? f.end - f.start + 1 : 1)
        )
        .attr("height", (f) => this._layoutObj.getFeatureHeight(f))
        .attr(
          "transform",
          (f) =>
            `translate(${this.getXFromSeqPosition(
              f.start
            )},${this._layoutObj.getFeatureYPos(f.feature)})`
        );

      this._updateHighlight();
    }
  }

  _updateHighlight() {
    this.trackHighlighter.updateHighlight();
  }
}

export default NightingaleTrack;

export { DefaultLayout };
export { getColorByType };
