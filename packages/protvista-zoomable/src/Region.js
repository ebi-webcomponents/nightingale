export default class Region {
  constructor({ min = -Infinity, max = Infinity } = {}) {
    this.segments = [];
    this.max = max;
    this.min = min;
  }
  encode(full = false) {
    return this.segments
      .map(({ start, end }) => {
        if (full) return `${start}:${end}`;
        else {
          const s = start === this.min ? "" : start;
          const e = end === this.max ? "" : end;
          if (s === "" && e === "") return "";
          return `${s}:${e}`;
        }
      })
      .join(",");
  }
  decode(regionString) {
    this.segments = regionString.split(",").map(region => {
      const [_start, _end, _] = region.split(":");
      if (typeof _ !== "undefined")
        throw new Error(
          `there should be at most 1 ':' per region. Region: ${region}`
        );
      let start = _start ? parseInt(_start) : this.min;
      let end = _end ? parseInt(_end) : this.max;
      if (start > end) [start, end] = [end, start];
      if (start < this.min) start = this.min;
      if (end > this.max) end = this.max;
      if (isNaN(start))
        throw new Error(
          `The parsed value of ${_start} is NaN. Region: ${region}`
        );
      if (isNaN(end))
        throw new Error(
          `The parsed value of ${_end} is NaN. Region: ${region}`
        );
      return {
        start,
        end
      };
    });
  }
}
