import React, { useEffect, Fragment } from "react";
import NightingaleLinegraphTrack from "nightingale-linegraph-track";
import loadWebComponent from "../utils/load-web-component";
import Readme from "./Readme";
import readmeContent from "../../../packages/nightingale-linegraph-track/README.md";

import data from "../mocks/line-graph-chart.json";

const NightingaleLineGraphTrackWrapper = () => {
  useEffect(() => {
    loadWebComponent("nightingale-linegraph-track", NightingaleLinegraphTrack);
    document.querySelector("#track").data = data;
  }, []);

  return (
    <Fragment>
      <Readme content={readmeContent} />
      <nightingale-linegraph-track id="track" length="100" height="50" />
    </Fragment>
  );
};

export default NightingaleLineGraphTrackWrapper;
