import React, { useState, useEffect } from "react";

import "@nightingale-elements/data-loader";
import "@nightingale-elements/nightingale-variation";
import "@nightingale-elements/nightingale-variation-adapter";
import "@nightingale-elements/nightingale-tooltip";
import "@nightingale-elements/nightingale-vcf-adapter";

import Readme from "./Readme";
import readmeContent from "../../../packages/nightingale-variation/README.md";

const NightingaleVariationWrapper = () => {
  const [tooltipContent, setTooltipContent] = useState();
  const [visible, setVisible] = useState(false);
  const [x, setX] = useState(200);
  const [y, setY] = useState(50);

  useEffect(() => {
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
      <nightingale-tooltip
        title="My tooltip"
        x={x}
        y={y}
        visible={visible ? "" : undefined}
      >
        <div dangerouslySetInnerHTML={tooltipContent}></div>
      </nightingale-tooltip>
      <nightingale-variation length="770">
        <nightingale-variation-adapter>
          <data-loader>
            <source src="https://www.ebi.ac.uk/proteins/api/variation/P05067" />
          </data-loader>
        </nightingale-variation-adapter>
      </nightingale-variation>
    </>
  );
};

export default NightingaleVariationWrapper;
