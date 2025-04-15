import { LitElement, html, PropertyValues } from "lit";
import { property, customElement } from "lit/decorators.js";
import {
  select,
  partition as d3partition,
  hierarchy,
  scaleOrdinal,
  quantize,
  interpolateRainbow,
  HierarchyRectangularNode,
} from "d3";

const superkingdoms = ["bacteria", "viruses", "archaea", "eukaryota", null];

type Node = {
  id: string;
  name: string;
  numDomains: number;
  numSequences: number;
  numSpecies: number;
  value: number;
  node: string;
  children: Node[] | null;
  _children: Node[] | null;
  rank?: number;
  lineage?: Lineage;
};

type NameAttributes = "name" | "id" | "node";
type WeightAttributes = "numDomains" | "numSequences" | "numSpecies" | "value";
type Radians = { angle: number; radius: number };
type Lineage = Array<{ name: string | number; id: string }>;

const partition = (data: Node, radius: number, attribute: WeightAttributes) => {
  const h = hierarchy(data)
    .each((d) => {
      (d.value as number) = +d.data[attribute];
    })
    .sort((a, b) => (b.data as Node)[attribute] - (a.data as Node)[attribute]);
  return d3partition<Node>().size([2 * Math.PI, radius])(h);
};

const getValue = (d: Node, attributeName: WeightAttributes): number => {
  if (d[attributeName]) return d[attributeName];
  if (!d.children) return 0;
  return d.children.reduce(
    (agg: number, item: Node) => agg + getValue(item, attributeName),
    0,
  );
};

const prepareTreeData = (node: Node, depth: number, maxDepth: number): Node => {
  if (!node) return node;

  const preparedNode = { ...node };

  if (depth >= maxDepth && (preparedNode?.children?.length || 0)) {
    preparedNode._children = preparedNode.children;
    preparedNode.children = null;
  } else if (preparedNode?._children?.length) {
    preparedNode.children = preparedNode._children;
    preparedNode._children = null;
  }

  if (preparedNode?.children?.length) {
    const newChildren = [];
    for (const child of preparedNode.children) {
      newChildren.push(prepareTreeData(child, depth + 1, maxDepth));
    }
    preparedNode.children = newChildren;
  }
  return preparedNode;
};

const getLineageFromNode = (
  node: HierarchyRectangularNode<Node>,
  attributeName: WeightAttributes | NameAttributes,
  attributeID: NameAttributes,
): Lineage => {
  if (!node.parent) {
    return [
      {
        name: node.data[attributeName],
        id: node.data[attributeID],
      },
    ];
  }
  return [
    ...getLineageFromNode(node.parent, attributeName, attributeID),
    {
      name: node.data[attributeName],
      id: node.data[attributeID],
    },
  ];
};

const getDistanceOfPointsInRadians = (
  point1: Radians,
  point2: Radians,
): number => {
  const angle = Math.abs(point1.angle - point2.angle) / 2;
  return 2 * point1.radius * Math.sin(angle);
};

@customElement("nightingale-sunburst")
class NightingaleSunburst extends LitElement {
  @property({ type: Number })
  side?: number = 500;
  @property({ type: String })
  "weight-attribute": WeightAttributes = "value";
  @property({ type: String })
  "weight-attribute-label"?: string = "Value";
  @property({ type: String })
  "name-attribute": NameAttributes = "name";
  @property({ type: String })
  "id-attribute": NameAttributes = "id";
  @property({ type: Number })
  "max-depth"?: number = Infinity;
  @property({ type: Number })
  "font-size"?: number = 10;
  @property({ type: Boolean })
  "show-tooltip"?: boolean = false;

  #data: Node | null = null;

  holdSegment = false;
  topOptions = superkingdoms;
  root: HierarchyRectangularNode<Node> | null = null;
  activeSegment?: HierarchyRectangularNode<Node> | null;

  handleMousemove = (event: MouseEvent) => {
    if (!this.root || (this.activeSegment && this.holdSegment)) return;
    this.selectNodeByPosition(
      event.offsetX - (this.side as number) / 2,
      event.offsetY - (this.side as number) / 2,
    );
  };

  handleClick = (event: MouseEvent) => {
    if (!this.root) return;
    this.holdSegment = !this.holdSegment;
    if (!this.holdSegment) {
      this.selectNodeByPosition(
        event.offsetX - (this.side as number) / 2,
        event.offsetY - (this.side as number) / 2,
      );
    }
  };

