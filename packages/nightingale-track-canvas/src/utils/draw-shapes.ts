import { type Shapes } from "@nightingale-elements/nightingale-track";


/** Draw an "unknown shape" symbol (a question mark). */
export function drawUnknown(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
  ctx.beginPath();
  ctx.arc(cx, cy - 0.5 * r, 0.2 * r, 0.25 * Math.PI, 1 * Math.PI, true);
  ctx.arc(cx - 0.35 * r, cy - 0.5 * r, 0.15 * r, 0, 1 * Math.PI, false);
  ctx.arc(cx, cy - 0.5 * r, 0.5 * r, 1 * Math.PI, 0.25 * Math.PI, false);
  ctx.arc(cx + 0.25 * r, cy + 0.3 * r, 0.2 * r, 1.25 * Math.PI, 1 * Math.PI, true);
  ctx.arc(cx + 0.25 * r - 0.35 * r, cy + 0.3 * r, 0.15 * r, 0, 1 * Math.PI, false);
  ctx.arc(cx + 0.25 * r, cy + 0.3 * r, 0.5 * r, 1 * Math.PI, 1.25 * Math.PI, false);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx + 0.25 * r - 0.35 * r, cy + 0.85 * r, 0.15 * r, 0, 2 * Math.PI, true);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

/** Try to draw a symbol and return true.
 * Draw nothing and return false if `shape` is not supported.
 * This only draws "symbols", i.e. shapes that do not stretch when zoomed in. */
export function drawSymbol(ctx: CanvasRenderingContext2D, shape: Shapes, cx: number, cy: number, r: number): boolean {
  const drawer = SymbolDrawers[shape];
  if (drawer) {
    drawer(ctx, cx, cy, r);
    return true;
  } else {
    return false;
  }
}

/** Try to draw a range and return true.
 * Draw nothing and return false if `shape` is not supported.
 * This only draws "ranges", i.e. shapes that stretch when zoomed in. */
export function drawRange(ctx: CanvasRenderingContext2D, shape: Shapes, x: number, y: number, width: number, height: number, optXPadding: number, fragmentLength: number): boolean {
  const drawer = RangeDrawers[shape];
  if (drawer) {
    drawer(ctx, x, y, width, height, optXPadding, fragmentLength);
    return true;
  } else {
    return false;
  }
}

/** Return shape category this shape belongs to.
 * "range" are shapes that stretch when zoomed in;
 * "symbol" are shapes that do not stretch when zoomed in
 * (but they are rendered with a stretching line, when applied to more than one residue);
 * "unknown" are shapes that are not implemented (drawn as a question mark, thus they behave as "symbol"). */
export function shapeCategory(shape: Shapes): "range" | "symbol" | "unknown" {
  if (shape in SymbolDrawers) return "symbol";
  if (shape in RangeDrawers) return "range";
  return "unknown";
}


type SymbolDrawer = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => void;

const SymbolDrawers: Partial<Record<Shapes, SymbolDrawer>> = {
  circle(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  },

  /** This is not an equilateral triangle, therefore not using `drawPolygon` */
  triangle(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx + r, cy + r);
    ctx.lineTo(cx - r, cy + r);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  },

  diamond(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx + r, cy);
    ctx.lineTo(cx, cy + r);
    ctx.lineTo(cx - r, cy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  },

  pentagon(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
    return drawPolygon(ctx, 5, cx, cy, r);
  },

  hexagon(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
    return drawPolygon(ctx, 6, cx, cy, r);
  },

  chevron(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + r, cy - r);
    ctx.lineTo(cx + r, cy);
    ctx.lineTo(cx, cy + r);
    ctx.lineTo(cx - r, cy);
    ctx.lineTo(cx - r, cy - r);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  },

  catFace(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
    const r02 = 0.2 * r;
    const r04 = 0.4 * r;
    const r10 = r;
    ctx.beginPath();
    ctx.moveTo(cx + r04, cy - r02);
    ctx.lineTo(cx + r10, cy - r10);
    ctx.lineTo(cx + r10, cy + r02);
    ctx.lineTo(cx + r04, cy + r10);
    ctx.lineTo(cx - r04, cy + r10);
    ctx.lineTo(cx - r10, cy + r02);
    ctx.lineTo(cx - r10, cy - r10);
    ctx.lineTo(cx - r04, cy - r02);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  },

  /** This does not look like an arrow. It is something similar to a kite. */
  arrow(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
    const r01 = 0.1 * r;
    const r04 = 0.4 * r;
    const r08 = 0.8 * r;
    const r12 = 1.2 * r;
    ctx.beginPath();
    ctx.moveTo(cx - r01, cy - r12);
    ctx.lineTo(cx - r08, cy - r04);
    ctx.lineTo(cx - r01, cy + r12);
    ctx.lineTo(cx + r01, cy + r12);
    ctx.lineTo(cx + r08, cy - r04);
    ctx.lineTo(cx + r01, cy - r12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  },

  wave(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
    const r05 = 0.5 * r;
    ctx.beginPath();
    ctx.ellipse(cx - r05, cy, r05, r, 0, Math.PI, 0, false);
    ctx.ellipse(cx + r05, cy, r05, r, 0, Math.PI, 0, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  },

  /** This does not look like a double bar. It is a rhomboid. */
  doubleBar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx + r, cy - r);
    ctx.lineTo(cx, cy + r);
    ctx.lineTo(cx - r, cy + r);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  },
};


type RangeDrawer = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, optXPadding: number, fragmentLength: number) => void;

