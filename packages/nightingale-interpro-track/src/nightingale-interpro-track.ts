import { customElement, property } from "lit/decorators.js";
import { Selection } from "d3";
import { Feature } from "@nightingale-elements/nightingale-track";

import { bindEvents } from "@nightingale-elements/nightingale-new-core";
import NightingaleTrack from "@nightingale-elements/nightingale-track";
import InterproEntryLayout, { InterProFeature } from "./InterproEntryLayout";
import { getCoverage, Segment } from "./coverage";
import {
  ResidueGroup,
  ResidueDatum,
  createResidueGroup,
  createResiduePaths,
  refreshResiduePaths,
} from "./residues";
import { createCoverage, refreshCoverage } from "./coverage/render";

export type BaseGroup = Selection<
  SVGGElement,
  InterProFeature,
  HTMLElement | SVGElement | null,
  unknown
>;

const MAX_OPACITY_WHILE_COLAPSED = 0.8;

@customElement("nightingale-interpro-track")
class NightingaleInterproTrack extends NightingaleTrack {
  @property({ type: Boolean })
  expanded = false;

  layout = undefined;
  protected layoutObj?: InterproEntryLayout;
  #contributors?: InterProFeature[];
  #coverage?: Segment[];
  #haveCreatedFeatures = false;

  #childrenG?: Selection<
    SVGGElement,
    unknown,
    HTMLElement | SVGElement | null,
    unknown
  >;
  #featuresG?: BaseGroup;
  #residuesG?: ResidueGroup;
  #childResiduesG?: ResidueGroup;
  accession?: string;

  constructor() {
    super();
    this["margin-top"] = 2;
    this["margin-bottom"] = 2;
  }

