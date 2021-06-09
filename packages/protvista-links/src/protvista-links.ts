import { scaleLinear } from "d3";

import ProtvistaTrack from "protvista-track";
import {
  parseToRowData,
  contactObjectToLinkList,
  getContactsObject,
  filterContacts,
} from "./links-parser";

const OPACITY_MOUSEOUT = 0.4;

const d3Color = scaleLinear([0, 1], ["orange", "blue"]);

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
  _minDistance: number;

  _minProbability: number;

  _rawData?: ArrayOfNumberArray;

  _linksData?: ArrayOfNumberArray;

  _data?: ContactObject;

  // TODO: this types should be inherit from track
  width: number;

  height: number;

  _resetEventHandler: (evt: Event) => void;

  _createTrack: () => void;

  getSingleBaseWidth: () => number;

  getXFromSeqPosition: (position: number) => number;

  // TODO: This types should come from D3
  // eslint-disable-next-line camelcase
  seq_g?: any;

  _linksGroup: any;

  contactPoints: any;

  constructor() {
    super();
    this._minDistance = 0;
    this._minProbability = 0.7;
    this._rawData = null;
    this._linksData = null;
  }

  static get observedAttributes(): Array<string> {
    return ProtvistaTrack.observedAttributes.concat(
      "mindistance",
      "minprobability"
    );
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    if (name === "mindistance" && oldValue !== newValue) {
      this.minDistance = +newValue;
    } else if (name === "minprobability" && oldValue !== newValue) {
      this.minProbability = +newValue;
    } else {
      super.attributeChangedCallback(name, oldValue, newValue);
    }
  }

  set data(data: LinksData) {
    if (typeof data === "string") {
      this._rawData = parseToRowData(data);
    } else if (Array.isArray(data)) {
      this._rawData = data;
    } else {
      throw new Error("data is not in a valid format");
    }
    this._data = getContactsObject(
      filterContacts(this._rawData, this._minDistance, this._minProbability)
    );
    this._createTrack();
  }

  get minDistance(): number {
    return this._minDistance;
  }

  set minDistance(value: number) {
    this._minDistance = +value;
    if (this._rawData) {
      this._data = getContactsObject(
        filterContacts(this._rawData, this._minDistance, this._minProbability)
      );
      this._createTrack();
    }
  }

  get minProbability(): number {
    return this._minProbability;
  }

  set minProbability(value: number) {
    this._minProbability = +value;
    if (this._rawData) {
      this._data = getContactsObject(
        filterContacts(this._rawData, this._minDistance, this._minProbability)
      );
      this._createTrack();
    }
  }

  _getColor(d: number): string {
    if (!this._data.contacts[d]) return "";
    return d3Color(
      this._data.contacts[d].size / this._data.maxNumberOfContacts
    );
  }

  _dispatchSelectNode(d: number): void {
    this._data.selected = d;
    (this as any).dispatchEvent(
      getHighlightEvent(
        "mouseover",
        this,
        Array.from(this._data.contacts[d])
          .concat(+d)
          .sort()
      )
    );
  }

  _createFeatures(): void {
    (this as any).removeEventListener("click", this._resetEventHandler);

    this.seq_g.selectAll("g.contact-group").remove();
    const contactGroup = this.seq_g.append("g").attr("class", "contact-group");
    this._linksGroup = this.seq_g.append("g").attr("class", "links-group");

    this.contactPoints = contactGroup
      .selectAll(".contact-point")
      .data(Object.keys(this._data.contacts))
      .enter()
      .append("circle")
      .attr("class", "contact-point")
      .attr("fill", (d: number) => this._getColor(d))
      .attr("id", (d: number) => `cp_${d}`)
      .style("stroke-width", 2)
      .on("mouseover", (d: number) => {
        if (this._data.isHold) return;
        this._dispatchSelectNode(d);
        this.refresh();
      })
      .on("mouseout", () => {
        if (this._data.isHold) return;
        this._data.selected = undefined;
        (this as any).dispatchEvent(getHighlightEvent("mouseout", this));
        this.refresh();
      })
      .on("click", (d: number) => {
        this._data.isHold = !this._data.isHold;
        if (!this._data.isHold) this._dispatchSelectNode(d);
        this.refresh();
      });
    this._linksData = contactObjectToLinkList(this._data.contacts);
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
    const p = this.getSingleBaseWidth();
    return `M ${x1} ${h} C ${x1 - p} ${-h / 4} ${x2 + p} ${-h / 4} ${x2} ${h}`;
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
      .attr("stroke", (d: number) =>
        d === this._data.selected && this._data.isHold
          ? "rgb(127 255 127)"
          : undefined
      )
      .style("opacity", (d: number) =>
        d === this._data.selected ? 1 : OPACITY_MOUSEOUT
      );

    const selectedLinks = this._data.selected
      ? this._linksData.filter((link) => link.includes(+this._data.selected))
      : [];

    const links = this._linksGroup
      .selectAll(".contact-link")
      .data(selectedLinks, ([n1, n2]: Array<number>) => `${n1}_${n2}`);

    links.exit().remove();
    links
      .enter()
      .append("path")
      .attr("class", "contact-link")
      .attr("fill", "transparent")
      .attr("stroke", this._getColor(this._data.selected))
      .style("opacity", 1)
      .style("pointer-events", "none")
      .attr("d", (d: number[]) => this.arc(d))
      .attr("id", ([n1, n2]: Array<number>) => `cn_${n1}_${n2}`);

    links.attr("d", (d: number[]) => this.arc(d));
  }
}

export default ProtvistaLinks;
