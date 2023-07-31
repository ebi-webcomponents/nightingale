import { Segment } from ".";
import NightingaleInterproTrack, {
  BaseGroup,
} from "../nightingale-interpro-track";

const MIN_OPACITY_WHILE_COLAPSED = 0.3;

const cheapScale = (x: number) =>
  (x + MIN_OPACITY_WHILE_COLAPSED) / (1 + MIN_OPACITY_WHILE_COLAPSED);

export const createCoverage = ({
  element,
  coverage,
}: {
  element: NightingaleInterproTrack;
  coverage: Segment[];
}) => {
  element.accession = element?.data?.[0]?.accession || "_";

  let mask = element.svg?.select<SVGMaskElement>("defs mask");

  if (!mask?.size())
    mask = element.svg
      ?.append("defs")
      .append("mask")
      .attr("id", `mask-${element.accession}`);

  mask
    ?.selectAll("rect")
    .data(coverage)
    .enter()
    .append("rect")
    .attr("y", 0)
    .attr("height", element.height);
};

export const refreshCoverage = ({
  element,
  featuresG,
  contributorsLength,
}: {
  element: NightingaleInterproTrack;
  featuresG?: BaseGroup;
  contributorsLength: number;
}) => {
  featuresG?.attr(
    "mask",
    element.expanded ? null : `url(#mask-${element.accession})`,
  );
  element.svg
    ?.selectAll<SVGRectElement, Segment>("defs mask rect")
    .attr("x", (f) => element.getXFromSeqPosition(f.start))
    .attr("width", (f) => element.getSingleBaseWidth() * (f.end - f.start + 1))
    .attr("height", element.height)
    .attr("fill", "white")
    .attr("opacity", (f) => {
      return cheapScale((f.value || 0) / (contributorsLength || 1));
    });
};
