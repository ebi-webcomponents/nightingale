import React, { Fragment } from "react";
import TextareaSequence from "textarea-sequence";
import loadWebComponent from "../utils/load-web-component";
// import Readme from "./Readme";
import readmeContent from "../../../packages/protvista-navigation/README.md";

const ProtvistaNavigationWrapper = props => {
  loadWebComponent("textarea-sequence", TextareaSequence);
  return (
    <Fragment>
      {/* <Readme content={readmeContent} /> */}
      <textarea-sequence />
    </Fragment>
  );
};

export default ProtvistaNavigationWrapper;
