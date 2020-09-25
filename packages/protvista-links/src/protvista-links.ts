import { interpolateRainbow, event as d3Event } from "d3";

import ProtvistaTrack from "protvista-track";
import { parseLinks, contactObjectToLinkList } from "./links-parser";

const OPACITY_MOUSEOUT = 0.3;

const getHighlightEvent = (
  type: string,
  target: ProtvistaLinks,
  residues?: Array<any>
): CustomEvent => {
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
  constructor() {
    super();
    this._threshold = 0.7;
    this._rawData = null;
  }

  set data(data: LinksData) {
    this._rawData = data;
    if (typeof data === "string") {
      this._data = parseLinks(data, this._threshold);
    } else if (Array.isArray(data)) {
      this._data = data;
    }
    this._createTrack();
  }

  get threshold(): number {
    return this._threshold;
  }

  set threshold(value: number) {
    this._threshold = +value;
    this._data = parseLinks(this._rawData, this._threshold);
  }

  _dispatchSelectNode(d: number) {
    this._data.selected = d;
    this.dispatchEvent(
      getHighlightEvent(
        "mouseover",
        this,
        Array.from(this._data.contacts[d])
          .concat(+d)
          .sort()
      )
    );
    this.refresh();
  }

  _createFeatures(): void {
    this.removeEventListener("click", this._resetEventHandler);

    this.seq_g.selectAll("g.contact-group").remove();
    const contactGroup = this.seq_g.append("g").attr("class", "contact-group");
    const linksGroup = this.seq_g.append("g").attr("class", "links-group");

    this.contactPoints = contactGroup
      .selectAll(".contact-point")
      .data(Object.keys(this._data.contacts))
      .enter()
      .append("circle")
      .attr("class", "contact-point")
      .attr("fill", (d: number) => interpolateRainbow(d / this._length))
      .attr("id", (d: number) => `cp_${d}`)
      .on("mouseover", (d: number) => {
        if (this._data.isHold) return;
        this._dispatchSelectNode(d);
      })
      .on("mouseout", () => {
        if (this._data.isHold) return;
        this._data.selected = undefined;
        this.dispatchEvent(getHighlightEvent("mouseout", this));
        this.refresh();
      })
      .on("click", (d: number) => {
        this._data.isHold = !this._data.isHold;
        if (!this._data.isHold) this._dispatchSelectNode(d);
      });

    this.contactLines = linksGroup
      .selectAll(".contact-link")
      .data(contactObjectToLinkList(this._data.contacts))
      .enter()
      .append("path")
      .attr("class", "contact-link")
      .attr("fill", "transparent")
      .attr("stroke", "black")
      .style("pointer-events", "none")
      .attr("id", ([n1, n2]: Array<number>) => `cn_${n1}_${n2}`);
  }

  getRadius(isSelected: boolean): number {
    return (
      (isSelected ? 0.6 : 0.4) *
      Math.max(2, Math.min(this.height, this.getSingleBaseWidth()))
    );
  }

  arc(d: number[]): string {
    const x1 = this.getXFromSeqPosition(d[0]) + this.getSingleBaseWidth() / 2;
    const x2 = this.getXFromSeqPosition(d[1]) + this.getSingleBaseWidth() / 2;
    const h = this.height * 0.5;
    // const r = (x2 + x1) / 2;
    const p = this.getSingleBaseWidth();
    return `M ${x1} ${h} C ${x1 - p} ${-h / 4} ${x2 + p} ${-h / 4} ${x2} ${h}`;
    // return `M ${x1} ${h} Q ${r} ${-h + 2} ${x2} ${h}`;
  }

  isLinkedWithSelected(position: number, selected: number): boolean {
    return (
      this.contactLines
        .data()
        .filter(
          ([n1, n2]: Array<number>) =>
            (n1 === +position && n2 === +selected) ||
            (n1 === +selected && n2 === +position)
        ).length > 0
    );
  }

  refresh(): void {
    this.contactPoints
      .attr(
        "cx",
        (d: number) =>
          this.getXFromSeqPosition(d) + this.getSingleBaseWidth() / 2
      )
      .transition()
      .attr("cy", this.height * 0.5)
      .attr("r", (d: number) => this.getRadius(d === this._data.selected))
      .style("opacity", (d: number) =>
        d === this._data.selected ||
        this.isLinkedWithSelected(d, this._data.selected)
          ? 1
          : OPACITY_MOUSEOUT
      );
    this.contactLines
      .attr("d", (d: number[]) => this.arc(d))
      .transition()
      .attr("stroke", interpolateRainbow(this._data.selected / this._length))
      .style("opacity", ([n1, n2]: Array<number>) =>
        +n1 === +this._data.selected || +n2 === +this._data.selected ? 1 : 0
      );
  }
}

export default ProtvistaLinks;
