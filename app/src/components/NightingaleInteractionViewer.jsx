import React from "react";

import Readme from "./Readme";
import readmeContent from "../../../packages/nightingale-interaction-viewer/README.md";

import "@nightingale-elements/nightingale-interaction-viewer";

const InteractionViewerWrapper = () => (
  <>
    <Readme content={readmeContent} />
    <nightingale-interaction-viewer accession="Q8N1B4" />
  </>
);

export default InteractionViewerWrapper;
