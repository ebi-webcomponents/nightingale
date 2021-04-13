import React, { Fragment, Component } from "react";
import NightingaleContactMap from "nightingale-contact-map";
import loadWebComponent from "../utils/load-web-component";
import data from "../mocks/contact-map.json";
import Readme from "./Readme";
import readmeContent from "../../../packages/nightingale-contact-map/README.md";

class NightingaleContactMapWrapper extends Component {
  componentDidMount() {
    document.querySelector("#map").data = data.value;
  }

  render() {
    loadWebComponent("nightingale-contact-map", NightingaleContactMap);
    return (
      <Fragment>
        <Readme content={readmeContent} />
        <nightingale-contact-map id="map" dimension={"560"} />
      </Fragment>
    );
  }
}

export default NightingaleContactMapWrapper;
