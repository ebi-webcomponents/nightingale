import React, { useRef, useEffect } from "react";
import "@nightingale-elements/data-loader";
import "@nightingale-elements/nightingale-variation";
import "@nightingale-elements/nightingale-filter";
import "@nightingale-elements/nightingale-track";
import "@nightingale-elements/nightingale-variation-adapter";
import "@nightingale-elements/nightingale-feature-adapter";
import "@nightingale-elements/nightingale-manager";
import Readme from "./Readme";
import readmeContent from "../../../packages/nightingale-filter/README.md";
import variantFilters, { colorConfig } from "../mocks/filterConfig";
import featureFilters from "../mocks/filterFeaturesConfig";

const NightingaleFilterWrapper = () => {
  const variantFilterRef = useRef(null);
  const variationRef = useRef(null);

  const featureFilterRef = useRef(null);

  useEffect(() => {
    if (variantFilterRef !== null) {
      variantFilterRef.current.filters = variantFilters;
      featureFilterRef.current.filters = featureFilters;
    }
    if (variationRef !== null) {
      variationRef.current.colorConfig = colorConfig;
    }
  });

  return (
    <>
      <Readme content={readmeContent} />
      <nightingale-manager attributes="activefilters filters">
        <h3>Track Filter</h3>
        <div style={{ display: "flex" }}>
          <nightingale-filter
            style={{ minWidth: "20%" }}
            for="my-track"
            ref={featureFilterRef}
          />
          <nightingale-track
            style={{ minWidth: "70%" }}
            length="770"
            id="my-track"
          >
            <nightingale-feature-adapter id="adapter1">
              <data-loader>
                <source src="https://www.ebi.ac.uk/proteins/api/features/P05067?categories=PTM" />
              </data-loader>
            </nightingale-feature-adapter>
          </nightingale-track>
        </div>
        <h3>Variation filter</h3>
        <div style={{ display: "flex" }}>
          <nightingale-filter
            style={{ minWidth: "20%" }}
            for="my-variation-track"
            ref={variantFilterRef}
          />
          <nightingale-variation
            length="770"
            style={{ minWidth: "70%" }}
            id="my-variation-track"
            ref={variationRef}
          >
            <nightingale-variation-adapter>
              <data-loader>
                <source src="https://www.ebi.ac.uk/proteins/api/variation/P05067" />
              </data-loader>
            </nightingale-variation-adapter>
          </nightingale-variation>
        </div>
      </nightingale-manager>
    </>
  );
};

export default NightingaleFilterWrapper;
