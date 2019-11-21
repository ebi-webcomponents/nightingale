import React, { Fragment, useRef, useEffect } from "react";
import DataLoader from "data-loader";
import ProtvistaVariation from "protvista-variation";
import ProtvistaFilter from "protvista-filter";
import ProtvistaVariationAdapter from "protvista-variation-adapter";
import ProtvistaManager from "protvista-manager";
import loadWebComponent from "../utils/load-web-component";
import filters, { colorConfig } from "../mocks/filterConfig";

const ProtvistaFilterWrapper = () => {
  loadWebComponent("protvista-variation", ProtvistaVariation);
  loadWebComponent("data-loader", DataLoader);
  loadWebComponent("protvista-variation-adapter", ProtvistaVariationAdapter);
  loadWebComponent("protvista-manager", ProtvistaManager);
  loadWebComponent("protvista-filter", ProtvistaFilter);

  const ref = useRef(null);
  const variationRef = useRef(null);

  useEffect(() => {
    if (ref !== null) {
      ref.current.filters = filters;
    }
    if (variationRef !== null) {
      variationRef.current.colorConfig = colorConfig;
    }
  });

  return (
    <Fragment>
      <protvista-manager
        attributes="activefilters filters"
        style={{ display: "flex" }}
      >
        <protvista-filter
          style={{ minWidth: "20%" }}
          for="my-variation-track"
          ref={ref}
        />
        <protvista-variation
          length="770"
          id="my-variation-track"
          ref={variationRef}
        >
          <protvista-variation-adapter>
            <data-loader>
              <source src="https://www.ebi.ac.uk/proteins/api/variation/P05067" />
            </data-loader>
          </protvista-variation-adapter>
        </protvista-variation>
      </protvista-manager>
    </Fragment>
  );
};

export default ProtvistaFilterWrapper;
