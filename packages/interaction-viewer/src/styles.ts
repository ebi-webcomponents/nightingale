import { css } from "lit";

const styles = css`
  :host {
    position: relative;
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

  :host .interaction-tooltip {
    z-index: 99999;
    position: absolute;
    background: #ffffff;
    padding: 0.5em 1em;
    border: 1px #979797 solid;
    box-shadow: 2px 2px 2px #333333;
    -webkit-transition: all 0.5s;
    /* Safari */
    transition: all 0.25s;
    min-width: 36em;
  }

  :host .interaction-tooltip .close-interaction-tooltip {
    cursor: pointer;
    float: right;
    margin-bottom: 0.8em;
  }

  :host .interaction-tooltip .tooltip-content {
    clear: both;
  }

  :host .interaction-filter-container {
    text-align: left;
  }

  :host .interaction-filter-container #filter-display .filter-selected {
    margin: 0.2em 0.5em;
    padding: 0.3em 0.1em;
    background-color: #f2f2f2;
    border: 1px solid #e8e8e8;
    cursor: pointer;
    white-space: nowrap;
    display: inline-block;
  }

  :host .interaction-filter-container #filter-display .filter-selected::after {
    content: "✖";
    margin: 0 0.3em;
  }

  :host .interaction-filter-container .interaction-filter {
    vertical-align: top;
    margin-bottom: 0.5em;
    display: inline-block;
  }

  :host .interaction-filter-container .interaction-filter ul {
    border: #e8e8e8 1px solid;
    max-height: 15em;
    overflow-y: auto;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  :host .interaction-filter-container .interaction-filter ul li {
    cursor: pointer;
    padding: 0.5em 0.5em;
    border-bottom: #e8e8e8 1px solid;
  }

  :host .interaction-filter-container .interaction-filter ul li:hover {
    background-color: #f2f2f2;
  }

  :host .interaction-filter-container .interaction-filter ul li.active {
    font-weight: bold;
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
