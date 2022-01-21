import React, { Fragment } from "react";
import InteractionViewer from "interaction-viewer";
import loadWebComponent from "../utils/load-web-component";
import Readme from "./Readme";
import readmeContent from "../../../packages/interaction-viewer/README.md";

const InteractionViewerWrapper = (props) => {
  loadWebComponent("interaction-viewer", InteractionViewer);
  return (
    <Fragment>
      <Readme content={readmeContent} />
      <interaction-viewer accession="Q8TD43" />
    </Fragment>
  );
};

export default InteractionViewerWrapper;
