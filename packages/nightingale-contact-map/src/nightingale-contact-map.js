import { select, scaleBand, scaleLinear, axisBottom, axisLeft } from "d3";

class NightingaleContactMap extends HTMLElement {
  connectedCallback() {
    this._dimension = Number(this.getAttribute("dimension")) || 650;
    if (this._data) this.render();
  }

  static get observedAttributes() {
    return ["dimension"];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === "dimension" && oldVal != null && oldVal !== newVal) {
      this._dimension = newVal;
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
    this.style.minHeight = "6em";

    // clear all previous vis
    select(this).select(".contact-map").remove();
    select(this).select("svg").remove();

    if (this._data) {
      this.drawHeatMap(this._data);
    }
  }

  drawHeatMap(data) {
    const margin = { top: 80, right: 25, bottom: 30, left: 40 };
    const width = this._dimension;
    const height = width;

    const svg = select(this)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("class", "contact-map")
      .append("g")
      .attr("class", "contact-map-group")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale
    const x = scaleBand()
      .range([0, width])
      .domain(data.map((value) => value[0]));
    const symmetricX = scaleBand()
      .range([0, width])
      .domain(data.map((value) => value[1]));

    // Y scale
    const y = scaleBand()
      .range([0, height])
      .domain(data.map((value) => value[1]));
    const symmetricY = scaleBand()
      .range([0, height])
      .domain(data.map((value) => value[0]));

    // Ticks interval
    const total = x.domain().length;
    const tickValues = [1];
    let position = 50;
    while (total > 0 && position <= total) {
      tickValues.push(Math.min(total, position));
      position += 50;
    }

    // X axis
    const xAxis = axisBottom(x).tickSize(3).tickValues(tickValues);
    svg
      .append("g")
      .style("font-size", 15)
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .select(".domain")
      .remove();
    // Y axis
    const yAxis = axisLeft(y).tickSize(3).tickValues(tickValues);
    svg
      .append("g")
      .style("font-size", 15)
      .call(yAxis)
      .select(".domain")
      .remove();

    const colorScale = scaleLinear().domain([0, 1]).range(["orange", "blue"]);

    const half = svg
      .selectAll(".half")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "half");
    half
      .attr("x", (d) => x(d[0]))
      .attr("y", (d) => y(d[1]))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", (d) => colorScale(d[2]));

    const symmetricHalf = svg
      .selectAll(".symmetric-half")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "symmetric-half");
    symmetricHalf
      .attr("x", (d) => symmetricX(d[1]))
      .attr("y", (d) => symmetricY(d[0]))
      .attr("width", symmetricX.bandwidth())
      .attr("height", symmetricX.bandwidth())
      .style("fill", (d) => colorScale(d[2]));
  }
}

export default NightingaleContactMap;
