import React, { Fragment, useEffect } from "react";
import ProtvistaTooltip from "protvista-tooltip";
import loadWebComponent from "../utils/load-web-component";

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
      <protvista-tooltip />
    </Fragment>
  );
};

export default ProtvistaTooltipWrapper;
