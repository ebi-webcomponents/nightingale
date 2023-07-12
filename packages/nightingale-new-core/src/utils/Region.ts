export type SegmentType = { start: number; end: number };
export default class Region {
  segments: SegmentType[];
  max: number;
  min: number;
  regionString: string | null;

  constructor({ min = -Infinity, max = Infinity } = {}) {
    this.segments = [];
    this.max = max;
    this.min = min;
    this.regionString = null;
  }

  encode(full = false) {
    return this.segments
      .map(({ start, end }) => {
        if (full) return `${start}:${end}`;
        const s = start === this.min ? "" : start;
        const e = end === this.max ? "" : end;
        return `${s}:${e}`;
      })
      .join(",");
  }

  decode(regionString: string | null) {
    if (typeof regionString !== "undefined") this.regionString = regionString;
    if (!this.regionString) {
      this.segments = [];
      return;
    }
    this.segments = this.regionString.split(",").map((region) => {
      const [_start, _end, _] = region.split(":");
      if (typeof _ !== "undefined")
        throw new Error(
          `there should be at most 1 ':' per region. Region: ${region}`,
        );
      let start = _start ? Number(_start) : this.min;
      let end = _end ? Number(_end) : this.max;
      if (start > end) [start, end] = [end, start];
      if (start < this.min) start = this.min;
      if (end > this.max) end = this.max;
      if (Number.isNaN(start))
        throw new Error(
          `The parsed value of ${_start} is NaN. Region: ${region}`,
        );
      if (Number.isNaN(end))
        throw new Error(
          `The parsed value of ${_end} is NaN. Region: ${region}`,
        );
      return {
        start,
        end,
      };
    });
  }
}
