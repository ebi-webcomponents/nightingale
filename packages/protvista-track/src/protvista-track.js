import { select, event as d3Event } from "d3";
import _includes from "lodash-es/includes";
import FeatureShape from "./FeatureShape";
import NonOverlappingLayout from "./NonOverlappingLayout";
import DefaultLayout from "./DefaultLayout";
import ProtvistaZoomable from "protvista-zoomable";
import { config } from "./config";
import ConfigHelper from "./ConfigHelper";

class ProtvistaTrack extends ProtvistaZoomable {
  getLayout(data) {
    if (String(this.getAttribute("layout")).toLowerCase() === "non-overlapping")
      return new NonOverlappingLayout({
        layoutHeight: this._height
      });
    return new DefaultLayout({
      layoutHeight: this._height
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this._tooltipEvent = this.getAttribute("tooltip-event")
      ? this.getAttribute("tooltip-event")
      : "mouseover";
    this._color = this.getAttribute("color");
    this._shape = this.getAttribute("shape");
    this._featureShape = new FeatureShape();
    this._layoutObj = this.getLayout();
    this._config = new ConfigHelper(config);
    this.createTooltip = this.createTooltip.bind(this);

    if (this._data) this._createTrack();

    this.addEventListener("load", e => {
      if (_includes(this.children, e.target)) {
        this.data = e.detail.payload;
      }
    });
  }
  normalizeLocations(data) {
    return data.map(obj => {
      const { locations, start, end } = obj;
      return locations
        ? obj
        : Object.assign(obj, {
            locations: [
              {
                fragments: [
                  {
                    start,
                    end
                  }
                ]
              }
            ]
          });
    });
  }

  set data(data) {
    this._data = this.normalizeLocations(data);
    this._createTrack();
  }

  static get observedAttributes() {
    return ProtvistaZoomable.observedAttributes.concat([
      "highlightstart",
      "highlightend",
      "color",
      "shape",
      "layout"
    ]);
  }
  _getFeatureColor(f) {
    if (f.color) {
      return f.color;
    } else if (this._color) {
      return this._color;
    } else if (f.type) {
      return this._config.getColorByType(f.type);
    } else {
      return "black";
    }
  }

  _getShape(f) {
    if (f.shape) {
      return f.shape;
    } else if (this._shape) {
      return this._shape;
    } else if (f.type) {
      return this._config.getShapeByType(f.type);
    } else {
      return "rectangle";
    }
  }

  _createTrack() {
    this._layoutObj.init(this._data);

    select(this)
      .selectAll("svg")
      .remove();

    this.svg = select(this)
      .append("div")
      .style("line-height", 0)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this._height);

    this.trackHighlighter.appendHighlightTo(this.svg);

    this.seq_g = this.svg
      .append("g")
      .attr("class", "sequence-features")
      .attr("transform", "translate(0 ," + this.margin.top + ")");

    this._createFeatures();
    this.refresh();
  }

  _createFeatures() {
    this.featuresG = this.seq_g.selectAll("g.feature-group").data(this._data);

    this.locations = this.featuresG
      .enter()
      .append("g")
      .attr("class", "feature-group")
      .attr("id", d => `g_${d.accession}`)
      .selectAll("g.location-group")
      .data(d =>
        d.locations.map(loc =>
          Object.assign({}, loc, {
            feature: d
          })
        )
      )
      // .data(d => d.locations.map((loc) => ({ feature: d, ...l })))
      .enter()
      .append("g")
      .attr("class", "location-group");

    this.features = this.locations
      .selectAll("g.fragment-group")
      .data(d =>
        d.fragments.map(loc =>
          Object.assign({}, loc, {
            feature: d.feature
          })
        )
      )
      // .data(d => d.fragments.map(({ ...l }) => ({ feature: d.feature, ...l })))
      .enter()
      .append("path")
      .attr("class", "feature")
      .attr("tooltip-trigger", "true")
      .attr("d", f =>
        this._featureShape.getFeatureShape(
          this.getSingleBaseWidth(),
          this._layoutObj.getFeatureHeight(f),
          f.end ? f.end - f.start + 1 : 1,
          this._getShape(f.feature)
        )
      )
      .attr(
        "transform",
        f =>
          "translate(" +
          this.getXFromSeqPosition(f.start) +
          "," +
          (this.margin.top + this._layoutObj.getFeatureYPos(f.feature)) +
          ")"
      )
      .attr("fill", f => this._getFeatureColor(f.feature))
      .attr("stroke", f => this._getFeatureColor(f.feature))
      .on("mouseover", f => {
        var self = this;
        var e = d3Event;

        if (this._tooltipEvent === "mouseover") {
          window.setTimeout(function() {
            self.createTooltip(e, f);
          }, 50);
        }
        this.dispatchEvent(
          new CustomEvent("change", {
            detail: {
              highlightend: f.end,
              highlightstart: f.start,
              highlight: `${f.start}:${f.end}`
            },
            bubbles: true,
            cancelable: true
          })
        );
      })
      .on("mouseout", () => {
        var self = this;

        if (this._tooltipEvent === "mouseover") {
          window.setTimeout(function() {
            self.removeAllTooltips();
          }, 50);
        }
        this.dispatchEvent(
          new CustomEvent("change", {
            detail: {
              highlightend: null,
              highlightstart: null,
              highlight: null
            },
            bubbles: true,
            cancelable: true
          })
        );
      })
      .on("click", d => {
        if (this._tooltipEvent === "click") {
          this.createTooltip(d3Event, d, true);
        }
      });
  }

  createTooltip(e, d, closeable = false) {
    if (!d.feature || !d.feature.tooltipContent) {
      return;
    }
    this.removeAllTooltips();
    const tooltip = document.createElement("protvista-tooltip");
    tooltip.top = e.clientY + 3;
    tooltip.left = e.clientX + 2;
    tooltip.title = `${d.feature.type} ${d.start}-${d.end}`;
    tooltip.closeable = closeable;
    // Passing the content as a property as it can contain HTML
    tooltip.content = d.feature.tooltipContent;
    this.appendChild(tooltip);

    const parentWidth = this.svg._groups[0][0].clientWidth;
    const tooltipPosition = select(tooltip)
      .node()
      .getBoundingClientRect();

    if (tooltipPosition.width + tooltipPosition.x > parentWidth) {
      this.removeChild(tooltip);

      tooltip.left = parentWidth - tooltipPosition.width;
      tooltip.mirror = "H";

      this.appendChild(tooltip);
    }
  }

  removeAllTooltips() {
    document
      .querySelectorAll("protvista-tooltip")
      .forEach(tooltip => tooltip.remove());
  }

  refresh() {
    if (this.xScale && this.seq_g) {
      this.features = this.seq_g.selectAll("path.feature").data(
        this._data.reduce(
          (acc, f) =>
            acc.concat(
              f.locations.reduce(
                (acc2, e) =>
                  acc2.concat(
                    e.fragments.map(loc =>
                      Object.assign({}, loc, {
                        feature: f
                      })
                    )
                  ),
                []
              )
            ),
          []
        )
      );
      this.features
        .attr("d", f =>
          this._featureShape.getFeatureShape(
            this.getSingleBaseWidth(),
            this._layoutObj.getFeatureHeight(f),
            f.end ? f.end - f.start + 1 : 1,
            this._getShape(f.feature)
          )
        )
        .attr(
          "transform",
          f =>
            "translate(" +
            this.getXFromSeqPosition(f.start) +
            "," +
            (this.margin.top + this._layoutObj.getFeatureYPos(f.feature)) +
            ")"
        );
      this.trackHighlighter.updateHighlight();
    }
  }
  _updateHighlight() {
    this.trackHighlighter.updateHighlight();
  }
}

export default ProtvistaTrack;
