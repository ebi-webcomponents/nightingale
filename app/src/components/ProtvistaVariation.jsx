import React, { useState, useCallback, useEffect } from "react";
import DataLoader from "@nightingale-elements/data-loader";
import ProtvistaVariation from "@nightingale-elements/nightingale-variation";
import ProtvistaVariationAdapter from "@nightingale-elements/nightingale-variation-adapter";
import ProtvistaTooltip from "@nightingale-elements/nightingale-tooltip";
import VCFAdapter from "@nightingale-elements/nightingale-vcf-adapter";
import loadWebComponent from "../utils/load-web-component";
import Readme from "./Readme";
import readmeContent from "../../../packages/protvista-variation/README.md";

const ProtvistaVariationWrapper = () => {
  const [tooltipContent, setTooltipContent] = useState();
  const [visible, setVisible] = useState(false);
  const [x, setX] = useState(200);
  const [y, setY] = useState(50);

  useEffect(() => {
    loadWebComponent("protvista-variation", ProtvistaVariation);
    loadWebComponent("data-loader", DataLoader);
    loadWebComponent("protvista-variation-adapter", ProtvistaVariationAdapter);
    loadWebComponent("protvista-vcf-adapter", VCFAdapter);
    loadWebComponent("protvista-tooltip", ProtvistaTooltip);

    const handleEvent = (e) => {
      if (e.detail.eventtype === "click") {
        setTooltipContent({ __html: e.detail.feature.tooltipContent });
        setX(e.detail.coords[0]);
        setY(e.detail.coords[1]);
        setVisible((visible) => !visible);
      }
    };

    window.addEventListener("change", handleEvent);
    return () => {
      window.removeEventListener("change", handleEvent);
    };
  }, []);

  return (
    <>
      <Readme content={readmeContent} />
      <protvista-tooltip
        title="My tooltip"
        x={x}
        y={y}
        visible={visible ? "" : undefined}
      >
        <div dangerouslySetInnerHTML={tooltipContent}></div>
      </protvista-tooltip>
      <protvista-variation length="770">
        <protvista-variation-adapter>
          <data-loader>
            <source src="https://www.ebi.ac.uk/proteins/api/variation/P05067" />
          </data-loader>
        </protvista-variation-adapter>
      </protvista-variation>
    </>
  );
};

export default ProtvistaVariationWrapper;
