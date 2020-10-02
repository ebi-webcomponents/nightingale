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
    this.marginleft = 0;
    this.marginright = 0;
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
      "hidelabel",
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

  getColorMap() {
    return this?.el?.getColorMap() || {};
  }

  getWidthWithMargins() {
    if (!this.width) {
      return 0;
    }
    if (this._hidelabel) {
      return this.width;
    }
    return (
      this.width -
      (this._labelwidth || 0) -
      this.margin.left -
      this.margin.right
    );
  }

  refresh() {
    if (!this._hidelabel && !this.activeLabel && this._data && this._data[0]) {
      this.setActiveTrack(this._data[0].name);
    }
    const tileHeight = 20;
    const tileWidth = Math.max(1, this.getSingleBaseWidth());
    const options = {
      sequences: this._data,
      height: this._height,
      width: this.getWidthWithMargins(),
      tileHeight,
      tileWidth,
      colorScheme: this._colorscheme || "clustal",
      layout: "nightingale",
      sequenceOverflow: "scroll",
      sequenceOverflowX: "hidden",
      sequenceDisableDragging: true,
      highlight: null,
      position: {
        xPos: (this._displaystart - 1) * tileWidth,
      },
      style: {
        paddingLeft: `${this._hidelabel ? 0 : this.margin.left || 0}px`,
      },
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

    if (!this._hidelabel) {
      options.labelComponent = ({ sequence }) =>
        TrackLabel({
          sequence,
          activeLabel: this.activeLabel,
          setActiveTrack: this.setActiveTrack,
          width: this._labelwidth,
          tileHeight,
        });
    }

    if (this._highlight && this._highlight !== "0:0") {
      const region = new Region({
        min: 1,
        max: this._data?.[0]?.sequence?.length || 1,
      });
      region.decode(this._highlight);
      options.highlight = region.segments.map(({ start, end }) => ({
        sequences: {
          from: 0,
          to: this._data.length,
        },
        residues: {
          from: start,
          to: end,
        },
      }));
    }

    ReactDOM.render(
      <ReactMSAViewer {...options} ref={(ref) => (this.el = ref)} />,
      this
    );
  }
}

export default ProtvistaMSA;
