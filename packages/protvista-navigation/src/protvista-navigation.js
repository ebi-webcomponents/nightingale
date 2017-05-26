import * as d3 from "d3";

const navHeight = 40,
      width = 400,
      padding = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
      };

class ProtVistaNavigation extends HTMLElement {

  constructor() {
    super();
    this._length = this.getAttribute('length');
    this._start = this.getAttribute('start') || 1;
    this._end = this.getAttribute('end') || 1;
    this._highlightStart = this.getAttribute('highlightStart');
    this._highlightEnd = this.getAttribute('highlightEnd');
  }

  connectedCallback() {
    this._createNavRuler();
  }

  _createNavRuler() {
    var navWithTrapezoid = 50;

    var navXScale = d3.scale.linear()
      .domain([1, this._length-1])
      .range([padding.left, width - padding.right]);

    var svg = container
      .append('div')
      .attr('class', 'up_pftv_navruler')
      .append('svg')
      .attr('id', 'up_pftv_svg-navruler')
      .attr('width', width)
      .attr('height', (navWithTrapezoid));

    var navXAxis = d3.svg.axis()
      .scale(fv.xScale)
      .orient('bottom');

    svg.append('g')
      .attr('class', 'x axis')
      .call(navXAxis);

    var viewport = d3.svg.brush()
      .x(navXScale)
      .on("brush", function() {
        var s = d3.event.target.extent();
        if ((s[1] - s[0]) < fv.maxZoomSize) {
          d3.event.target.extent([s[0], s[0] + fv.maxZoomSize]);
          d3.event.target(d3.select(this));
        }
        fv.xScale.domain(viewport.empty() ? navXScale.domain() : viewport.extent());
        update(fv);
        viewport.updateTrapezoid();
      });
    viewport.on("brushstart", function() {
      closeTooltipAndPopup(fv);
    });
    viewport.on("brushend", function() {
      updateZoomFromChart(fv);
      var navigator = fv.globalContainer.select('.up_pftv_navruler .extent');
      if (+navigator.attr('width') >= fv.width - fv.padding.left - fv.padding.right) {
        updateZoomButton(fv, 'up_pftv_icon-zoom-out', 'up_pftv_icon-zoom-in', 'Zoom in to sequence view');
      }
    });

    var arc = d3.svg.arc()
      .outerRadius(navHeight / 4)
      .startAngle(0)
      .endAngle(function(d, i) {
        return i ? -Math.PI : Math.PI;
      });

    svg.append("g")
      .attr("class", "up_pftv_viewport")
      .call(viewport)
      .selectAll("rect")
      .attr("height", navHeight);

    viewport.trapezoid = svg.append("g")
      .selectAll("path")
      .data([0]).enter().append("path")
      .classed("up_pftv_trapezoid", true);

    viewport.domainStartLabel = svg.append("text")
      .attr('class', 'domain-label')
      .attr('x', 0)
      .attr('y', navHeight);

    viewport.domainEndLabel = svg.append("text")
      .attr('class', 'domain-label')
      .attr('x', fv.width)
      .attr('y', navHeight)
      .attr('text-anchor', 'end');

    svg.selectAll(".resize").append("path")
      .attr("transform", "translate(0," + ((navHeight / 2) - 5) + ")")
      .attr('class', 'handle')
      .attr("d", arc);

    viewport.updateTrapezoid = function() {
      var begin = fv.globalContainer.select(".up_pftv_navruler .extent").attr("x");
      var tWidth = fv.globalContainer.select(".up_pftv_navruler .extent").attr("width");
      var end = (+begin) + (+tWidth);
      var path = "M0," + (navWithTrapezoid) + "L0" + "," + (navWithTrapezoid - 2) +
        "L" + begin + "," + (navHeight - 12) + "L" + begin + "," + navHeight +
        "L" + end + "," + navHeight + "L" + end + "," + (navHeight - 12) +
        "L" + fv.width + "," + (navWithTrapezoid - 2) + "L" + fv.width + "," + (navWithTrapezoid) + "Z";
      this.trapezoid.attr("d", path);
      this.domainStartLabel.text(Math.round(fv.xScale.domain()[0]));
      this.domainEndLabel.text(Math.min(Math.round(fv.xScale.domain()[1]), fv.maxPos));
    };

    viewport.clearTrapezoid = function() {
      this.trapezoid.attr("d", "M0,0");
    };

    return viewport;
  }
}

export default ProtVistaNavigation;
