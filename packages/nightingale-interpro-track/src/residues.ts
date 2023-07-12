import { Selection } from "d3";
import NightingaleElement, {
  bindEvents,
} from "@nightingale-elements/nightingale-new-core";

import { InterProFeature, ResidueLocation } from "./InterproEntryLayout";

const MAX_OPACITY_WHILE_COLAPSED = 0.8;

export type ResidueDatum = {
  accession: string;
  feature: InterProFeature;
  location: ResidueLocation;
  i: number;
  j: number;
  k?: number;
  fragments: {
    start: number;
    end: number;
  }[];
  start?: number;
  end?: number;
  length: number;
  description: string;
};

export type ResidueGroup = Selection<
  SVGGElement,
  ResidueDatum,
  HTMLElement | SVGElement | null,
  unknown
>;
type BaseGroup = Selection<
  SVGGElement,
  InterProFeature,
  HTMLElement | SVGElement | null,
  unknown
>;
export const createResidueGroup = (baseG: BaseGroup) => {
  return baseG
    .selectAll("g.residues-group")
    .data(
      (d) =>
        (d as InterProFeature).residues?.map((r, i) => ({
          ...r,
          feature: d,
          i,
        })) || [],
    )
    .enter()
    .append("g")
    .attr("class", "residues-group")
    .selectAll("g.residues-locations")
    .data((d) =>
      d.locations.map((loc, j) => ({
        ...loc,
        accession: d.accession,
        feature: d.feature as InterProFeature,
        location: loc,
        i: d.i,
        j,
      })),
    )
    .enter()
    .append("g")
    .attr("class", "residues-locations");
};

export const createResiduePaths = ({
  baseG,
  getResidueShape,
  getResidueTransform,
  getResidueFill,
  element,
}: {
  baseG: ResidueGroup;
  getResidueShape: (x: ResidueDatum) => string;
  getResidueTransform: (x: ResidueDatum) => string;
  getResidueFill: (x: ResidueDatum) => string;
  element: NightingaleElement;
}) => {
  return baseG
    .selectAll<SVGPathElement, ResidueDatum>("path.residue")
    .data((d) =>
      d.fragments.map(
        (loc) =>
          ({
            ...loc,
            accession: d.accession,
            feature: {
              ...d.feature,
              currentResidue: { ...loc, description: d.location.description },
            } as InterProFeature,
            location: d.location,
            k: d.feature.k,
            i: d.i,
            j: d.j,
          }) as ResidueDatum,
      ),
    )
    .enter()
    .append("path")
    .attr("class", "feature rectangle residue")
    .attr("d", getResidueShape)
    .attr("transform", getResidueTransform)
    .attr("fill", getResidueFill)
    .attr("stroke", "transparent")
    .call(bindEvents, element);
};

export const refreshResiduePaths = ({
  baseG,
  expanded,
  getResidueShape,
  getResidueTransform,
  getResidueFill,
}: {
  baseG: ResidueGroup;
  expanded: boolean;
  getResidueShape: (x: ResidueDatum) => string;
  getResidueTransform: (x: ResidueDatum) => string;
  getResidueFill: (x: ResidueDatum) => string;
}) => {
  const paths = baseG.selectAll<SVGPathElement, ResidueDatum>("path.residue");
  const numberOfSibillings = new Set(
    paths
      .data()
      .map((f) => `${f.feature?.accession}-${f.location?.description}`),
  ).size;
  paths
    .attr("d", getResidueShape)
    .attr("transform", getResidueTransform)
    .style("pointer-events", (f) =>
      expanded || (f.feature && f.feature.expanded) ? "auto" : "none",
    )
    .style("stroke", () => (expanded ? null : "none"))
    .style("opacity", () =>
      expanded ? null : MAX_OPACITY_WHILE_COLAPSED / numberOfSibillings,
    )
    .attr("fill", getResidueFill);
};
