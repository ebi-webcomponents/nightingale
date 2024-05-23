import { Feature } from "@nightingale-elements/nightingale-track";

export type Segment = {
  start: number;
  end: number;
  value?: number;
};
export const addContributor = (contributor: Segment, coverage: Segment[]) => {
  let toContribute: Segment | null = { value: 1, ...contributor };
  const newCoverage = [];
  for (const segment of coverage) {
    if (!toContribute) {
      newCoverage.push(segment);
      // Segment to contribute is before the current segment
      // __|--TC--|__||--S--||__
    } else if (toContribute.end < segment.start) {
      newCoverage.push(toContribute);
      toContribute = null;
      newCoverage.push(segment);
      // Segment to contribute contains the segment
      // __|--TC-||==S==||-|__
    } else if (
      toContribute.start < segment.start &&
      toContribute.end >= segment.end
    ) {
      newCoverage.push({
        start: toContribute.start,
        end: segment.start - 1,
        value: toContribute.value,
      });
      newCoverage.push({
        start: segment.start,
        end: segment.end,
        value: (segment.value || 0) + (toContribute?.value || 0),
      });
      toContribute =
        segment.end === toContribute.end
          ? null
          : {
              start: segment.end + 1,
              end: toContribute.end,
              value: toContribute.value,
            };
      // Segment to contribute is contained by the segment
      // __||--S-|==TC==|-||__
    } else if (
      segment.start < toContribute.start &&
      segment.end > toContribute.end
    ) {
      newCoverage.push({
        start: segment.start,
        end: toContribute.start - 1,
        value: segment.value,
      });
      newCoverage.push({
        start: toContribute.start,
        end: toContribute.end,
        value: (segment.value || 0) + (toContribute?.value || 0),
      });
      newCoverage.push({
        start: toContribute.end + 1,
        end: segment.end,
        value: segment.value,
      });
      toContribute = null;
      // Segment to contribute overlaps at the end of the segment
      // __||--S--|==||--TC--|__
    } else if (
      segment.end >= toContribute.start &&
      segment.end <= toContribute.end
    ) {
      if (segment.start < toContribute.start)
        newCoverage.push({
          start: segment.start,
          end: toContribute.start - 1,
          value: segment.value,
        });
      newCoverage.push({
        start: toContribute.start,
        end: segment.end,
        value: (segment.value || 0) + (toContribute?.value || 0),
      });
      toContribute =
        segment.end < toContribute.end
          ? {
              start: segment.end + 1,
              end: toContribute.end,
              value: toContribute.value,
            }
          : null;
      // Segment to contribute overlaps at the beggining of the segment
      // __|--TC--||==|--S--||__
    } else if (
      toContribute.end >= segment.start &&
      toContribute.end < segment.end
    ) {
      newCoverage.push({
        start: toContribute.start,
        end: segment.start - 1,
        value: toContribute.value,
      });
      newCoverage.push({
        start: segment.start,
        end: toContribute.end,
        value: (segment.value || 0) + (toContribute?.value || 0),
      });
      newCoverage.push({
        start: toContribute.end + 1,
        end: segment.end,
        value: segment.value,
      });
      toContribute = null;
    } else {
      newCoverage.push(segment);
    }

    // position++;
  }
  if (toContribute) newCoverage.push(toContribute);
  return newCoverage;
};

export const getCoverage = (
  contributors: Feature[],
  length = 100,
  createEmptyFragments = true,
) => {
  let coverage: Segment[] = [];
  if (createEmptyFragments) {
    coverage = addContributor({ start: 1, end: length, value: 0 }, coverage);
  }
  contributors.forEach((f) =>
    f.locations?.forEach((loc) =>
      loc.fragments.forEach((fr) => {
        coverage = addContributor(fr, coverage);
      }),
    ),
  );
  return coverage;
};
