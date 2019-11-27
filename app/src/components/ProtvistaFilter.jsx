import React, { Fragment, useRef, useEffect } from "react";
import DataLoader from "data-loader";
import ProtvistaVariation from "protvista-variation";
import ProtvistaFilter from "protvista-filter";
import ProtvistaTrack from "protvista-track";
import ProtvistaVariationAdapter from "protvista-variation-adapter";
import ProtvistaFeatureAdapter from "protvista-feature-adapter";
import ProtvistaManager from "protvista-manager";
import loadWebComponent from "../utils/load-web-component";
import Readme from "./Readme";
import readmeContent from "../../../packages/protvista-filter/README.md";
import variantFilters, { colorConfig } from "../mocks/filterConfig";
import featureFilters from "../mocks/filterFeaturesConfig";

const ProtvistaFilterWrapper = () => {
  loadWebComponent("protvista-variation", ProtvistaVariation);
  loadWebComponent("data-loader", DataLoader);
  loadWebComponent("protvista-track", ProtvistaTrack);
  loadWebComponent("protvista-feature-adapter", ProtvistaFeatureAdapter);
  loadWebComponent("protvista-variation-adapter", ProtvistaVariationAdapter);
  loadWebComponent("protvista-manager", ProtvistaManager);
  loadWebComponent("protvista-filter", ProtvistaFilter);

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
    <Fragment>
      <Readme content={readmeContent} />
      <protvista-manager attributes="activefilters filters">
        <h3>Track Filter</h3>
        <div style={{ display: "flex" }}>
          <protvista-filter
            style={{ minWidth: "20%" }}
            for="my-track"
            ref={featureFilterRef}
          />
          <protvista-track
            style={{ minWidth: "70%" }}
            length="770"
            id="my-track"
          >
            <protvista-feature-adapter id="adapter1">
              <data-loader>
                <source src="https://www.ebi.ac.uk/proteins/api/features/P05067?categories=PTM" />
              </data-loader>
            </protvista-feature-adapter>
          </protvista-track>
        </div>
        <h3>Variation filter</h3>
        <div style={{ display: "flex" }}>
          <protvista-filter
            style={{ minWidth: "20%" }}
            for="my-variation-track"
            ref={variantFilterRef}
          />
          <protvista-variation
            length="770"
            style={{ minWidth: "70%" }}
            id="my-variation-track"
            ref={variationRef}
          >
            <protvista-variation-adapter>
              <data-loader>
                <source src="https://www.ebi.ac.uk/proteins/api/variation/P05067" />
              </data-loader>
            </protvista-variation-adapter>
          </protvista-variation>
        </div>
      </protvista-manager>
    </Fragment>
  );
};

export default ProtvistaFilterWrapper;
