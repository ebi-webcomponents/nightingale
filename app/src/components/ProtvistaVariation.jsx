import React, { Fragment } from "react";

import DataLoader from "../../../packages/data-loader/src/data-loader";
import ProtvistaTooltip from "../../../packages/protvista-tooltip/src/protvista-tooltip";
import ProtvistaZoomable from "../../../packages/protvista-zoomable/src/protvista-zoomable";
import ProtvistaTrack from "../../../packages/protvista-track/src/protvista-track";
import ProtvistaVariation from "../../../packages/protvista-variation/src/protvista-variation";

const ProtvistaVariationWrapper = props => {
  window.ProtvistaZoomable = ProtvistaZoomable;
  return (
    <Fragment>
      <protvista-variation length="770">
        <data-loader>
          <source src="https://www.ebi.ac.uk/proteins/api/variation/P05067" />
        </data-loader>
      </protvista-variation>
    </Fragment>
  );
};

export default ProtvistaVariationWrapper;
