import { select, scaleBand, scaleLinear, axisBottom, axisLeft } from "d3";

class NightingaleContactMap extends HTMLElement {
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
    this.style.minHeight = "6em";

    // clear all previous vis
    select(this).select(".contact-map").remove();
    select(this).select("svg").remove();

    if (this._data) {
      this.drawHeatMap(this._data);
    }
  }

  drawHeatMap(data) {
    const margin = { top: 30, right: 25, bottom: 30, left: 40 };
    const width = this._width - margin.left - margin.right;
    const height = this._height - margin.top - margin.bottom;

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

    // Adding axes
    const xAxis = axisBottom(x).tickSize(3).tickValues(tickValues);
    svg
      .append("g")
      .style("font-size", 15)
      .attr("transform", `translate(0,${height})`)
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
      .attr("transform", `translate(${width / 2},${height + margin.top})`)
      .style("text-anchor", "middle")
      .text("Residue");
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Residue");

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