const RangeDrawers: Partial<Record<Shapes, RangeDrawer>> = {
  rectangle(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
    ctx.fillRect(x, y, width, height);
    ctx.strokeRect(x, y, width, height);
  },

  roundRectangle(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
    const ry = 0.5 * height; // In NightingaleTrack, this is harcoded 6px
    const rx = Math.min(ry, 0.5 * width);
    ctx.beginPath();
    ctx.ellipse(x + rx, y + ry, rx, ry, 0, Math.PI, 1.5 * Math.PI, false);
    ctx.ellipse(x + width - rx, y + ry, rx, ry, 0, 1.5 * Math.PI, 0, false);
    ctx.ellipse(x + width - rx, y + height - ry, rx, ry, 0, 0, 0.5 * Math.PI, false);
    ctx.ellipse(x + rx, y + height - ry, rx, ry, 0, 0.5 * Math.PI, Math.PI, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  },

  line(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, xPadding: number): void {
    const cy = y + 0.5 * height;
    drawLine(ctx, x + xPadding, cy, x + width - xPadding, cy);
  },

  bridge(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, xPadding: number, fragmentLength: number): void {
    x += xPadding;
    width -= 2 * xPadding;

    if (fragmentLength === 1) {
      // This does not look like a bridge
      ctx.beginPath();
      ctx.moveTo(x, y + 0.5 * height);
      ctx.lineTo(x + 0.5 * width, y + 0.5 * height);
      ctx.lineTo(x + 0.5 * width, y);
      ctx.lineTo(x + 0.5 * width, y + 0.5 * height);
      ctx.lineTo(x + width, y + 0.5 * height);
      ctx.lineTo(x + width, y + height);
      ctx.lineTo(x, y + height);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      // This looks like a bridge
      const beam = 0.2 * height; // In NightingaleTrack, this is harcoded 2px
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + width, y);
      ctx.lineTo(x + width, y + height);
      ctx.lineTo(x + width, y + beam);
      ctx.lineTo(x, y + beam);
      ctx.lineTo(x, y + height);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  },

  discontinuosStart(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
    const qy = 0.2 * height;
    const qx = Math.min(qy, 0.5 * width);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + qx, y + qy);
    ctx.lineTo(x, y + 2 * qy);
    ctx.lineTo(x + qx, y + 3 * qy);
    ctx.lineTo(x, y + 4 * qy);
    ctx.lineTo(x + qx, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + width, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  },

  discontinuosEnd(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
    const qy = 0.2 * height;
    const qx = Math.min(qy, 0.5 * width);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + width - qx, y + 4 * qy);
    ctx.lineTo(x + width, y + 3 * qy);
    ctx.lineTo(x + width - qx, y + 2 * qy);
    ctx.lineTo(x + width, y + 1 * qy);
    ctx.lineTo(x + width - qx, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  },

  discontinuos(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
    const qy = 0.2 * height;
    const qx = Math.min(qy, 0.5 * width);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + qx, y + qy);
    ctx.lineTo(x, y + 2 * qy);
    ctx.lineTo(x + qx, y + 3 * qy);
    ctx.lineTo(x, y + 4 * qy);
    ctx.lineTo(x + qx, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + width - qx, y + 4 * qy);
    ctx.lineTo(x + width, y + 3 * qy);
    ctx.lineTo(x + width - qx, y + 2 * qy);
    ctx.lineTo(x + width, y + 1 * qy);
    ctx.lineTo(x + width - qx, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  },

  helix(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, xPadding: number): void {
    x += xPadding;
    width -= 2 * xPadding;

    const w = Math.min(0.4 * height, width);
    const n = Math.floor(width / w);
    const top = y + 0.05 * height;
    const bottom = y + 0.95 * height;
    ctx.beginPath();
    ctx.moveTo(x, bottom);
    for (let i = 0; i < n; i++) {
      const x_ = x + i * w;
      ctx.bezierCurveTo(
        x_ + 0.75 * w, bottom,
        x_ + 1.25 * w, top,
        x_ + 0.5 * w, top);
      ctx.bezierCurveTo(
        x_, top,
        x_ + 0.5 * w, bottom,
        x_ + w, bottom);
    }
    ctx.lineTo(x + width, bottom);
    ctx.fill();
    ctx.stroke();
  },

  strand(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, xPadding: number): void {
    x += xPadding;
    width -= 2 * xPadding

    const q = 0.25 * height;
    const head = Math.min(0.5 * height, 0.75 * width);
    const delta = 0.01 * head; // to avoid stroke of a too sharp angle protruding out of the track
    ctx.beginPath();
    ctx.moveTo(x, y + q);
    ctx.lineTo(x + width - head, y + q);
    ctx.lineTo(x + width - head, y);
    ctx.lineTo(x + width - head + delta, y);
    ctx.lineTo(x + width, y + 0.5 * height);
    ctx.lineTo(x + width - head + delta, y + height);
    ctx.lineTo(x + width - head, y + height);
    ctx.lineTo(x + width - head, y + height - q);
    ctx.lineTo(x, y + height - q);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  },
};

// Future-proofing for fixing typos (discontinUOS -> discontinUOUS)
(RangeDrawers as Partial<Record<string, RangeDrawer>>).discontinuousStart = RangeDrawers.discontinuosStart;
(RangeDrawers as Partial<Record<string, RangeDrawer>>).discontinuousEnd = RangeDrawers.discontinuosEnd;
(RangeDrawers as Partial<Record<string, RangeDrawer>>).discontinuous = RangeDrawers.discontinuos;


function drawLine(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number): void {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

function drawPolygon(ctx: CanvasRenderingContext2D, n: number, cx: number, cy: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(cx + r, cy);
  for (let i = 1; i < n; i++) {
    const phase = 2 * Math.PI * i / n;
    const x = cx + r * Math.cos(phase);
    const y = cy + r * Math.sin(phase);
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
