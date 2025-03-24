import { customElement, property } from "lit/decorators.js";
import { Selection, select } from "d3";
import _get from "lodash-es/get";
import { Feature } from "@nightingale-elements/nightingale-track";

import {
  bindEvents,
  contrastingColor,
} from "@nightingale-elements/nightingale-new-core";
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
export type LabelGroup = Selection<
  SVGTextContentElement,
  InterProFeature,
  HTMLElement | SVGElement | null,
  unknown
>;

const MAX_OPACITY_WHILE_COLAPSED = 0.8;

const colorCache: Record<string, number[] | null> = {};

function colorKeywordToRGB(colorKeyword: string) {
  if (colorCache[colorKeyword]) return colorCache[colorKeyword];

  const el = document.createElement("div");
  el.style.color = colorKeyword;
  document.body.appendChild(el);
  const rgbValue = window.getComputedStyle(el).color;
  document.body.removeChild(el);
  const res = rgbValue?.match(/[.\d]+/g)?.map(Number) || null;
  colorCache[colorKeyword] = res;
  return res;
}

@customElement("nightingale-interpro-track")
class NightingaleInterproTrack extends NightingaleTrack {
  @property({ type: Boolean })
  expanded?: boolean = false;
  @property({ type: Boolean })
  "show-label"?: boolean = false;
  @property({ type: String })
  label?: string | null = null;

  protected override layoutObj?: InterproEntryLayout;
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

  protected override createTrack() {
    if (!this.layoutObj) return;
    this.layoutObj.expanded = !!this.expanded;
    this.#childrenG = undefined;
    super.createTrack();
    this.zoomRefreshed();
  }

  override connectedCallback() {
    super.connectedCallback();
    this.#haveCreatedFeatures = false;
  }

