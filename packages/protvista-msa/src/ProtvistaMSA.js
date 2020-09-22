import ProtvistaZoomable from "protvista-zoomable";
import { Region } from "protvista-utils";
import ReactMSAViewer from "react-msa-viewer";
import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { select } from "d3";

// This component is used internally to create a clickable
// label inside ProtvistaMSA
const TrackLabel = ({
  sequence,
  activeLabel,
  setActiveTrack,
  width,
  tileHeight,
}) => {
  const labelStyle = {
    width,
    height: tileHeight,
    textAlign: "left",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    fontWeight: "normal",
    fontSize: "14px",
    cursor: "pointer",
    boxSizing: "border-box",
    padding: "0 0.25rem",
    borderLeft: "0.2rem solid transparent",
    color: "#00639A",
    textTransform: "uppercase",
    flexShrink: 0,
  };

  const activeLabelStyle = {
    ...labelStyle,
    fontWeight: "bold",
    borderLeft: "0.2rem solid #00639A",
  };

  const labelRef = useRef(null);
  useEffect(() => {
    labelRef.current.addEventListener("click", () =>
      setActiveTrack(sequence.name)
    );
  }, [labelRef]);

  return (
    <span
      style={sequence.name === activeLabel ? activeLabelStyle : labelStyle}
      ref={labelRef}
    >
      {sequence.name}
    </span>
  );
};

const getNumberOfInsertionsBeforeIndex = (sequence, index) =>
  (sequence.slice(0, index - 1).match(/-/g) || []).length;

const coordinateStyle = {
  fontSize: "14px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  flexShrink: 0,
  justifyContent: "center",
};

const leftCoordinateStyle = {
  ...coordinateStyle,
  textAlign: "right",
  paddingRight: "0.25rem",
};
const rightCoordinateStyle = {
  ...coordinateStyle,
  paddingLeft: "0.25rem",
};

const Coordinate = ({
  children: coord,
  width,
  tileHeight,
  sequence,
  style,
  excludeGaps = true,
  offsetStart = false,
}) => (
  <div
    style={{
      ...style,
      width,
      height: tileHeight,
    }}
  >
    {coord -
      (excludeGaps &&
        getNumberOfInsertionsBeforeIndex(sequence.sequence, coord)) +
      (offsetStart && sequence.start && sequence.start)}
  </div>
);

class ProtvistaMSA extends ProtvistaZoomable {
  constructor() {
    super();
    this.setActiveTrack = this.setActiveTrack.bind(this);
  }

  static get properties() {
    return {
      onActiveTrackChange: { type: Function },
    };
  }

  connectedCallback() {
    super.connectedCallback();

    if (this.hasAttribute("activeLabel")) {
      this.activeLabel = this.getAttribute("activeLabel");
    }
  }

  static get observedAttributes() {
    return ProtvistaZoomable.observedAttributes.concat([
      "labelwidth",
      "activeLabel",
      "colorscheme",
      "calculate-conservation",
      "overlay-conservation",
      "sample-size-conservation",
      "text-font",
      "coordinate-width",
      "coordinate-left",
      "coordinate-right",
      "coordinate-exclude-gaps",
      "coordinate-offset-seq-start",
    ]);
  }

  get activeLabel() {
    return this.getAttribute("activeLabel");
  }

  set activeLabel(value) {
    this.setAttribute("activeLabel", value);
  }

  setActiveTrack(newValue) {
    this.setAttribute("activeLabel", newValue);

    if (this.onActiveTrackChange) {
      this.onActiveTrackChange(newValue);
    }

    this.refresh();
  }

  set data(_data) {
    this._data = _data;
    this.refresh();
    window.requestAnimationFrame(() => {
      this.svg = select(this).select("div");
    });
  }

  // eslint-disable-next-line class-methods-use-this
  get margin() {
    return {
      top: 10,
      right: 10,
      bottom: 10,
      left: this._labelwidth + this["_coordinate-width"] || 10,
    };
  }

  getCoordinateWidth() {
    return (
      (this["_coordinate-width"] || 0) *
      (this.hasAttribute("coordinate-left") +
        this.hasAttribute("coordinate-right"))
    );
  }

