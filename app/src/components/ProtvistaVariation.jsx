import React, { Fragment } from "react";

import DataLoader from "data-loader";
import ProtvistaVariation from "protvista-variation";

const ProtvistaVariationWrapper = props => {
  window.customElements.define("protvista-variation", ProtvistaVariation);
  window.customElements.define("data-loader", DataLoader);
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
