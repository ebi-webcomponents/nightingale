import { customElement, property } from "lit/decorators.js";
import {
  select,
  scaleBand,
  scaleLinear,
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

type HeatmapData = Array<[number, number, number]>;
type HeatmapPoint = { xPoint: number; yPoint: number };

@customElement("nightingale-heatmap")
class NightingaleHeatmap extends withResizable(
  withMargin(withPosition(withDimensions(withHighlight(NightingaleElement))))
) {
  @property({ type: Boolean, attribute: "symmetric" })
  symmetricMap = false;

  #data: HeatmapData = [];
  #canvasWidth = 0;
  #canvasHeight = 0;
  #context?: CanvasRenderingContext2D | null;
  #x?: ScaleBand<number>;
  #y?: ScaleBand<number>;

  set data(data: HeatmapData) {
    // If length is not specified, the last value from the data is taken as the dimension for the matrix
    if (!this.length) {
      const [lastValue] = data[data.length - 1];
      this.length = lastValue;
    }

    // Filling missing values
    const newArray: HeatmapData = [];
    let i = 1;
    let j = 1;
    for (let k = 0; k < data.length; k++) {
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
        j = this.symmetricMap ? i : 1;
        fillArray(newArray);
      }
    }
    this.#data = newArray;
    this.render();
  }

  get data(): HeatmapData {
    return this.#data;
  }

  render() {
    if (!this.#data.length) {
      return;
    }
    this.style.display = "block";

    // clear all previous vis
    select(this).select(".contact-map").remove();
    select(this).select("svg").remove();
    select(this).select("canvas").remove();

    if (this.#data.length) {
      this.createHeatMap(this.#data);
    }
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
      })
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
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("class", "svg-heatmap")
      .style("position", "absolute")
      .append("g")
      .attr("class", "svg-heatmap-group")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const canvas = select(this)
      .append("canvas")
      .attr("width", this.#canvasWidth)
      .attr("height", this.#canvasHeight)
      .style("margin-left", `${margin.left}px`)
      .style("margin-top", `${margin.top}px`)
      .attr("class", "canvas-heatmap")
      .style("position", "absolute");

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

    // Adding axes
    const xAxis = axisBottom(this.#x).tickSize(3).tickValues(tickValues);
    svg
      .append("g")
      .style("font-size", 15)
      .attr("transform", `translate(0,${this.#canvasHeight})`)
      .call(xAxis)
      .select(".domain")
      .remove();
    const yAxis = axisLeft(this.#y).tickSize(3).tickValues(tickValues);
    svg
      .append("g")
      .style("font-size", 15)
      .call(yAxis)
      .select(".domain")
      .remove();

    // text label for axes
    svg
      .append("text")
      .attr(
        "transform",
        `translate(${this.#canvasWidth / 2},${this.#canvasHeight + margin.top})`
      )
      .style("text-anchor", "middle")
      .text("Residue");
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - this.#canvasHeight / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Residue");

    // Draw on canvas
    this.refreshHeatmap(data);

    const mousemove = (event: MouseEvent) => {
      if (!this.#x || !this.#y) return;
      const xDomainValue = Math.floor(
        (this.#x.domain().length * event.offsetX) / this.#x.range()[1]
      );
      const yDomainValue = Math.floor(
        (this.#y.domain().length * event.offsetY) / this.#y.range()[1]
      );
      if (xDomainValue >= 0 && yDomainValue >= 0) {
        const xPoint = this.#x.domain()[xDomainValue];
        const yPoint = this.#y.domain()[yDomainValue];
        this.refreshHeatmap(data, [xPoint, yPoint]);
        this.#dispatchSelectionPoint("mousemove", { xPoint, yPoint });
      }
    };

    const mouseout = () => {
      this.refreshHeatmap(data);
      this.#dispatchSelectionPoint("mouseout");
    };

    select(".canvas-heatmap").on("mousemove", mousemove);
    select(".canvas-heatmap").on("mouseout", mouseout);
  }

  refreshHeatmap(data: HeatmapData, highlightPoint: number[] = []) {
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

    if (highlightPoint.length === 2) {
      this.drawRect(highlightPoint, true);
    }
  }

  drawRect(value: number[], highlight = false) {
    if (!this.#context || !this.#x || !this.#y) return;
    const colorScale = scaleLinear<string, string>()
      .domain([0, 1])
      .range(["darkblue", "yellow"]);
    this.#context.beginPath();
    this.#context.fillStyle = highlight ? "black" : colorScale(value[2]);
    this.#context.fillRect(
      this.#x(value[0]) || 0,
      this.#y(value[1]) || 0,
      Math.ceil(this.#x.bandwidth()),
      Math.ceil(this.#y.bandwidth())
    );
    // Symmetric half
    if (this.symmetricMap && !highlight)
      // Dont highlight the symmetrical point
      this.#context.fillRect(
        this.#x(value[1]) || 0,
        this.#y(value[0]) || 0,
        Math.ceil(this.#x.bandwidth()),
        Math.ceil(this.#y.bandwidth())
      );
  }
}

export default NightingaleHeatmap;
