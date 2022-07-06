import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import * as Plotly from 'plotly.js';

import NightingaleElement, {
  withDimensions,
  withMargin,
  withResizable,
  withManager,
} from "@nightingale-elements/nightingale-new-core";

@customElement("oeb-roc-curve")
class OebRocCurve extends withManager(
  withResizable(withMargin(withDimensions(NightingaleElement)))
) {
  public trace1 : Plotly.Data = {
    x: [0, 0.5, 1],
    y: [0, 0.5, 1],
    name: 'random guide',
    mode: 'lines',
    type: 'scatter',
    hoverinfo: 'none',
    line: {
      dash: 'dot',
      width: 1,
      color: 'grey'
    },
    showlegend: false
  };

  public trace2 : Plotly.Data = {
    x: [0, 0.12, 0.3, 0.84, 0.95],
    y: [0, 0.56, 0.65, 0.95, 0.98],
    name:'Tool 1',
    mode: 'lines',
    type: 'scatter'
  };

  public trace3 : Plotly.Data = {
    x: [0, 0.1, 0.2, 0.43, 0.99],
    y: [0, 0.6, 0.79, 0.94,0.99],
    name: 'Tool 2',
    mode: 'lines',
    type: 'scatter'
  };

  public data: Plotly.Data[] = [
    this.trace1, this.trace2, this.trace3
  ];

  public layout = {
    width : 600,
    height: 500,
    xaxis: {
      title : 'False Positive Rate',
      mirror: true,
      linecolor: 'black',
      linewidth: 1,
      range: [0,1]
    },
    yaxis: {
      title: 'True Positive rate',
      mirror: true,
      linecolor: 'black',
      linewidth: 1,
      range: [0,1]
    }
  }

  constructor() {
    super();
  }

  private createRocChart() {
    Plotly.newPlot('chart', this.data, this.layout);
  }

  render() {
    return html`<div class="item" id="chart"/>`;
  }

  updated(changedProperties: Map<string, unknown>) {
    //this.renderC3();
    super.updated(changedProperties);
  }

  firstUpdated() {
    this.createRocChart();
  }

  // renderC3() {
  //   if (this.chart)
  //     this.chart.load({
  //       columns: [
  //         [
  //             this.label1,
  //             this.val1,
  //         ],
  //         [
  //           this.label2,
  //           this.val2
  //         ],
  //       ],
	// 	});
  // }

}

export default OebRocCurve;