  protected createTrack() {
    if (!this.layoutObj) return;
    this.layoutObj.expanded = this.expanded;
    this.#childrenG = undefined;
    super.createTrack();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#haveCreatedFeatures = false;
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "expanded" && oldValue !== newValue && this.#contributors) {
      for (const c of this.#contributors) {
        c.expanded = !oldValue;
      }
    }
  }

  set contributors(contributors: InterProFeature[]) {
    this.#contributors = NightingaleInterproTrack.normalizeLocations(
      contributors
    ) as InterProFeature[];
    this.#coverage = getCoverage(this.#contributors, this.length);
    if (this.data) this.createTrack();
  }

  getLayout() {
    return new InterproEntryLayout({
      layoutHeight: this.height,
      expanded: this.expanded,
      padding: (this["margin-top"] + this["margin-bottom"]) / 2,
    });
  }

  protected createFeatures() {
    if (!this.seqG) return;
    this.layoutObj?.init(this.data as InterProFeature[], this.#contributors);
    // eslint-disable-next-line
    this.data.forEach((d, i) => ((d as InterProFeature).k = i));
    this.#featuresG = this.seqG
      .selectAll<SVGGElement, InterProFeature>("g.feature-group")
      .data(this.data as InterProFeature[])
      .enter()
      .append("g")
      .attr("class", "feature-group")
      .attr("id", (d) => `g_${d.accession}`);

    const locations = this.#featuresG
      .selectAll("g.location-group")
      .data((d) => d.locations?.map((loc) => ({ ...loc, feature: d })) || [])
      .enter()
      .append("g")
      .attr("class", "location-group");

    locations
      .selectAll("line.cover")
      .data((d) => [
        d.fragments.reduce(
          (agg, v) => ({
            start: Math.min(agg.start, v.start),
            end: Math.max(agg.end, v.end),
            feature: d.feature,
          }),
          { start: Infinity, end: -Infinity }
        ),
      ])
      .enter()
      .append("line")
      .attr("class", "cover");

    locations
      .selectAll("path.feature")
      .data((d) =>
        d.fragments.map((loc) => ({
          ...loc,
          feature: d.feature,
          fragments: d.fragments,
        }))
      )
      .enter()
      .append("path")
      .attr("class", (f) => `${this.getShape(f)} feature`)
      .on("click.expanded", () => {
        if (this.expanded) this.removeAttribute("expanded");
        else this.setAttribute("expanded", "expanded");
      })
      .call(bindEvents, this);

    this.#residuesG = createResidueGroup(this.#featuresG);
    createResiduePaths({
      baseG: this.#residuesG,
      getResidueShape: (d) => this.getResidueShape(d),
      getResidueTransform: (d) => this.getResidueTransform(d),
      getResidueFill: (d) => this.getResidueFill(d, this.expanded),
      element: this,
    });

    if (this.#contributors) {
      // eslint-disable-next-line
      this.#contributors.forEach((d, i) => (d.k = i));
      if (!this.#childrenG)
        this.#childrenG = this.svg
          ?.append("g")
          .attr("class", "children-features");

      const childrenGroup = this.#childrenG
        ?.append("g")
        .attr("class", "children-group");
      const childGroup = childrenGroup
        ?.selectAll("g.child-group")
        .data(this.#contributors)
        .enter()
        .append("g")
        .attr("class", "child-group");
      if (!childGroup) return;
      const locationChildrenG = childGroup
        .selectAll("g.child-location-group")
        .data((d) => {
          // eslint-disable-next-line
          d.expanded = this.expanded;
          return (d.locations || []).map((loc) => ({ ...loc, feature: d }));
        })
        .enter()
        .append("g")
        .attr("class", (_, i) => `child-location-group clg-${i}`);

      locationChildrenG
        ?.selectAll("line.cover")
        .data((d) => [
          d.fragments.reduce(
            (agg, v) => ({
              start: Math.min(agg.start, v.start),
              end: Math.max(agg.end, v.end),
              feature: d.feature,
            }),
            { start: Infinity, end: -Infinity }
          ),
        ])
        .enter()
        .append("line")
        .attr("class", "cover");

      locationChildrenG
        ?.selectAll("path.child-fragment")
        .data((d) =>
          d.fragments.map((fragment) => ({
            ...fragment,
            feature: d.feature,
            fragments: d.fragments,
          }))
        )
        .enter()
        .append("path")
        .attr("class", (f) => `${this.getShape(f)} child-fragment feature`)
        .call(bindEvents, this)
        .on("click.expanded", (_event, f) => {
          // eslint-disable-next-line
          f.feature.expanded = !f.feature.expanded;
          this.refresh();
        });

      this.#childResiduesG = createResidueGroup(childGroup);
      // this.child_residuesLoc =
      createResiduePaths({
        baseG: this.#childResiduesG,
        getResidueShape: (d) => this.getResidueShape(d),
        getResidueTransform: (d) => this.getResidueTransform(d),
        getResidueFill: (d) => this.getResidueFill(d, d.feature?.expanded),
        element: this,
      });
      if (this.#coverage?.length)
        createCoverage({
          element: this,
          coverage: this.#coverage,
        });
    }
    this.svg?.attr("height", this.layoutObj?.maxYPos || 0);
    this.#haveCreatedFeatures = true;
  }
  private getResidueShape(f: ResidueDatum) {
    return this.featureShape.getFeatureShape(
      this.getSingleBaseWidth(),
      this.layoutObj?.getFeatureHeight(`${f.accession}_${f.k}_${f.i}_${f.j}`) ||
        0,
      f.end && f.start ? f.end - f.start + 1 : 1,
      "rectangle"
    );
  }
  private getResidueTransform(f: ResidueDatum) {
    return `translate(${this.getXFromSeqPosition(f.start || 1)},${
      this["margin-top"] +
      (this.layoutObj?.getFeatureYPos(`${f.accession}_${f.k}_${f.i}_${f.j}`) ||
        0)
    })`;
  }
  private getResidueFill(f: ResidueDatum, expanded: boolean) {
    return expanded ? this.getFeatureColor(f) : "white";
  }

  private refreshFeatures(base: BaseGroup, expanded = true) {
    const numberOfSibillings = new Set(
      base.data().map((f) => f.feature?.accession)
    ).size;
    base
      .attr("d", (f) =>
        this.featureShape.getFeatureShape(
          this.getSingleBaseWidth(),
          this.layoutObj?.getFeatureHeight(f.feature || "") || 0,
          f.end && f.start ? f.end - f.start + 1 : 1,
          expanded
            ? this.getShape(f.shape ? f : (f.feature as Feature))
            : "rectangle"
        )
      )
      .attr("fill", (f) =>
        expanded ? this.getFeatureColor(f.feature as Feature) : "white"
      )
      .attr(
        "opacity",
        expanded ? 1 : MAX_OPACITY_WHILE_COLAPSED / numberOfSibillings
      )
      .style("stroke", (f) =>
        expanded ? this.getFeatureColor(f.feature as Feature) : "none"
      )
      .attr(
        "transform",
        (f) =>
          `translate(${this.getXFromSeqPosition(f.start || 1)},${
            this["margin-top"] +
            (this.layoutObj?.getFeatureYPos(f.feature as Feature) || 0)
          })`
      )
      .style("pointer-events", expanded ? "auto" : "none");
  }

  private refreshCoverLine(base: BaseGroup, expanded = true) {
    base
      .attr("x1", (f) => this.getXFromSeqPosition(f.start || 1))
      .attr("x2", (f) => this.getXFromSeqPosition((f.end || 0) + 1))
      .attr(
        "y1",
        (f) =>
          this["margin-top"] +
          (this.layoutObj?.getFeatureYPos(f.feature as Feature) || 0) +
          (this.layoutObj?.getFeatureHeight(f.feature as Feature) || 0) / 2
      )
      .attr(
        "y2",
        (f) =>
          this["margin-top"] +
          (this.layoutObj?.getFeatureYPos(f.feature as Feature) || 0) +
          (this.layoutObj?.getFeatureHeight(f.feature as Feature) || 0) / 2
      )
      .attr("stroke", (f) => this.getFeatureColor(f.feature as Feature))
      .attr("visibility", expanded ? "visible" : "hidden");
  }

  refresh() {
    if (this.#haveCreatedFeatures && this.layoutObj) {
      this.layoutObj.expanded = this.expanded;
      this.layoutObj.init(this.data as InterProFeature[], this.#contributors);
      this.height = this.layoutObj.maxYPos;

      this.refreshCoverLine(
        this.#featuresG?.selectAll("g.location-group line.cover") as BaseGroup
      );
      this.refreshFeatures(
        this.#featuresG?.selectAll("g.location-group path.feature") as BaseGroup
      );

      // this.#residuesG?.attr("visibility", this.expanded ? "visible" : "hidden");
      if (this.#residuesG)
        refreshResiduePaths({
          baseG: this.#residuesG,
          expanded: this.expanded,
          getResidueShape: (d) => this.getResidueShape(d),
          getResidueTransform: (d) => this.getResidueTransform(d),
          getResidueFill: (d) => this.getResidueFill(d, this.expanded),
        });

      if (this.#contributors) {
        const childrenGroup = this.#childrenG?.select("g.children-group");
        childrenGroup?.attr("visibility", this.expanded ? "visible" : "hidden");
        const childGroup = childrenGroup?.selectAll("g.child-group");
        const locationChildrenG = childGroup?.selectAll(
          "g.child-location-group"
        );
        const coverLinesChildren = locationChildrenG?.selectAll("line.cover");
        const featureChildren = locationChildrenG?.selectAll(
          "path.child-fragment"
        );

        this.refreshCoverLine(
          coverLinesChildren as unknown as BaseGroup,
          this.expanded
        );
        this.refreshFeatures(
          featureChildren as unknown as BaseGroup,
          this.expanded
        );
        this.#childResiduesG?.attr("visibility", () =>
          this.expanded ? "visible" : "hidden"
        );
        if (this.#childResiduesG)
          refreshResiduePaths({
            baseG: this.#childResiduesG,
            expanded: this.expanded,
            getResidueShape: (d) => this.getResidueShape(d),
            getResidueTransform: (d) => this.getResidueTransform(d),
            getResidueFill: (d) => this.getResidueFill(d, d.feature?.expanded),
          });

        if (this.#coverage?.length)
          refreshCoverage({
            element: this,
            featuresG: this.#featuresG,
            contributorsLength: this.#contributors?.length,
          });
      }
      this.svg?.attr("height", this.layoutObj.maxYPos);
      this.updateHighlight();
    }
  }
}
export default NightingaleInterproTrack;