  getColorMap() {
    return this?.el?.getColorMap() || {};
  }
  getWidthWithMargins() {
    const coordinateWidth = this.getCoordinateWidth();
    return this.width
      ? this.width -
          (this._labelwidth || 0) -
          coordinateWidth -
          this.margin.left -
          this.margin.right
      : 0;
  }

  refresh() {
    if (!this.activeLabel && this._data && this._data[0]) {
      this.setActiveTrack(this._data[0].name);
    }
    const tileHeight = 20;
    const options = {
      sequences: this._data,
      height: this._height,
      width: this.getWidthWithMargins(),
      tileHeight,
      tileWidth: Math.max(1, this.getSingleBaseWidth()),
      colorScheme: this._colorscheme || "clustal",
      layout: "nightingale",
      sequenceOverflow: "scroll",
      sequenceOverflowX: "hidden",
      sequenceDisableDragging: true,
      style: {
        paddingLeft: `${this.margin.left || 0}px`,
      },
      labelComponent: ({ sequence }) =>
        TrackLabel({
          sequence: sequence,
          activeLabel: this.activeLabel,
          setActiveTrack: this.setActiveTrack,
          width: this._labelwidth,
          tileHeight: tileHeight,
        }),
    };

    if (this.hasAttribute("calculate-conservation")) {
      options.calculateConservation = true;
    }
    if (this.hasAttribute("overlay-conservation")) {
      options.overlayConservation = true;
    }
    if (this["_sample-size-conservation"] > 0) {
      options.sampleSizeConservation = this["_sample-size-conservation"];
    }
    if (this["_text-font"] > 0) {
      options.sequenceTextFont = this.getAttribute("text-font");
    }

    if (this.hasAttribute("coordinate-left")) {
      options.leftCoordinateComponent = ({ start, tileHeight, sequence }) => (
        <Coordinate
          width={this["_coordinate-width"]}
          tileHeight={tileHeight}
          sequence={sequence}
          style={leftCoordinateStyle}
          excludeGaps={this.getAttribute("coordinate-exclude-gaps") == "true"}
          offsetStart={
            this.getAttribute("coordinate-offset-seq-start") == "true"
          }
        >
          {start}
        </Coordinate>
      );
    }
    if (this.hasAttribute("coordinate-right")) {
      options.rightCoordinateComponent = ({ end, tileHeight, sequence }) => (
        <Coordinate
          width={this["_coordinate-width"]}
          tileHeight={tileHeight}
          sequence={sequence}
          style={rightCoordinateStyle}
          excludeGaps={this.getAttribute("coordinate-exclude-gaps") == "true"}
          offsetStart={
            this.getAttribute("coordinate-offset-seq-start") == "true"
          }
        >
          {end}
        </Coordinate>
      );
    }
    ReactDOM.render(
      <ReactMSAViewer {...options} ref={(ref) => (this.el = ref)} />,
      this
    );
    window.requestAnimationFrame(() => {
      if (this.el) {
        this.el.updatePositionByResidue({ aaPos: this._displaystart });
        if (1 > this.getSingleBaseWidth()) {
          this.dispatchEvent(
            // Dispatches the event so the manager can propagate this changes to other  components
            new CustomEvent("change", {
              detail: {
                displaystart: this._displaystart,
                displayend: this._displaystart + this.xScale.range()[1],
              },
              bubbles: true,
              cancelable: true,
            })
          );
        }
        this.highlight();
      }
    });
  }

  highlight() {
    window.requestAnimationFrame(() => {
      if (this._highlight && this._highlight !== "0:0") {
        const region = new Region({
          min: 1,
          max: this._data?.[0]?.sequence?.length || 1,
        });
        region.decode(this._highlight);
        this.el.highlightRegion(
          region.segments.map(({ start, end }) => ({
            sequences: {
              from: 0,
              to: this._data.length,
            },
            residues: {
              from: start,
              to: end,
            },
          }))
        );
      } else {
        this.el.removeHighlightRegion();
      }
    });
  }
}

export default ProtvistaMSA;
