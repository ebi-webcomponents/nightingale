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
      left: 10,
    };
  }

  getColorMap() {
    return this?.el?.getColorMap() || {};
  }

  getWidthWithMargins() {
    return this.width
      ? this.width -
          (this._labelwidth || 0) -
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
          sequence,
          activeLabel: this.activeLabel,
          setActiveTrack: this.setActiveTrack,
          width: this._labelwidth,
          tileHeight,
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

    ReactDOM.render(
      <ReactMSAViewer {...options} ref={(ref) => (this.el = ref)} />,
      this
    );
    window.requestAnimationFrame(() => {
      if (this.el && this.svg) {
        this.el.updatePositionByResidue({ aaPos: this._displaystart });
        if (this.getSingleBaseWidth() < 1) {
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
