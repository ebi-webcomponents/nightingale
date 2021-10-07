import { LitElement, html, css } from "lit-element";
import {
  select,
  partition as d3partition,
  hierarchy,
  scaleOrdinal,
  quantize,
  interpolateRainbow,
  event as d3Event,
} from "d3";

const partition = (data, radius, attribute) => {
  const h = hierarchy(data).sort((a, b) => b[attribute] - a[attribute]);
  return d3partition().size([2 * Math.PI, radius])(h);
};

const getColor = (d, colorFn, nameAttribute) => {
  if (d.depth === 1) {
    return colorFn(d.data[nameAttribute]);
  }
  return getColor(d.parent, colorFn, nameAttribute);
};

const getValue = (d, attributeName) => {
  if (d[attributeName]) return d[attributeName];
  if (!d.children) return 0;
  return d.children.reduce(
    (agg, item) => agg + getValue(item, attributeName),
    0
  );
};

const prepareTree = (node, depth, maxDepth) => {
  node.value = node.numSequences;

  if (depth >= maxDepth) {
    node._children = node.children;
    node.children = null;
  } else if (node?.children?.length) {
    for (const child of node.children) {
      prepareTree(child, depth + 1, maxDepth);
    }
  }
};

const getDistanceOfPointsInRadians = (point1, point2) => {
  const angle = Math.abs(point1.angle - point2.angle) / 2;
  return 2 * point1.radius * Math.sin(angle);
};
class NightingaleSunburst extends LitElement {
  static properties = {
    side: { type: Number },
    "weight-attribute": { type: String },
    "name-attribute": { type: String },
    "max-depth": { type: Number },
  };

  constructor() {
    super();
    this.side = 100;
    this["weight-attribute"] = "value";
    this["name-attribute"] = "name";
    this["max-depth"] = Infinity;
    this.activeSegment = null;
  }

  set data(value) {
    if (value !== this._data) {
      this._data = value;
      prepareTree(this._data, 0, this["max-depth"]);
      this.colorFn = scaleOrdinal(
        quantize(interpolateRainbow, this._data.children.length + 1)
      );
      this.root = partition(
        this._data,
        this.side / 2,
        this["weight-attribute"]
      );
    }
  }
  updated() {
    this.renderCanvas();
  }
  renderCanvas() {
    const canvas = select(this).select("canvas");
    if (!canvas.node() || !this._data) return;
    const context = canvas.node().getContext("2d");
    const width = this.side;
    const height = this.side;

    context.clearRect(0, 0, width, height);
    context.strokeStyle = "white";
    if (!this.root) return;
    this.renderArcs(context, width, height);
    this.renderLabels(context, width, height);
    this.renderActiveSegmentInfo(context);
  }
  renderArcs(context, width, height) {
    for (const segment of this.root
      .descendants()
      .filter((d) => d.depth && d.depth <= this["max-depth"])) {
      // Initialize path
      context.beginPath();
      context.lineWidth = 1;
      context.globalAlpha = 0.7;

      // Set the color:
      context.fillStyle = getColor(
        segment,
        this.colorFn,
        this["name-attribute"]
      );

      // Build the arc segment
      context.arc(width / 2, height / 2, segment.y1, segment.x0, segment.x1);
      context.arc(
        width / 2,
        height / 2,
        segment.y0,
        segment.x1,
        segment.x0,
        true
      );
      if (segment.data.id === this.activeSegment?.data?.id) {
        context.lineWidth = 4;
        context.globalAlpha = 0.9;
      }
      // Show the stroke
      context.stroke();
      context.fill();
    }
  }
  renderLabels(context, width, height) {
    context.fillStyle = "black";
    context.font = "10px Arial";
    context.textBaseline = "middle";
    context.textAlign = "center";
    const labelsToDisplay = this.root
      .descendants()
      .filter(
        (d) =>
          d.depth &&
          d.depth <= this["max-depth"] &&
          ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10
      );
    for (const segment of labelsToDisplay) {
      const angle = (segment.x0 + segment.x1) / 2;
      const r = (segment.y0 + segment.y1) / 2;
      context.save();
      context.translate(width / 2, height / 2);
      context.rotate(angle);
      context.translate(r, 0);
      let shouldRotate = false;
      let spaceAvailableToDraw = segment.y1 - segment.y0;
      // If it's more than a 1/4 of the circle so draw it horizontally
      if (Math.abs(segment.x1 - segment.x0) > Math.PI / 2) {
        shouldRotate = true;
      } else {
        const availableWidth = getDistanceOfPointsInRadians(
          { angle: segment.x0, radius: segment.y0 },
          { angle: segment.x1, radius: segment.y0 }
        );
        // If there is more space horizontally than verically then rotate
        if (availableWidth > segment.y1 - segment.y0) {
          shouldRotate = true;
          spaceAvailableToDraw = availableWidth;
        }
      }
      if (shouldRotate) {
        context.rotate(Math.PI / 2);
        if (angle > 0 && angle < Math.PI) {
          context.rotate(Math.PI);
        }
      } else {
        // rotate left side to make it readable
        if (angle > Math.PI / 2 && angle < 1.5 * Math.PI) {
          context.rotate(Math.PI);
        }
      }
      context.fillText(
        segment.data[this["name-attribute"]],
        0,
        0,
        segment.data.id === this.activeSegment?.data?.id
          ? undefined
          : spaceAvailableToDraw - 2
      );
      context.restore();
    }
  }
  renderActiveSegmentInfo(context) {
    if (this.activeSegment) {
      context.textAlign = "left";
      context.font = "bold 12px Arial";
      context.fillText("Name:", 10, 10);
      context.fillText("Value:", 10, 25);
      context.font = "12px Arial";
      context.fillText(this.activeSegment.data[this["name-attribute"]], 50, 10);
      context.fillText(
        getValue(this.activeSegment.data, this["weight-attribute"]),
        50,
        25
      );
    }
  }

  createRenderRoot() {
    return this;
  }
  firstUpdated() {
    this.getElementsByTagName("canvas")?.[0].addEventListener(
      "mousemove",
      (event) => {
        if (!this.root) return;
        const width = this.side;
        const height = this.side;
        const x = event.offsetX - width / 2;
        const y = event.offsetY - height / 2;
        const h = Math.sqrt(x * x + y * y);
        const angle1 = x === 0 ? 0 : Math.atan(y / x);
        const angle2 = y === 0 ? 0 : Math.atan(x / y);
        const prev = this.activeSegment;
        this.activeSegment = null;
        this.root
          .descendants()
          .filter((d) => d.depth)
          .forEach((d) => {
            // if is in the right ring
            let angle = 0;
            if (d.y1 > h && h > d.y0) {
              if (x > 0 && y > 0) angle = angle1;
              else if (x < 0 && y > 0) {
                angle = Math.PI / 2 + Math.abs(angle2);
              } else if (x < 0 && y < 0) {
                angle = Math.PI + Math.abs(angle1);
              } else if (x > 0 && y < 0) {
                angle = 1.5 * Math.PI + Math.abs(angle2);
              }
              if (d.x1 > angle && angle > d.x0) this.activeSegment = d;
            }
          });
        if (prev !== this.activeSegment) this.renderCanvas();
      }
    );
  }
  render() {
    return html` <canvas width="${this.side}px" height="${this.side}px">
      Nightingale Sunburst
    </canvas>`;
  }
}

export default NightingaleSunburst;
