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
}
export default NightingaleHeatmapHotmap;
