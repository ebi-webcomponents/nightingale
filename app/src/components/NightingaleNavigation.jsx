import React from "react";

import Readme from "./Readme";
import readmeContent from "../../../packages/nightingale-navigation/README.md";

import "@nightingale-elements/nightingale-navigation";

const NightingaleNavigationWrapper = () => (
  <>
    <Readme content={readmeContent} />
    <nightingale-navigation
      length="456"
      displaystart="143"
      displayend="400"
      highlight="23:45"
      rulerstart="50"
    />
  </>
);

export default NightingaleNavigationWrapper;
