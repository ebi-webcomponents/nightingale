import React, { Fragment, Component } from "react";
import NightingaleSunburst from "nightingale-sunburst";
import loadWebComponent from "../utils/load-web-component";
import data from "../mocks/taxonomy.json";
// import Readme from "./Readme";
// import readmeContent from "../../../packages/nightingale-heatmap/README.md";

class NightingaleSunburstWrapper extends Component {
  constructor() {
    super();
    this.sunburst = React.createRef();
  }
  componentDidMount() {
    this.sunburst.current.data = data;
  }

  render() {
    loadWebComponent("nightingale-sunburst", NightingaleSunburst);
    return (
      <Fragment>
        {/* <Readme content={readmeContent} /> */}
        <nightingale-sunburst
          side={600}
          weight-attribute="numSequences"
          name-attribute="node"
          ref={this.sunburst}
          // max-depth={60}
        />
      </Fragment>
    );
  }
}

export default NightingaleSunburstWrapper;
