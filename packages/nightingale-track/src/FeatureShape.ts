const symbolSize = 10;

export type Shapes =
  | "rectangle"
  | "roundRectangle"
  | "bridge"
  | "line"
  | "diamond"
  | "chevron"
  | "catFace"
  | "triangle"
  | "wave"
  | "hexagon"
  | "pentagon"
  | "circle"
  | "arrow"
  | "doubleBar"
  | "discontinuosStart"
  | "discontinuos"
  | "discontinuosEnd"
  | "helix"
  | "strand"
  | "leftEndedTag"
  | "rightEndedTag"
  | "doubleEndedTag";

type TagOptions = {
  left?: boolean;
  right?: boolean;
};

export default class FeatureShape {
  #ftLength = 1;
  #ftHeight = 1;
  #ftWidth = 1;

  private shape2function(shape: Shapes) {
    switch (shape) {
      case "rectangle":
        return () => this.rectangle();
      case "roundRectangle":
        return () => this.roundRectangle();
      case "line":
        return () => this.line();
      case "bridge":
        return () => this.bridge();
      case "diamond":
        return () => this.diamond();
      case "chevron":
        return () => this.chevron();
      case "catFace":
        return () => this.catFace();
      case "triangle":
        return () => this.triangle();
      case "wave":
        return () => this.wave();
      case "hexagon":
        return () => this.hexagon();
      case "pentagon":
        return () => this.pentagon();
      case "circle":
        return () => this.circle();
      case "arrow":
        return () => this.arrow();
      case "doubleBar":
        return () => this.doubleBar();
      case "discontinuosStart":
        return () => this.discontinuousStart();
      case "discontinuos":
        return () => this.discontinuous();
      case "discontinuosEnd":
        return () => this.discontinuousEnd();
      case "helix":
        return () => this.helix();
      case "strand":
        return () => this.strand();
      case "leftEndedTag":
        return () => this.tag({left: true});
      case "rightEndedTag":
        return () => this.tag({right: true});
      case "doubleEndedTag":
        return () => this.tag({left: true, right: true});
      default:
        return () => this.rectangle();
    }
  }
  getFeatureShape(
    aaWidth: number,
    ftHeight: number,
    ftLength: number,
    shape: Shapes,
  ) {
    shape = shape || "rectangle";
    this.#ftLength = ftLength;
    this.#ftHeight = ftHeight;
    this.#ftWidth = aaWidth * ftLength;
    const shapeFn = this.shape2function(shape);
    return shapeFn();
  }

  static isContinuous(shape: Shapes) {
    return shape.toLowerCase() !== "bridge";
  }

  private rectangle() {
    return `M0,0L${this.#ftWidth},0L${this.#ftWidth},${this.#ftHeight}L0,${this.#ftHeight}Z`;
  }

  private roundRectangle() {
    const radius = 6;
    return `M${radius},0h${
      this.#ftWidth - 2 * radius
    },0a${radius},${radius} 0 0 1 ${radius},${radius}v${
      this.#ftHeight - 2 * radius
    }a${radius},${radius} 0 0 1 ${-radius},${radius}h${
      2 * radius - this.#ftWidth
    }a${radius},${radius} 0 0 1 ${-radius},${-radius}v${
      2 * radius - this.#ftHeight
    }a${radius},${radius} 0 0 1 ${radius},${-radius}Z`;
  }

  line() {
    return `M0,${this.#ftHeight / 2} L${this.#ftWidth},${this.#ftHeight / 2}`;
  }

  bridge() {
    if (this.#ftLength !== 1) {
      return `M0,${this.#ftHeight}L0,0L${this.#ftWidth},0L${this.#ftWidth},${this.#ftHeight}L${this.#ftWidth},2L0,2Z`;
    }
    return `M0,${this.#ftHeight}L0,${this.#ftHeight / 2}L${this.#ftWidth / 2},${
      this.#ftHeight / 2
    }L${this.#ftWidth / 2},0L${this.#ftWidth / 2},${this.#ftHeight / 2}L${
      this.#ftWidth
    },${this.#ftHeight / 2}L${this.#ftWidth},${this.#ftHeight}Z`;
  }

