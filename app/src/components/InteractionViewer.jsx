import React, { Fragment } from "react";
import Readme from "./Readme";
import readmeContent from "../../../packages/interaction-viewer/README.md";

import "interaction-viewer";

const InteractionViewerWrapper = (props) => {
  // loadWebComponent("interaction-viewer", InteractionViewer);
  return (
    <Fragment>
      <Readme content={readmeContent} />
      <interaction-viewer accession="O00311" />
    </Fragment>
  );
};

export default InteractionViewerWrapper;
