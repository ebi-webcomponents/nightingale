import React, { Fragment, useEffect } from "react";
import ProtvistaTooltip from "protvista-tooltip";
import loadWebComponent from "../utils/load-web-component";
import Readme from './Readme';
import readmeContent from '../../../packages/protvista-tooltip/README.md'

const ProtvistaTooltipWrapper = () => {
  useEffect(() => {
    const tooltip = document.querySelector("protvista-tooltip");
    tooltip.style.setProperty("top", "300px");
    tooltip.style.setProperty("left", "300px");
    tooltip.style.setProperty("display", "block");

    tooltip.title = "My tooltip";
    tooltip.innerHTML = "<p>Some HTML</p>";
    tooltip.visible = true;
  });
  loadWebComponent("protvista-tooltip", ProtvistaTooltip);

  return (
    <Fragment>
      <Readme content={readmeContent}/>
      <protvista-tooltip />
    </Fragment>
  );
};

export default ProtvistaTooltipWrapper;
