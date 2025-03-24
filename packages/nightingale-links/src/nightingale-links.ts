import { customElement, property } from "lit/decorators.js";
import { PropertyValues } from "lit";
import { scaleLinear, select, Selection } from "d3";

import NightingaleTrack from "@nightingale-elements/nightingale-track";
import {
  parseToRowData,
  contactObjectToLinkList,
  getContactsObject,
  filterContacts,
  ArrayOfNumberArray,
  ContactObject,
  LinksData,
} from "./links-parser";
import NightingaleElement from "@nightingale-elements/nightingale-new-core";

const OPACITY_MOUSEOUT = 0.4;
const DEFAULT_PROBABILITY = 0.7;

const d3Color = scaleLinear([0, 1], ["orange", "blue"]);

const getHighlightEvent = (
  type: string,
  target: NightingaleLinks,
  residues?: Array<number>,
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

@customElement("nightingale-links")
class NightingaleLinks extends NightingaleTrack {
  @property({ type: Number, attribute: "min-distance" })
  minDistance?: number = 0;

  @property({ type: Number, attribute: "min-probability" })
  minProbability?: number = DEFAULT_PROBABILITY;

  _rawData?: ArrayOfNumberArray | null = null;
  _linksData?: ArrayOfNumberArray | null = null;
  #contacts?: ContactObject;
  contactPoints?: Selection<SVGCircleElement, number, SVGGElement, unknown>;

  override willUpdate(changedProperties: PropertyValues<this>) {
    if (
      changedProperties.has("minDistance") ||
      changedProperties.has("minProbability")
    ) {
      if (this._rawData) {
        this.#contacts = getContactsObject(
          filterContacts(
            this._rawData,
            this.minDistance || 0,
            this.minProbability || DEFAULT_PROBABILITY,
          ),
        );
        this.createTrack();
      }
    }
  }

  set contacts(data: LinksData) {
    if (typeof data === "string") {
      this._rawData = parseToRowData(data);
    } else if (Array.isArray(data)) {
      this._rawData = data;
    } else {
      throw new Error("data is not in a valid format");
    }
    this.#contacts = getContactsObject(
      filterContacts(
        this._rawData,
        this.minDistance || 0,
        this.minProbability || DEFAULT_PROBABILITY,
      ),
    );
    this.createTrack();
  }
  get selected() {
    return this.#contacts?.selected;
  }

  protected override createTrack() {
    if (!this.#contacts) {
      return;
    }

    this.svg?.selectAll("g").remove();

    this.svg = select(this as unknown as NightingaleElement)
      .selectAll<SVGSVGElement, unknown>("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .on("click", (event: MouseEvent) => {
        if (!this.#contacts) return;
        if (
          !(event.target as HTMLElement)?.classList.contains("contact-point")
        ) {
          this.#contacts.selected = undefined;
          this.#contacts.isHold = false;
          this.refreshSelected();
        }
      });

    if (!this.svg) return;
    this.seqG = this.svg.append("g").attr("class", "sequence-features");
    this.createFeatures();
    // this.#highlighted = this.svg.append("g").attr("class", "highlighted");
    this.margins = this.svg.append("g").attr("class", "margin");
  }

  _getColor(d: number): string {
    if (!this.#contacts?.contacts[d]) return "";
    return d3Color(
      this.#contacts.contacts[d].size / this.#contacts.maxNumberOfContacts,
    );
  }

  _dispatchSelectNode(d: number): void {
    if (!this.#contacts) return;
    this.#contacts.selected = d;
    this.dispatchEvent(
      getHighlightEvent(
        "mouseover",
        this,
        Array.from(this.#contacts.contacts[d]).concat(+d).sort(),
      ),
    );
  }

  override createFeatures(): void {
    if (!this.#contacts) return;

    this.seqG?.selectAll("g.contact-group").remove();
    const contactGroup = this.seqG?.append("g").attr("class", "contact-group");
    this.seqG?.append("g").attr("class", "links-group");

    if (contactGroup)
      this.contactPoints = contactGroup
        .selectAll(".contact-point")
        .data(Object.keys(this.#contacts.contacts).map(Number))
        .enter()
        .append("circle")
        .attr("class", "contact-point")
        .attr("fill", (d: number) => this._getColor(d))
        .attr("id", (d: number) => `cp_${d}`)
        .style("stroke-width", 2)
        .on("mouseover", (_: Event, d: number) => {
          if (this.#contacts?.isHold) return;
          this._dispatchSelectNode(d);
          this.refreshSelected();
        })
        .on("mouseout", () => {
          if (!this.#contacts || this.#contacts?.isHold) return;
          this.#contacts.selected = undefined;
          this.dispatchEvent(getHighlightEvent("mouseout", this));
          this.refreshSelected();
        })
        .on("click", (event: Event, d: number) => {
          event.preventDefault();
          if (!this.#contacts) return;
          this.#contacts.isHold = true;
          this._dispatchSelectNode(d);
          this.refreshSelected();
        });
    this._linksData = contactObjectToLinkList(this.#contacts.contacts);
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

  refreshSelected(): void {
    if (!this.#contacts || !this.contactPoints) return;
    this.contactPoints
      .transition()
      .attr("r", (d: number) =>
        this.getRadius(
          d === this.#contacts?.selected ||
            this.#contacts?.contacts[d].has(this.#contacts?.selected || 0) ||
            false,
        ),
      )
      .attr("stroke", (d: number) =>
        d === this.#contacts?.selected && this.#contacts.isHold
          ? "rgb(127 255 127)"
          : null,
      )
      .style("opacity", (d: number) =>
        d === this.#contacts?.selected ? 1 : OPACITY_MOUSEOUT,
      );
    const selectedLinks = this.#contacts.selected
      ? this._linksData?.filter((link) =>
          link.includes(+(this.#contacts?.selected || 0)),
        ) || []
      : [];

    const links = this.seqG
      ?.selectAll<SVGAElement, ArrayOfNumberArray>("g.links-group")
      .selectAll(".contact-link")
      .data(selectedLinks, (x: unknown) => {
        const n1 = (x as number[])[0];
        const n2 = (x as number[])[1];
        return `${n1}_${n2}`;
      });

    links?.exit().remove();
    links
      ?.enter()
      .append("path")
      .attr("class", "contact-link")
      .attr("fill", "transparent")
      .attr("stroke", this._getColor(this.#contacts?.selected || 0))
      .attr("stroke-width", this.#contacts.isHold ? 3 : 1)
      .style("opacity", 1)
      .style("pointer-events", "none")
      .attr("d", (d: number[]) => this.arc(d))
      .attr("id", ([n1, n2]: Array<number>) => `cn_${n1}_${n2}`);

    links
      ?.attr("d", (d: number[]) => this.arc(d))
      .attr("stroke-width", this.#contacts.isHold ? 3 : 1);
  }
  override refresh(): void {
    if (!this.#contacts || !this.contactPoints) return;
    this.contactPoints
      .attr(
        "cx",
        (d: number) =>
          this.getXFromSeqPosition(d) + this.getSingleBaseWidth() / 2,
      )
      .attr("cy", this.height * 0.5);

    this.refreshSelected();
  }
}

export default NightingaleLinks;
