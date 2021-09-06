export const parseColumnFilters = (
  columns: NodeListOf<HTMLElement>
): Map<string, Set<string>> => {
  const filters = new Map<string, Set<string>>();
  columns.forEach((column) => {
    // Add filter
    if (column.dataset.filter) {
      filters.set(column.dataset.filter, new Set());
    }
  });
  return filters;
};

export const nodeListToArray = (nodeList: NodeList): Node[] =>
  Array.prototype.slice.call(nodeList);

export const isWithinRange = (
  rangeStart: number,
  rangeEnd: number,
  start: number,
  end: number
): boolean =>
  (!start && rangeEnd === end) ||
  (!end && rangeStart === start) ||
  (rangeStart <= start && rangeEnd >= end);

export const isOutside = (
  rangeStart: number,
  rangeEnd: number,
  start: number,
  end: number
): boolean => rangeStart > end || rangeEnd < start;
