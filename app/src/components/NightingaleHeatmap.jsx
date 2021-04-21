import React, { Fragment, Component } from "react";
import NightingaleHeatmap from "nightingale-heatmap";
import loadWebComponent from "../utils/load-web-component";
import data from "../mocks/contact-map.json";
import Readme from "./Readme";
import readmeContent from "../../../packages/nightingale-heatmap/README.md";

class NightingaleHeatmapWrapper extends Component {
  componentDidMount() {
    document.querySelector("#map").data = data.value;
  }

  render() {
    loadWebComponent("nightingale-heatmap", NightingaleHeatmap);
    return (
      <Fragment>
        <Readme content={readmeContent} />
        <nightingale-heatmap id="map" width={"560"} height={"560"} />
      </Fragment>
    );
  }
}

export default NightingaleHeatmapWrapper;
