import React, { Fragment } from "react";
import InteractionViewer from "interaction-viewer";
import loadWebComponent from "../utils/load-web-component";
import Readme from "./Readme";
import readmeContent from "../../../packages/interaction-viewer/README.md";

const InteractionViewerWrapper = props => {
  loadWebComponent("interaction-viewer", InteractionViewer);
  return (
    <Fragment>
      <Readme content={readmeContent} />
      <interaction-viewer accession="O60941" />
      {/* <option value="A0A024R6G0">A0A024R6G0 1 interaction</option>
      <option value="A1Z9X0">A1Z9X0 5 interactions</option>
      <option value="A4JYL6">A4JYL6 10 interactions</option>
      <option value="A8BBG3" selected>
        A8BBG3 15 interactions
      </option>
      <option value="O60941">O60941 20 interactions</option>
      <option value="P05067">P05067</option>
      <option value="Q30201">Q30201 doesn't load</option>
      <option value="O00311">O00311 name overlaps</option>
      <option value="Q7Z3S9">Q7Z3S9 more than 200</option>
      <option value="P60484">P60484 self interaction</option>
      <option value="A0A024R4Q5">A0A024R4Q5 TrEMBL</option>
      <option value="P35555">P35555 Isoform</option>
      <option value="P38398">P38398 other has self interactions</option> */}
    </Fragment>
  );
};

export default InteractionViewerWrapper;