  #getMiddleLine(centerx: number) {
    return `M0,${centerx}L${this.#ftWidth},${centerx}Z`;
  }

  diamond() {
    const centerx = symbolSize / 2;
    const m = this.#ftWidth / 2;
    const shape = `M${m},0L${m + centerx},${centerx}L${m},${symbolSize}L${
      m - centerx
    },${centerx}`;
    return this.#ftLength !== 1
      ? shape + this.#getMiddleLine(centerx)
      : `${shape}Z`;
  }

  chevron() {
    const m = this.#ftWidth / 2;
    const centerx = symbolSize / 2;
    const shape = `M${m},${centerx}L${centerx + m},0L${
      centerx + m
    },${centerx}L${m},${symbolSize}L${-centerx + m},${centerx}L${
      -centerx + m
    },0`;
    return this.#ftLength !== 1
      ? `${shape}L${m},${centerx}${this.#getMiddleLine(centerx)}Z`
      : shape + "Z";
  }

  catFace() {
    const centerx = symbolSize / 2;
    const step = symbolSize / 10;
    const m = this.#ftWidth / 2;
    const shape = `M${-centerx + m},0L${-centerx + m},${6 * step}L${
      -2 * step + m
    },${symbolSize}L${2 * step + m},${symbolSize}L${centerx + m},${6 * step}L${
      centerx + m
    },0L${2 * step + m},${4 * step}L${-2 * step + m},${4 * step}`;
    return this.#ftLength !== 1
      ? `${shape}M${m},0${this.#getMiddleLine(centerx)}Z`
      : `${shape}Z`;
  }

  triangle() {
    const centerx = symbolSize / 2;
    const m = this.#ftWidth / 2;
    const shape = `M${m},0L${centerx + m},${symbolSize}L${
      -centerx + m
    },${symbolSize}`;
    return this.#ftLength !== 1
      ? `${shape}L${m},0${this.#getMiddleLine(centerx)}Z`
      : `${shape}Z`;
  }

  wave() {
    const rx = symbolSize / 4;
    const ry = symbolSize / 2;
    const m = this.#ftWidth / 2;
    const shape = `M${
      -symbolSize / 2 + m
    },${ry}A${rx},${ry} 0 1,1 ${m},${ry}A${rx},${ry} 0 1,0 ${
      symbolSize / 2 + m
    },${ry}`;
    return this.#ftLength !== 1
      ? `${shape + this.#getMiddleLine(ry)}Z`
      : `${shape}Z`;
  }

  private getPolygon(sidesNumber: number) {
    const r = symbolSize / 2;
    let polygon = "M ";
    const m = this.#ftWidth / 2;
    for (let i = 0; i < sidesNumber; i++) {
      polygon += `${r * Math.cos((2 * Math.PI * i) / sidesNumber) + m},${
        r * Math.sin((2 * Math.PI * i) / sidesNumber) + r
      } `;
    }
    return this.#ftLength !== 1
      ? `${polygon} ${r * Math.cos(0) + m},${
          r * Math.sin(0) + r
        } ${this.#getMiddleLine(r)}Z`
      : `${polygon}Z`;
  }

  hexagon() {
    return this.getPolygon(6);
  }

  pentagon() {
    return this.getPolygon(5);
  }

  circle() {
    const m = this.#ftWidth / 2;
    const r = Math.sqrt(symbolSize / Math.PI);
    const shape = `M${m},0A${r},${r} 0 1,1 ${m},${symbolSize}A${r},${r} 0 1,1 ${m},0`;
    return this.#ftLength !== 1
      ? `${shape + this.#getMiddleLine(symbolSize / 2)}Z`
      : `${shape}Z`;
  }

  arrow() {
    const step = symbolSize / 10;
    const m = this.#ftWidth / 2;
    const shape = `M${m},0L${-step + m},0L${-5 * step + m},${4 * step}L${
      -step + m
    },${this.#ftHeight}L${m},${this.#ftHeight}L${4 * step + m},${4 * step}`;
    return this.#ftLength !== 1
      ? `${shape}L${m},0${this.#getMiddleLine(symbolSize / 2)}Z`
      : `${shape}Z`;
  }

  doubleBar() {
    const m = this.#ftWidth / 2;
    const centerx = symbolSize / 2;
    const shape = `M${m},0L${-centerx + m},${symbolSize}L${m},${symbolSize}L${
      centerx + m
    },0`;
    return this.#ftLength !== 1
      ? `${shape}L${m},0${this.#getMiddleLine(symbolSize / 2)}Z`
      : `${shape}Z`;
  }

  #getBrokenEnd() {
    const qh = this.#ftHeight / 4.0;
    return `L${this.#ftWidth - qh},${qh}L${this.#ftWidth},${2 * qh}L${
      this.#ftWidth - qh
    },${3 * qh}L${this.#ftWidth},${this.#ftHeight}`;
  }

  #getBrokenStart() {
    const qh = this.#ftHeight / 4.0;
    return `L${qh},${3 * qh}L0,${2 * qh}L${qh},${qh}`;
  }

  discontinuousStart() {
    return `M0,0L${this.#ftWidth},0L${this.#ftWidth},${this.#ftHeight}L0,${
      this.#ftHeight
    }${this.#getBrokenStart()}Z`;
  }

  discontinuous() {
    return `M0,0L${this.#ftWidth},0${this.#getBrokenEnd()}L0,${
      this.#ftHeight
    }${this.#getBrokenStart()}Z`;
  }

  discontinuousEnd() {
    return `M0,0L${this.#ftWidth},0${this.#getBrokenEnd()}L0,${
      this.#ftHeight
    }Z`;
  }

  helix() {
    const x = symbolSize / 2; // Fitting two loops in a symbol
    const y = symbolSize / 4;
    let center = x / 2;
    const nw = Math.round(this.#ftWidth / x);

    let loop = "";
    for (let i = 0; i < nw; i++) {
      const shape = `M${-(x / 2) + center},${this.#ftHeight} C${center + y},${
        3 * y
      } ${x / 2 + center},${y} ${center}, 0 C${center - y},${y} ${center},${
        3 * y
      } ${x / 2 + center},${this.#ftHeight}`;
      loop += shape;
      center += x;
    }
    return loop;
  }

  strand() {
    let rl = 0;
    if (this.#ftWidth > symbolSize / 2) {
      rl = this.#ftWidth - symbolSize / 2;
    }
    const qh = this.#ftHeight / 4;
    const rect = `M0,${qh}L${rl},${qh}L${rl},${3 * qh}L0,${3 * qh}L0,${qh}`;
    const triangle = `M${rl},${0}L${this.#ftWidth},${2 * qh}L${rl},${
      this.#ftHeight
    }Z`;
    return rect + triangle;
  }

  tag(options: TagOptions = {}) {
    const h = this.#ftHeight;
    const w = this.#ftWidth;
    const d = h / Math.sqrt(2);
    let path = `M0,${h / 2}`;

    if (options.left) {
      path += ` L${d},0`;
    } else {
      path += ` L0,0`;
    }

    if (options.right) {
      path += ` L${w - d},0`;
    } else {
      path += ` L${w},0`;
    }

    if (options.right) {
      path += ` L${w},${h / 2} L${w - d},${h}`;
    } else {
      path += ` L${w},${h}`;
    }

    if (options.left) {
      path += ` L${d},${h}`;
    } else {
      path += ` L0,${h}`;
    }

    return path + " Z";
  }
}
