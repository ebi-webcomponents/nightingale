import React, { useEffect, useRef } from "react";

import htmlContent from "../../../documentation/GETTING_STARTED.md";
import createComponentContent from "../../../documentation/CREATE_A_BASIC_COMPONENT.md";
import createAdapterContent from "../../../documentation/CREATE_AN_ADAPTER.md";

import Readme from "../components/Readme";

const GettingStarted = () => {
  return <Readme content={htmlContent} />;
};
export const CreateComponent = () => {
  return <Readme content={createComponentContent} />;
};
export const CreateAdapter = () => {
  return <Readme content={createAdapterContent} />;
};

export default GettingStarted;
