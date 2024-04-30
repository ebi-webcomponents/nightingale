import { html } from "lit";
import NightingaleElement, { customElementOnce, withDimensions, withHighlight, withManager, withMargin, withPosition, withResizable, withZoom } from "@nightingale-elements/nightingale-new-core";

// TODO: height is not triggering a full redrawn when is changed after first render
const ATTRIBUTES_THAT_TRIGGER_REFRESH = ["length", "width", "height"];

@customElementOnce("nightingale-heatmap-hotmap")
class NightingaleHeatmapHotmap extends withManager(
  withZoom(
    withResizable(
      withMargin(
        withPosition(withDimensions(withHighlight(NightingaleElement))),
      ),
    ),
  ),
) {

  /**
   * 1st ON CREATED: Called once for each attribute on order they appear
   * 4th ON CREATED: Additional or duplicate call based on Mixins (see below:)
   *     - withResizable adds min-width, min-height
   *     - withHighlight duplicate set highlight-color
   *     - withPosition duplicate set display-start and display-end
   * 
   * 1st ON UPDATED: Called once by each attribute updated by manager
   */
  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    // console.log("attributeChangedCallback")
    super.attributeChangedCallback(name, oldValue, newValue);
    if (
      ATTRIBUTES_THAT_TRIGGER_REFRESH.includes(name) ||
      name.startsWith("margin-")
    ) {
      // console.log("FOR: " + ATTRIBUTES_THAT_TRIGGER_REFRESH.toString())
    }
    // console.log(name, oldValue, newValue)
    // console.log("")
  }

  /**
   * 2nd ON CREATED
   */
  connectedCallback() {
    // console.log("connectedCallback")
    // console.log("")
    super.connectedCallback();
  }

  /**
   * 3rd ON CREATED
   * 
   * 2nd ON UPDATED
   */
  render() {
    // console.log("render")
    // console.log("")
    return html`<h1 class="hello-world-hotmap">Hi I am the hotmap container</h1>`;
  }

  /**
   * 5TH (last) ON CREATED (1st is also 4th)
   */
  firstUpdated() {
    // console.log("firstUpdated")
    // console.log("")
  }
 
}
export default NightingaleHeatmapHotmap;
