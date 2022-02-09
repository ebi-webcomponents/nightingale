import { css } from "lit";

const styles = css`
  :host {
    position: relative;
  }

  :host #container {
    margin-top: 1rem;
  }

  :host text {
    font-family: "Open Sans", sans-serif;
    fill: black;
    opacity: 0.75;
    font-size: 12px;
  }

  :host .active text {
    opacity: 1;
  }

  :host .active-row {
    stroke: #4a90e2;
  }

  :host .cell {
    fill: #4a90e2;
    cursor: pointer;
  }

  :host .cell:hover {
    fill: red;
    fill-opacity: 1;
    transition: all 0.5s;
  }

  :host .hidden-side {
    fill: #e8e8e8;
  }

  :host .main-accession {
    font-weight: bold;
  }

  :host .text-highlight {
    fill: #fff;
    opacity: 0;
    -webkit-transition: all 0.5s;
    /* Safari */
    transition: all 0.5s;
  }
`;

export default styles;
