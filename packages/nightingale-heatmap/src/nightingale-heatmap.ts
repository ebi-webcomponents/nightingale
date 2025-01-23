import { PropertyValues, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  select,
  scaleBand,
  scaleLinear,
  ScaleLinear,
  axisBottom,
  axisLeft,
  range,
  ScaleBand,
} from "d3";

import NightingaleElement, {
  withDimensions,
  withPosition,
  withMargin,
  withResizable,
  withHighlight,
} from "@nightingale-elements/nightingale-new-core";

export type HeatmapData = Array<[number, number, number]>;
export type HeatmapPoint = {
  xPoint: number;
  yPoint: number;
  value: number | null;
};

@customElement("nightingale-heatmap")
class NightingaleHeatmap extends withResizable(
  withMargin(
    withPosition(
      withDimensions(
        withHighlight(NightingaleElement, {
          "highlight-color": "#fc1e1e",
        }),
      ),
    ),
  ),
) {
  @property({ type: Boolean })
  symmetric?: boolean = false;
  @property({ type: String, attribute: "top-color" })
  topColor?: string = "#fff81f";
  @property({ type: String, attribute: "bottom-color" })
  bottomColor?: string = "#23368a";
  @property({ type: String, attribute: "x-label" })
  xLabel?: string = "Residue";
  @property({ type: String, attribute: "y-label" })
  yLabel?: string = "Residue";

  #data: HeatmapData = [];
  #rawData: HeatmapData = [];
  #canvasWidth = 0;
  #canvasHeight = 0;
  #context?: CanvasRenderingContext2D | null;
  #x?: ScaleBand<number>;
  #y?: ScaleBand<number>;
  colorScale?: ScaleLinear<string, string>;

  processData(data: HeatmapData): HeatmapData {
    if (!this.length) {
      if (!data.length) return [];
      const [lastValue] = data[data.length - 1];
      this.length = lastValue;
    }

    // Filling missing values
    const newArray: HeatmapData = [];
    let i = 1;
    let j = 1;
    let k = 0;
    for (k = 0; k < data.length; k++) {
      const value = data[k];
      // eslint-disable-next-line no-loop-func
      const fillArray = (newData: HeatmapData) => {
        if (value[0] === i && value[1] === j) {
          // If present, push the existing value
          newData.push(data[k]);
        } else {
          // If not, push the value as 0 and continue with the last checked index 'k' of data
          newData.push([i, j, 0]);
          k--;
        }
      };

      if (j <= this.length) {
        fillArray(newArray);
        j++;
      } else {
        i++;
        j = this.symmetric ? i : 1;
        fillArray(newArray);
      }
    }
    return newArray;
  }
  set data(data: HeatmapData) {
    this.#rawData = data;
    this.#data = this.processData(this.#rawData);
  }

  get data(): HeatmapData {
    return this.#data;
  }
  override willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("symmetric")) {
      this.#data = this.processData(this.#rawData);
    }
  }

  override render() {
    this.style.display = "block";
    return html`
      <canvas class="canvas-heatmap" style="position: absolute"></canvas
      ><svg
        class="svg-heatmap"
        width=${this.width}
        height=${this.height}
        style="position: absolute; pointer-events: none;"
      >
        <g class="svg-heatmap-group">
          <g class="x-axis"></g>
          <text class="x-label" style="text-anchor:middle"></text>
          <g class="y-axis"></g>
          <g class="hovered-area"></g>
          <text
            class="y-label"
            style="text-anchor:middle"
            transform="rotate(-90)"
          ></text>
        </g>
      </svg>
    `;
  }
  protected override firstUpdated(): void {
    const mousemove = (event: MouseEvent) => {
      if (!this.#x || !this.#y) return;
      const xDomainValue = Math.floor(
        (this.#x.domain().length * event.offsetX) / this.#x.range()[1],
      );
      const yDomainValue = Math.floor(
        (this.#y.domain().length * event.offsetY) / this.#y.range()[1],
      );

      if (xDomainValue >= 0 && yDomainValue >= 0) {
        const xPoint = this.#x.domain()[xDomainValue];
        const yPoint = this.#y.domain()[yDomainValue];
        const value = this.drawHovered([xPoint, yPoint]);
        this.#dispatchSelectionPoint("mousemove", { xPoint, yPoint, value });
      }
    };

    const mouseout = () => {
      this.drawHovered();
      this.#dispatchSelectionPoint("mouseout");
    };

    select(".canvas-heatmap").on("mousemove", mousemove);
    select(".canvas-heatmap").on("mouseout", mouseout);
  }
  protected override updated(): void {
    this.colorScale = scaleLinear<string, string>()
      .domain([0, 1])
      .range([this.bottomColor || "", this.topColor || ""]);

    this.createHeatMap(this.#data);
    if (this.#data) this.refreshHeatmap(this.#data);
  }

  #dispatchSelectionPoint(type: string, d?: HeatmapPoint) {
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          type,
          point: d || null,
          target: this,
        },
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  createHeatMap(data: HeatmapData) {
    const margin = {
      top: this["margin-top"],
      right: this["margin-right"],
      bottom: this["margin-bottom"],
      left: this["margin-left"],
    };
    this.#canvasWidth = this.width - margin.left - margin.right;
    this.#canvasHeight = this.height - margin.top - margin.bottom;

    const svg = select(this)
      .select("g.svg-heatmap-group")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const canvas = select(this)
      .select<HTMLCanvasElement>("canvas.canvas-heatmap")
      .attr("width", this.#canvasWidth)
      .attr("height", this.#canvasHeight)
      .style("margin-left", `${margin.left}px`)
      .style("margin-top", `${margin.top}px`);

    this.#context = canvas.node()?.getContext("2d");

    // X scale
    this.#x = scaleBand<number>()
      .range([0, this.#canvasWidth])
      .domain(range(1, this.length || 0));

    // Y scale
    this.#y = scaleBand<number>()
      .range([0, this.#canvasHeight])
      .domain(range(1, this.length || 0));

    // Ticks interval
    const total = this.#x.domain().length;
    const tickValues = [1];
    // Showing quarter values in the length as ticks
    let quarter;
    if (total >= 100) quarter = total * 0.25 - ((total * 0.25) % 10);
    else if (total >= 20) quarter = total * 0.25 - ((total * 0.25) % 5);
    else quarter = Math.floor(total * 0.25);

    let position = quarter;
    while (total > 0 && position <= total) {
      tickValues.push(Math.min(total, position));
      position += quarter;
    }
    if (tickValues.length === 1) return;
    // Adding axes
    const xAxis = axisBottom(this.#x).tickSize(3).tickValues(tickValues);
    svg
      .select<SVGGElement>("g.x-axis")
      .style("font-size", 15)
      .attr("transform", `translate(0,${this.#canvasHeight || 0})`)
      .call(xAxis)
      .select(".domain")
      .remove();
    const yAxis = axisLeft(this.#y).tickSize(3).tickValues(tickValues);
    svg
      .select<SVGGElement>("g.y-axis")
      .style("font-size", 15)
      .call(yAxis)
      .select(".domain")
      .remove();

    svg
      .select<SVGGElement>("g.y-axis g.tick")
      .attr("dominant-baseline", "hanging");

    // text label for axes
    svg
      .select<SVGTextElement>("text.x-label")
      .text(this.xLabel || "")
      .attr(
        "transform",
        `translate(${this.#canvasWidth / 2 || 0},${
          this.#canvasHeight + margin.top + margin.bottom || 0
        })`,
      );
    svg
      .select<SVGTextElement>("text.y-label")
      .text(this.yLabel || "")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - this.#canvasHeight / 2)
      .attr("dy", "1em");

    // Draw on canvas
    this.refreshHeatmap(data);
  }

  refreshHeatmap(data: HeatmapData) {
    if (!this.#context || !this.#x) return;
    // Clear the canvas before repainting
    this.#context.clearRect(0, 0, this.#canvasWidth, this.#canvasHeight);

    // Check if bandwidth is less than 1, if so calculate the average of the values that fall in 1 pixel
    if (this.#x.bandwidth() < 1) {
      let acc: HeatmapData = [];
      const np = Math.ceil(1 / this.#x.bandwidth());
      data.forEach((point) => {
        acc.push(point);
        if (acc.length === np) {
          // calculate average point
          const sum = acc.reduce((current, p) => {
            return current + p[2];
          }, 0);
          const newPoint = [...point];
          newPoint[2] = sum / np;
          this.drawRect(newPoint);
          acc = [];
        }
      });
    } else {
      data.forEach((point) => {
        this.drawRect(point);
      });
    }
  }

  drawHovered(highlightPoint: number[] = []): number | null {
    const area = select(this).select("g.hovered-area");
    area.selectAll("circle").remove();
    if (!this.#x || !this.#y || highlightPoint.length < 2) return null;
    let dataPoint = this.#data.filter(
      ([x, y]) => x === highlightPoint[0] && y === highlightPoint[1],
    );

    if (!dataPoint.length) {
      if (this.symmetric) {
        dataPoint = this.#data.filter(
          ([x, y]) => x === highlightPoint[1] && y === highlightPoint[0],
        );
      }
    }
    if (!dataPoint.length) return null;
    area
      .append("circle")
      .attr("cx", this.#x(highlightPoint[0]) || 0)
      .attr("cy", this.#y(highlightPoint[1]) || 0)
      .attr("fill", this.colorScale?.(dataPoint[0][2] || 0) || null)
      .attr("stroke", this["highlight-color"])
      .attr("stroke-width", 2)
      .attr("r", 10);
    return dataPoint[0][2] || 0;
  }

  drawRect(value: number[], highlight = false) {
    if (!this.#context || !this.#x || !this.#y) return;
    this.#context.beginPath();
    this.#context.fillStyle = highlight
      ? "black"
      : this.colorScale?.(value[2]) || "black";
    this.#context.fillRect(
      this.#x(value[0]) || 0,
      this.#y(value[1]) || 0,
      Math.ceil(this.#x.bandwidth()),
      Math.ceil(this.#y.bandwidth()),
    );
    // Symmetric half
    if (this.symmetric && !highlight)
      // Dont highlight the symmetrical point
      this.#context.fillRect(
        this.#x(value[1]) || 0,
        this.#y(value[0]) || 0,
        Math.ceil(this.#x.bandwidth()),
        Math.ceil(this.#y.bandwidth()),
      );
  }
}

export default NightingaleHeatmap;