  override attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
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
      contributors,
    ) as InterProFeature[];
    this.#coverage = getCoverage(this.#contributors, this.length);
    if (this.data) this.createTrack();
  }

  override getLayout() {
    return new InterproEntryLayout({
      layoutHeight: this.height,
      expanded: !!this.expanded,
      padding: (this["margin-top"] + this["margin-bottom"]) / 2,
    });
  }

  protected override createFeatures() {
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
      .attr("class", "location-group")
      .style("cursor", this.#contributors ? "pointer" : "default");

    locations
      .selectAll("line.cover")
      .data((d) => [
        d.fragments.reduce(
          (agg, v) => ({
            start: Math.min(agg.start, v.start),
            end: Math.max(agg.end, v.end),
            feature: d.feature,
          }),
          { start: Infinity, end: -Infinity },
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
        })),
      )
      .enter()
      .append("path")
      .attr("class", (f) => `${this.getShape(f)} feature`)
      .on("click.expanded", () => {
        if (this.expanded) this.removeAttribute("expanded");
        else this.setAttribute("expanded", "expanded");
      })
      .call(bindEvents, this);

    locations
      .selectAll("text.feature-label")
      .data((d) =>
        d.fragments.map((loc) => ({
          ...loc,
          feature: d.feature,
          fragments: d.fragments,
        })),
      )
      .enter()
      .append("text")
      .attr("class", "feature-label")
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .style("cursor", "inherit")
      .style("pointer-events", "none");

    this.#residuesG = createResidueGroup(this.#featuresG);
    createResiduePaths({
      baseG: this.#residuesG,
      getResidueShape: (d) => this.getResidueShape(d),
      getResidueTransform: (d) => this.getResidueTransform(d),
      getResidueFill: (d) => this.getResidueFill(d, !!this.expanded),
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
            { start: Infinity, end: -Infinity },
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
          })),
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
      locationChildrenG
        .selectAll("text.child-label")
        .data((d) =>
          d.fragments.map((fragment) => ({
            ...fragment,
            feature: d.feature,
            fragments: d.fragments,
          })),
        )
        .enter()
        .append("text")
        .attr("class", "child-label")
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "middle")
        .style("cursor", "default")
        .style("pointer-events", "none");

      this.#childResiduesG = createResidueGroup(childGroup);
      // this.child_residuesLoc =
      createResiduePaths({
        baseG: this.#childResiduesG,
        getResidueShape: (d) => this.getResidueShape(d),
        getResidueTransform: (d) => this.getResidueTransform(d),
        getResidueFill: (d) => this.getResidueFill(d, !!d.feature?.expanded),
        element: this,
      });
      if (this.#coverage?.length)
        createCoverage({
          element: this,
          coverage: this.#coverage,
        });
    }
    this.svg?.attr(
      "height",
      (this.layoutObj?.maxYPos || 0) + this["margin-bottom"],
    );
    this.#haveCreatedFeatures = true;
  }
  private getResidueShape(f: ResidueDatum) {
    return this.featureShape.getFeatureShape(
      this.getSingleBaseWidth(),
      this.layoutObj?.getFeatureHeight(`${f.accession}_${f.k}_${f.i}_${f.j}`) ||
      0,
      f.end && f.start ? f.end - f.start + 1 : 1,
      "rectangle",
    );
  }
  private getResidueTransform(f: ResidueDatum) {
    return `translate(${this.getXFromSeqPosition(f.start || 1)},${this["margin-top"] +
      (this.layoutObj?.getFeatureYPos(`${f.accession}_${f.k}_${f.i}_${f.j}`) ||
        0)
      })`;
  }
  private getResidueFill(f: ResidueDatum, expanded: boolean) {
    return expanded ? this.getFeatureColor(f) : "white";
  }

  private getTextLabel(datum: Feature) {
    if (this.label?.length) {
      if (this.label.startsWith(".")) {
        return _get(datum, this.label.slice(1), null);
      }
      return this.label;
    }
    return datum?.feature?.accession || null;
  }

  private refreshLabels(base: LabelGroup | undefined, padding = 2) {
    if (!base) return;
    base
      .attr("x", (f) => {
        const start = getVisibleStart(this["display-start"], f.start);
        const end = getVisibleEnd(this["display-end"], f.end, this.length);
        return this.getXFromSeqPosition(start + (end - start) / 2 || 1);
      })
      .attr(
        "y",
        (f) =>
          this["margin-top"] +
          (this.layoutObj?.getFeatureYPos(f.feature as Feature) || 0) +
          (this.layoutObj?.getFeatureHeight(f.feature as Feature) || 0) / 2,
      )
      .attr("fill", (f, i, nodes) => {
        const element = nodes[i];
        const firstPath = element.parentElement?.querySelector("path.feature");

        if (firstPath) {
          return contrastingColor(
            colorKeywordToRGB(this.getFeatureFillColor(f)),
          );
        }
        return null;
      })
      .attr(
        "font-size",
        (f) =>
          (this.layoutObj?.getFeatureHeight(f.feature as Feature) || 2) -
          padding,
      )
      .text((d) => (this["show-label"] ? this.getTextLabel(d) : null))
      .each(
        wrap(
          this["display-start"],
          this["display-end"],
          this["length"],
          (n) => this.getXFromSeqPosition(n),
          (feature) => this.layoutObj?.getFeatureHeight(feature) || 0,
        ),
      );
  }
  private refreshFeatures(base: BaseGroup | undefined, expanded = true) {
    if (!base) return;
    const numberOfSibillings = new Set(
      base.data().map((f) => f.feature?.accession),
    ).size;
    base
      .attr("d", (f) =>
        this.featureShape.getFeatureShape(
          this.getSingleBaseWidth(),
          this.layoutObj?.getFeatureHeight(f.feature || "") || 0,
          f.end && f.start ? f.end - f.start + 1 : 1,
          expanded
            ? this.getShape(f.shape ? f : (f.feature as Feature))
            : "rectangle",
        ),
      )
      .style("fill", (f) =>
        expanded ? this.getFeatureColor(f.feature as Feature) : "white",
      )
      .attr(
        "opacity",
        expanded ? 1 : MAX_OPACITY_WHILE_COLAPSED / numberOfSibillings,
      )
      .style("stroke", (f) =>
        expanded ? this.getFeatureColor(f.feature as Feature) : "none",
      )
      .attr(
        "transform",
        (f) =>
          `translate(${this.getXFromSeqPosition(f.start || 1)},${this["margin-top"] +
          (this.layoutObj?.getFeatureYPos(f.feature as Feature) || 0)
          })`,
      )
      .style("pointer-events", expanded ? "auto" : "none");
  }

  private refreshCoverLine(base: BaseGroup | undefined, expanded = true) {
    if (!base) return;
    base
      .attr("x1", (f) => this.getXFromSeqPosition(f.start || 1))
      .attr("x2", (f) => this.getXFromSeqPosition((f.end || 0) + 1))
      .attr(
        "y1",
        (f) =>
          this["margin-top"] +
          (this.layoutObj?.getFeatureYPos(f.feature as Feature) || 0) +
          (this.layoutObj?.getFeatureHeight(f.feature as Feature) || 0) / 2,
      )
      .attr(
        "y2",
        (f) =>
          this["margin-top"] +
          (this.layoutObj?.getFeatureYPos(f.feature as Feature) || 0) +
          (this.layoutObj?.getFeatureHeight(f.feature as Feature) || 0) / 2,
      )
      .attr("stroke", (f) => this.getFeatureColor(f.feature as Feature))
      .attr("visibility", expanded ? "visible" : "hidden");
  }

  override refresh() {
    if (this.#haveCreatedFeatures && this.layoutObj) {
      this.layoutObj.expanded = !!this.expanded;
      this.layoutObj.init(this.data as InterProFeature[], this.#contributors);
      this.height = this.layoutObj.maxYPos;

      this.refreshCoverLine(
        this.#featuresG?.selectAll("g.location-group line.cover") as BaseGroup,
      );
      this.refreshFeatures(
        this.#featuresG?.selectAll(
          "g.location-group path.feature",
        ) as BaseGroup,
      );
      this.refreshLabels(
        this.#featuresG?.selectAll(
          "g.location-group text.feature-label",
        ) as LabelGroup,
      );

      // this.#residuesG?.attr("visibility", this.expanded ? "visible" : "hidden");
      if (this.#residuesG)
        refreshResiduePaths({
          baseG: this.#residuesG,
          expanded: !!this.expanded,
          getResidueShape: (d) => this.getResidueShape(d),
          getResidueTransform: (d) => this.getResidueTransform(d),
          getResidueFill: (d) => this.getResidueFill(d, !!this.expanded),
        });

      if (this.#contributors) {
        const childrenGroup = this.#childrenG?.select("g.children-group");
        childrenGroup?.attr("visibility", this.expanded ? "visible" : "hidden");
        const childGroup = childrenGroup?.selectAll("g.child-group");
        const locationChildrenG = childGroup?.selectAll(
          "g.child-location-group",
        );
        const coverLinesChildren = locationChildrenG?.selectAll("line.cover");
        const featureChildren = locationChildrenG?.selectAll(
          "path.child-fragment",
        );

        this.refreshCoverLine(
          coverLinesChildren as unknown as BaseGroup,
          this.expanded,
        );
        this.refreshFeatures(
          featureChildren as unknown as BaseGroup,
          this.expanded,
        );
        this.refreshLabels(
          childGroup?.selectAll(
            "g.child-location-group text.child-label",
          ) as LabelGroup,
          0,
        );

        this.#childResiduesG?.attr("visibility", () =>
          this.expanded ? "visible" : "hidden",
        );
        if (this.#childResiduesG)
          refreshResiduePaths({
            baseG: this.#childResiduesG,
            expanded: !!this.expanded,
            getResidueShape: (d) => this.getResidueShape(d),
            getResidueTransform: (d) => this.getResidueTransform(d),
            getResidueFill: (d) =>
              this.getResidueFill(d, !!d.feature?.expanded),
          });

        if (this.#coverage?.length)
          refreshCoverage({
            element: this,
            featuresG: this.#featuresG,
            contributorsLength: this.#contributors?.length,
          });
      }
      this.svg?.attr("height", this.layoutObj.maxYPos + this["margin-bottom"]);

      this.updateHighlight();

      this.renderMarginOnGroup(this.margins);
    }
  }
}
function wrap(
  displayStart: number | undefined,
  displayEnd: number | undefined,
  length: number | undefined,
  getXFromSeqPosition: (x: number) => number,
  getFeatureHeight: (feature: Feature) => number,
) {
  function wrapFn(this: SVGTextContentElement, feature: InterProFeature) {
    const self = select(this);
    const start = getVisibleStart(displayStart, feature.start);
    const end = getVisibleEnd(displayEnd, feature.end, length);
    const width = getXFromSeqPosition(end) - getXFromSeqPosition(start);
    const padding = getFeatureHeight(feature.feature as Feature) / 2;
    let textLength = self.node()?.getComputedTextLength?.() || 0;
    let text = self.text();
    while (textLength > width - 2 * padding && text.length > 0) {
      text = text.slice(0, -1);
      self.text(text.length ? text + "\u2026" : "");
      textLength = self.node()?.getComputedTextLength() || 0;
    }
  }
  return wrapFn;
}

function getVisibleStart(
  displayStart: number | undefined,
  featureStart: number | undefined,
) {
  const dStart = displayStart && displayStart > 0 ? displayStart : 0;
  return Math.max(featureStart || 0, dStart);
}
function getVisibleEnd(
  displayEnd: number | undefined,
  featureEnd: number | undefined,
  length: number | undefined,
) {
  const dEnd = displayEnd && displayEnd > 0 ? displayEnd : length || 0;
  return Math.min(featureEnd || 0, dEnd);
}
export default NightingaleInterproTrack;
