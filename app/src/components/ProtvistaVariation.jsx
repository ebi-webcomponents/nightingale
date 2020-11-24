import React, { useState, useCallback, useEffect } from "react";
import DataLoader from "data-loader";
import ProtvistaVariation from "protvista-variation";
import ProtvistaVariationAdapter from "protvista-variation-adapter";
import VCFAdapter from "protvista-vcf-adapter";
import loadWebComponent from "../utils/load-web-component";
import Readme from "./Readme";
import readmeContent from "../../../packages/protvista-variation/README.md";

const ProtvistaVariationWrapper = () => {
  const [tooltipContent, setTooltipContent] = useState();

  useEffect(() => {
    loadWebComponent("protvista-variation", ProtvistaVariation);
    loadWebComponent("data-loader", DataLoader);
    loadWebComponent("protvista-variation-adapter", ProtvistaVariationAdapter);
    loadWebComponent("protvista-vcf-adapter", VCFAdapter);

    const handleEvent = (e) => {
      if (e.detail.eventtype === "click") {
        setTooltipContent({ __html: e.detail.feature.tooltipContent });
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
      <protvista-variation length="770">
        {/* <protvista-variation-adapter>
          <data-loader>
            <source src="https://www.ebi.ac.uk/proteins/api/variation/P05067" />
          </data-loader>
        </protvista-variation-adapter> */}
        <protvista-vcf-adapter accession="P01008">
          <data-loader>
            <source src="https://www.ebi.ac.uk/proteins/api/variation/P05067" />
          </data-loader>
        </protvista-vcf-adapter>
      </protvista-variation>
      <div dangerouslySetInnerHTML={tooltipContent}></div>
    </>
  );
};

export default ProtvistaVariationWrapper;
