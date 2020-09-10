import React, { useState, useCallback, useEffect } from "react";
import DataLoader from "data-loader";
import ProtvistaVariation from "protvista-variation";
import ProtvistaVariationAdapter from "protvista-variation-adapter";
import loadWebComponent from "../utils/load-web-component";
import Readme from "./Readme";
import readmeContent from "../../../packages/protvista-variation/README.md";

const ProtvistaVariationWrapper = () => {
  const [tooltipContent, setTooltipContent] = useState();

  const handleEvent = (e) => {
    if (e.detail.eventtype === "click") {
      setTooltipContent({ __html: e.detail.feature.tooltipContent });
    }
  };

  useEffect(() => {
    loadWebComponent("protvista-variation", ProtvistaVariation);
    loadWebComponent("data-loader", DataLoader);
    loadWebComponent("protvista-variation-adapter", ProtvistaVariationAdapter);
    window.addEventListener("change", handleEvent);
    return () => {
      window.removeEventListener("change", handleEvent);
    };
  }, []);

  return (
    <>
      <Readme content={readmeContent} />
      <protvista-variation length="770">
        <protvista-variation-adapter>
          <data-loader>
            <source src="https://wwwdev.ebi.ac.uk/proteins/api/variation/P05067" />
          </data-loader>
        </protvista-variation-adapter>
      </protvista-variation>
      <div dangerouslySetInnerHTML={tooltipContent}></div>
    </>
  );
};

export default ProtvistaVariationWrapper;
