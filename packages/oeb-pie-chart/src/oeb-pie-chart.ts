import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import bb, {Chart, pie} from "billboard.js";

import NightingaleElement, {
  withDimensions,
  withMargin,
  withResizable,
  withManager,
} from "@nightingale-elements/nightingale-new-core";

@customElement("oeb-pie-chart")
class OebPieChart extends withManager(
  withResizable(withMargin(withDimensions(NightingaleElement)))
) {
  @property({ type: String })
  title = 'Title';
  @property({ type: Number })
  val1 = 3;
  @property({ type: Number })
  val2 = 7;
  @property({ type: String })
  label1 = "Label 1";
  @property({ type: String })
  label2 = "Label 2";

  public chart : Chart | undefined;

  constructor() {
    super();
  }

  private createPieChart() {
    this.chart = bb.generate({
      size: {
          height: this.height,
          width: this.width,
      },
      title: {
          text: this.title,
      },
      data: {
          columns: [
              [
                this.label1,
                this.val1,
              ],
              [
                this.label2,
                this.val2
              ],
          ],
          type: pie(),
      },
      bindto: "#rendererWrapper",
    });
  }

  render() {
    return html`<div class="item" id="rendererWrapper"/>`;
  }

  updated(changedProperties: Map<string, unknown>) {
    this.renderC3();
    super.updated(changedProperties);
  }

  firstUpdated() {
    this.createPieChart();
  }

  renderC3() {
    if (this.chart)
      this.chart.load({
        columns: [
          [
              this.label1,
              this.val1,
          ],
          [
            this.label2,
            this.val2
          ],
        ],
		});
  }

}

export default OebPieChart;
