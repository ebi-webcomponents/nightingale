import { schemePaired } from "d3";

import ProtvistaTrack from "protvista-track";
import linksParser from "./links-parser";

const OPACITY_MOUSEOUT = 0.3;

const getHighlightEvent = (type, target, residues) => {
  return new CustomEvent("change", {
    detail: {
      type,
      target,
      highlight: residues
        ? residues.map((fr) => `${fr}:${fr}`).join(",")
        : null,
    },
    bubbles: true,
    cancelable: true,
  });
};
class ProtvistaLinks extends ProtvistaTrack {
  set data(data) {
    if (typeof data === "string") {
      this._data = linksParser(data, 0.9);
    } else if (Array.isArray(data)) {
      this._data = data;
    }
    this._createTrack();
  }

  _createFeatures() {
    this.contactGroups = this.seq_g
      .selectAll("g.contact-group")
      .data(this._data.links)
      .enter()
      .append("g")
      .attr("class", "contact-group")
      .attr("id", (_, i) => `contact_group_${i}`);

    this.contactLines = this.contactGroups
      .append("line")
      .attr("class", "contact-line")
      .attr("stroke", (_, i) => schemePaired[i % 12]);

    this.contactPoints = this.contactGroups
      .selectAll(".contact-point")
      .data((d, i) => d.map((point) => ({ position: point, group: i })));
    this.contactPoints
      .enter()
      .append("circle")
      .attr("class", "contact-point")
      .attr("fill", (d) => schemePaired[d.group % 12])
      .attr("id", (d) => `cp_${d.position}`)
      .on("mouseover", (d) => {
        this._data.selected = d.group;
        this.dispatchEvent(
          getHighlightEvent("mouseover", this, this._data.links[d.group])
        );
        this.refresh();
      })
      .on("mouseout", () => {
        this._data.selected = undefined;
        this.dispatchEvent(getHighlightEvent("mouseout", this));
        this.refresh();
      });
  }

  getRadius(isSelected) {
    return (
      (isSelected ? 0.7 : 0.5) *
      Math.min(this._layoutObj.getFeatureHeight(), this.getSingleBaseWidth())
    );
  }

  refresh() {
    this.contactPoints
      .merge(this.contactPoints.enter())
      .selectAll(".contact-point")
      .attr(
        "cx",
        (d) =>
          this.getXFromSeqPosition(d.position) +
          this.getSingleBaseWidth() / 2 -
          this.getRadius(false)
      )
      .attr("cy", this._layoutObj.getFeatureHeight() / 2)
      .transition()
      .attr("r", (d) => this.getRadius(d.group === this._data.selected))
      .style("opacity", (d) =>
        d.group === this._data.selected ? 1 : OPACITY_MOUSEOUT
      );
    this.contactLines
      .attr("y1", this._layoutObj.getFeatureHeight() / 2)
      .attr("y2", this._layoutObj.getFeatureHeight() / 2)
      .attr(
        "x1",
        (d) => this.getXFromSeqPosition(d[0]) + this.getSingleBaseWidth() / 2
      )
      .attr(
        "x2",
        (d) =>
          this.getXFromSeqPosition(d[d.length - 1]) +
          this.getSingleBaseWidth() / 2
      )
      .transition()
      .style("opacity", (_, group) => (group === this._data.selected ? 1 : 0));
  }
}

export default ProtvistaLinks;
