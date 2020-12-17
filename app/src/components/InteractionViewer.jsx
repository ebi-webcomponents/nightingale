import React, { Fragment } from "react";
import InteractionViewer from "@nightingale-elements/nightingale-interaction-viewer";
import loadWebComponent from "../utils/load-web-component";
import Readme from "./Readme";
import readmeContent from "../../../packages/interaction-viewer/README.md";

const InteractionViewerWrapper = (props) => {
  loadWebComponent("interaction-viewer", InteractionViewer);
  return (
    <Fragment>
      <Readme content={readmeContent} />
      <interaction-viewer accession="Q8N1B4" />
    </Fragment>
  );
};

export default InteractionViewerWrapper;