  prepareTree() {
    if (!this.#data) return;
    const dataWithValues = prepareTreeData(
      this.#data,
      0,
      this["max-depth"] as number,
    );
    this.root = partition(
      dataWithValues,
      (this.side as number) / 2,
      this["weight-attribute"],
    );
  }

  set data(value) {
    if (value !== this.#data) {
      this.#data = value;
      this.prepareTree();
      this.renderCanvas();
    }
  }

  get data() {
    return this.#data;
  }

  colorFn() {
    return scaleOrdinal<number, string>(
      quantize(interpolateRainbow, this.topOptions.length + 1),
    ).domain(this.topOptions.map((_, i) => i));
  }

  getColor(node: HierarchyRectangularNode<Node>): string {
    if (node.depth === 1) {
      return this.getColorBySuperKingdom(node.data[this["name-attribute"]]);
    }
    if (node.parent) return this.getColor(node.parent);
    return this.colorFn()(superkingdoms.length - 1);
  }

  // eslint-disable-next-line class-methods-use-this
  getColorBySuperKingdom(name: string): string {
    return this.colorFn()(this.topOptions.indexOf(name?.toLowerCase() || null));
  }

  override updated(changedProperties: PropertyValues<this>) {
    if (
      changedProperties.has("side") ||
      changedProperties.has("max-depth") ||
      changedProperties.has("weight-attribute")
    ) {
      this.prepareTree();
    }
    this.renderCanvas();
  }

  renderCanvas() {
    const canvas = select(this).select<HTMLCanvasElement>("canvas");
    const canvasNode = canvas.node();
    if (!canvasNode || !this.#data) return;
    const context = canvasNode.getContext("2d");
    const width = this.side as number;
    const height = this.side as number;

    if (!context) return;
    context.clearRect(0, 0, width, height);
    context.strokeStyle = "white";
    if (!this.root) return;
    this.renderArcs(context, width, height);
    this.renderLabels(context, width, height);
    if (this["show-tooltip"]) {
      this.renderActiveSegmentInfo(context);
    }
  }

  renderArcs(context: CanvasRenderingContext2D, width: number, height: number) {
    for (const segment of this.root
      ?.descendants()
      .filter((d) => d.depth && d.depth <= (this["max-depth"] as number)) ||
      []) {
      // Initialize path
      context.beginPath();

      context.lineWidth = 1;
      context.globalAlpha = 0.9 - (segment.depth - 1) * 0.05;
      const tmpLineW = context.lineWidth;
      const tmpAlpha = context.globalAlpha;

      // Set the color:
      context.fillStyle = this.getColor(segment);

      // Build the arc segment
      context.arc(width / 2, height / 2, segment.y1, segment.x0, segment.x1);
      context.arc(
        width / 2,
        height / 2,
        segment.y0,
        segment.x1,
        segment.x0,
        true,
      );
      if (
        segment.data[this["id-attribute"]] ===
        this.activeSegment?.data?.[this["id-attribute"]]
      ) {
        context.lineWidth = 4;
        context.globalAlpha = 1;
      }
      // Show the stroke
      context.stroke();
      context.fill();
      context.lineWidth = tmpLineW;
      context.globalAlpha = tmpAlpha;
    }
  }

  renderLabels(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) {
    context.fillStyle = "black";
    context.font = `${this["font-size"]}px Arial`;
    context.textBaseline = "middle";
    context.textAlign = "center";
    const labelsToDisplay = this.root
      ?.descendants()
      .filter(
        (d) =>
          d.depth &&
          d.depth <= (this["max-depth"] as number) &&
          ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10,
      );
    for (const segment of labelsToDisplay || []) {
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
          { angle: segment.x1, radius: segment.y0 },
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
      }
      // rotate left side to make it readable
      else if (angle > Math.PI / 2 && angle < 1.5 * Math.PI) {
        context.rotate(Math.PI);
      }

      context.fillText(
        segment.data[this["name-attribute"]] ||
          (segment.data.rank ? `[No ${segment.data.rank}]` : "No name"),
        0,
        0,
        segment.data[this["id-attribute"]] ===
          this.activeSegment?.data?.[this["id-attribute"]]
          ? undefined
          : spaceAvailableToDraw - 2,
      );
      context.restore();
    }
  }

  renderActiveSegmentInfo(context: CanvasRenderingContext2D) {
    if (this.activeSegment) {
      context.textAlign = "left";
      context.font = "bold 12px Arial";
      context.fillText("Name:", 10, 10);
      context.fillText(`${this["weight-attribute-label"]}:`, 10, 40);
      context.font = "12px Arial";
      context.fillText(this.activeSegment.data[this["name-attribute"]], 15, 25);
      context.fillText(
        String(getValue(this.activeSegment.data, this["weight-attribute"])),
        15,
        55,
      );
    }
  }

  selectNodeByPosition(x: number, y: number) {
    const h = Math.sqrt(x * x + y * y);
    const angle1 = x === 0 ? 0 : Math.atan(y / x);
    const angle2 = y === 0 ? 0 : Math.atan(x / y);
    const prev = this.activeSegment;
    this.activeSegment = null;
    for (const d of this.root?.descendants().filter((d) => d.depth) || []) {
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
    }
    if (prev !== this.activeSegment) {
      if (this.activeSegment?.data && !this.activeSegment.data.lineage) {
        this.activeSegment.data.lineage = getLineageFromNode(
          this.activeSegment,
          this["name-attribute"],
          this["id-attribute"],
        );
      }
      this.dispatchEvent(
        new CustomEvent("taxon-hover", {
          detail: this.activeSegment?.data,
          bubbles: true,
          cancelable: true,
        }),
      );
      this.renderCanvas();
    }
  }

  override createRenderRoot() {
    return this;
  }

  override firstUpdated() {
    this.getElementsByTagName("canvas")?.[0].addEventListener(
      "click",
      this.handleClick,
    );
    this.getElementsByTagName("canvas")?.[0].addEventListener(
      "mousemove",
      this.handleMousemove,
    );
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.getElementsByTagName("canvas")?.[0].removeEventListener(
      "click",
      this.handleClick,
    );
    this.getElementsByTagName("canvas")?.[0].removeEventListener(
      "mousemove",
      this.handleMousemove,
    );
  }

  override render() {
    return html` <canvas
      width="${this.side as number}px"
      height="${this.side as number}px"
    >
      Nightingale Sunburst
    </canvas>`;
  }
}

export default NightingaleSunburst;
