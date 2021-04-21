import {
  select,
  scaleBand,
  scaleLinear,
  axisBottom,
  axisLeft,
  event as d3Event,
} from "d3";

class NightingaleHeatmap extends HTMLElement {
  connectedCallback() {
    this._width = Number(this.getAttribute("width")) || 650;
    this._height = Number(this.getAttribute("width")) || 700;
    if (this._data) this.render();
  }

  static get observedAttributes() {
    return ["width", "height"];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (oldVal != null && oldVal !== newVal) {
      if (attrName === "width") this._width = newVal;
      if (attrName === "height") this._height = newVal;
      this.render();
    }
  }

  set data(data) {
    this._data = data;
    this.render();
  }

  render() {
    if (!this._data) {
      return;
    }
    this.style.display = "block";

    // clear all previous vis
    select(this).select(".contact-map").remove();
    select(this).select("svg").remove();
    select(this).select("canvas").remove();

    if (this._data) {
      this.drawHeatMap(this._data);
    }
  }

  _dispatchSelectionPoint(type, target, d) {
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

  drawHeatMap(data) {
    const margin = { top: 30, right: 25, bottom: 30, left: 40 };
    const canvasWidth = this._width - margin.left - margin.right;
    const canvasHeight = this._height - margin.top - margin.bottom;

    const svg = select(this)
      .append("svg")
      .attr("width", this._width)
      .attr("height", this._height)
      .attr("class", "svg-heatmap")
      .style("position", "absolute")
      .append("g")
      .attr("class", "svg-heatmap-group")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const canvas = select(this)
      .append("canvas")
      .attr("width", canvasWidth)
      .attr("height", canvasHeight)
      .style("margin-left", `${margin.left}px`)
      .style("margin-top", `${margin.top}px`)
      .attr("class", "canvas-heatmap")
      .style("position", "absolute");

    const context = canvas.node().getContext("2d");

    // X scale
    const x = scaleBand()
      .range([0, canvasWidth])
      .domain(data.map((value) => value[0]));

    // Y scale
    const y = scaleBand()
      .range([0, canvasHeight])
      .domain(data.map((value) => value[1]));

    // Ticks interval
    const total = x.domain().length;
    const tickValues = [1];
    let position = 50;
    while (total > 0 && position <= total) {
      tickValues.push(Math.min(total, position));
      position += 50;
    }

    // Adding axes
    const xAxis = axisBottom(x).tickSize(3).tickValues(tickValues);
    svg
      .append("g")
      .style("font-size", 15)
      .attr("transform", `translate(0,${canvasHeight})`)
      .call(xAxis)
      .select(".domain")
      .remove();
    const yAxis = axisLeft(y).tickSize(3).tickValues(tickValues);
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
        `translate(${canvasWidth / 2},${canvasHeight + margin.top})`
      )
      .style("text-anchor", "middle")
      .text("Residue");
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - canvasHeight / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Residue");

    const colorScale = scaleLinear().domain([0, 1]).range(["orange", "blue"]);

    // Draw on canvas
    const drawRect = (value) => {
      context.beginPath();
      context.fillStyle = colorScale(value[2]);
      context.fillRect(
        x(value[0]),
        y(value[1]),
        Math.floor(x.bandwidth()),
        Math.floor(y.bandwidth())
      );
      // Symmetric half
      context.fillRect(
        x(value[1]),
        y(value[0]),
        Math.floor(x.bandwidth()),
        Math.floor(y.bandwidth())
      );
    };

    data.forEach((point) => {
      drawRect(point);
    });

    const mousemove = () => {
      const xDomainValue = Math.floor(
        ((x.domain().length - 1) * d3Event.offsetX) / x.range()[1]
      );
      const yDomainValue = Math.floor(
        ((y.domain().length - 1) * d3Event.offsetY) / y.range()[1]
      );
      if (xDomainValue >= 0 && yDomainValue >= 0) {
        const xPoint = x.domain()[xDomainValue];
        const yPoint = y.domain()[yDomainValue];
        this._dispatchSelectionPoint("mousemove", this, { xPoint, yPoint });
      }
    };

    const mouseout = () => {
      this._dispatchSelectionPoint("mouseout", this);
    };

    select(".canvas-heatmap").on("mousemove", mousemove);
    select(".canvas-heatmap").on("mouseout", mouseout);
  }
}

export default NightingaleHeatmap;
