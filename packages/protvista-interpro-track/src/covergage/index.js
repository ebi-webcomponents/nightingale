export const addContributor = (contributor, coverage) => {
  let toCotribute = { ...contributor, value: 1 };
  // let position = 0;
  const newCoverage = [];
  for (const segment of coverage) {
    if (!toCotribute) break;
    // Segemnt to contribute is before the current segment
    if (toCotribute.end < segment.start) {
      console.log(1);
      newCoverage.push(toCotribute);
      toCotribute = null;
      // position++;
      newCoverage.push(segment);
      // Segemnt to contribute contains the segment
    } else if (
      toCotribute.start < segment.start &&
      toCotribute.end > segment.end
    ) {
      console.log(4);
      newCoverage.push({
        start: toCotribute.start,
        end: segment.start - 1,
        value: toCotribute.value
      });
      newCoverage.push({
        start: segment.start,
        end: segment.end,
        value: segment.value + toCotribute.value
      });
      newCoverage.push({
        start: segment.end + 1,
        end: toCotribute.end,
        value: toCotribute.value
      });
      toCotribute = null;
      // Segemnt to contribute is contained by the segment
    } else if (
      segment.start < toCotribute.start &&
      segment.end > toCotribute.end
    ) {
      console.log(5);
      newCoverage.push({
        start: segment.start,
        end: toCotribute.start - 1,
        value: segment.value
      });
      newCoverage.push({
        start: toCotribute.start,
        end: toCotribute.end,
        value: segment.value + toCotribute.value
      });
      newCoverage.push({
        start: toCotribute.end + 1,
        end: segment.end,
        value: segment.value
      });
      toCotribute = null;
      // Segemnt to contribute overlaps at the end of the segment
    } else if (
      segment.end >= toCotribute.start &&
      segment.end < toCotribute.end
    ) {
      console.log(2);
      newCoverage.push({
        start: segment.start,
        end: toCotribute.start - 1,
        value: segment.value
      });
      newCoverage.push({
        start: toCotribute.start,
        end: segment.end,
        value: segment.value + toCotribute.value
      });
      toCotribute = {
        start: segment.end + 1,
        end: toCotribute.end,
        value: toCotribute.value
      };
      // Segemnt to contribute overlaps at the beggining of the segment
    } else if (
      toCotribute.end >= segment.start &&
      toCotribute.end < segment.end
    ) {
      console.log(3);
      newCoverage.push({
        start: toCotribute.start,
        end: segment.start - 1,
        value: toCotribute.value
      });
      newCoverage.push({
        start: segment.start,
        end: toCotribute.end,
        value: segment.value + toCotribute.value
      });
      newCoverage.push({
        start: toCotribute.end + 1,
        end: segment.end,
        value: segment.value
      });
      toCotribute = null;
    } else {
      console.log(0);
      newCoverage.push(segment);
    }

    // position++;
  }
  if (toCotribute) newCoverage.push(toCotribute);
  return newCoverage;
};
