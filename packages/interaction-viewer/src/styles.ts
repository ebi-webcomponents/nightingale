import { css } from "lit";

const styles = css`
  interaction-viewer {
    position: relative;
  }

  interaction-viewer text {
    font-family: "Open Sans", sans-serif;
    fill: black;
    opacity: 0.75;
    font-size: 12px;
  }

  interaction-viewer .active text {
    opacity: 1;
  }

  interaction-viewer .active-row {
    stroke: #4a90e2;
  }

  interaction-viewer .interaction-tooltip {
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

  interaction-viewer .interaction-tooltip .close-interaction-tooltip {
    cursor: pointer;
    float: right;
    margin-bottom: 0.8em;
  }

  interaction-viewer .interaction-tooltip .tooltip-content {
    clear: both;
  }

  interaction-viewer .interaction-filter-container {
    text-align: left;
  }

  interaction-viewer
    .interaction-filter-container
    #filter-display
    .filter-selected {
    margin: 0.2em 0.5em;
    padding: 0.3em 0.1em;
    background-color: #f2f2f2;
    border: 1px solid #e8e8e8;
    cursor: pointer;
    white-space: nowrap;
    display: inline-block;
  }

  interaction-viewer
    .interaction-filter-container
    #filter-display
    .filter-selected::after {
    content: "✖";
    margin: 0 0.3em;
  }

  interaction-viewer .interaction-filter-container .interaction-filter {
    vertical-align: top;
    margin-bottom: 0.5em;
    display: inline-block;
  }

  interaction-viewer .interaction-filter-container .interaction-filter ul {
    border: #e8e8e8 1px solid;
    max-height: 15em;
    overflow-y: auto;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  interaction-viewer .interaction-filter-container .interaction-filter ul li {
    cursor: pointer;
    padding: 0.5em 0.5em;
    border-bottom: #e8e8e8 1px solid;
  }

  interaction-viewer
    .interaction-filter-container
    .interaction-filter
    ul
    li:hover {
    background-color: #f2f2f2;
  }

  interaction-viewer
    .interaction-filter-container
    .interaction-filter
    ul
    li.active {
    font-weight: bold;
  }

  interaction-viewer .interaction-viewer .cell {
    fill: #4a90e2;
  }

  interaction-viewer .interaction-viewer .cell.active-cell {
    r: 0.8em;
    -webkit-transition: all 0.5s;
    /* Safari */
    transition: all 0.5s;
  }

  interaction-viewer .interaction-viewer .hidden-side {
    fill: #e8e8e8;
  }

  interaction-viewer .interaction-viewer .main-accession {
    font-weight: bold;
  }

  interaction-viewer .interaction-viewer .text-highlight {
    fill: #fff;
    opacity: 0;
    -webkit-transition: all 0.5s;
    /* Safari */
    transition: all 0.5s;
  }

  interaction-viewer .interaction-viewer-table tr:nth-child(even) {
    background: #f2f2f2;
  }

  interaction-viewer .interaction-viewer-table td,
  interaction-viewer .interaction-viewer-table th {
    padding: 0.5em;
    text-align: center;
  }

  interaction-viewer .interaction-viewer-table th {
    background-color: #e8e8e8;
    white-space: nowrap;
  }

  interaction-viewer
    .interaction-viewer-table
    .interaction-viewer-table_row-header {
    font-weight: bold;
    text-align: right;
  }

  interaction-viewer .button {
    display: inline-block;
    vertical-align: middle;
    margin: 0 1em 0 0;
    padding: 0.85em 1em;
    -webkit-appearance: none;
    border: 1px solid transparent;
    border-radius: 0;
    -webkit-transition: background-color 0.25s ease-out, color 0.25s ease-out;
    transition: background-color 0.25s ease-out, color 0.25s ease-out;
    line-height: 1;
    text-align: center;
    cursor: pointer;
    background-color: #f2f2f2 !important;
    color: #3a343a;
    border: 1px solid #e8e8e8;
  }

  interaction-viewer .iv_reset {
    display: block;
  }

  interaction-viewer .button:hover {
    color: #3a343a;
  }

  interaction-viewer .button.dropdown::after {
    display: block;
    width: 0;
    height: 0;
    border: inset 0.4em;
    content: "";
    border-bottom-width: 0;
    border-top-style: solid;
    border-color: #3a343a transparent transparent;
    position: relative;
    top: 0.4em;
    display: inline-block;
    float: right;
    margin-left: 1em;
  }

  interaction-viewer .dropdown-pane {
    position: absolute;
    z-index: 10;
    display: block;
    width: 300px;
    padding: 1rem;
    visibility: hidden;
    border: 1px solid #cacaca;
    border-radius: 0;
    background-color: #fefefe;
  }

  interaction-viewer .tree-list {
    text-align: left;
    list-style: none;
  }

  interaction-viewer .tree-list li {
    margin: 0.5em 0;
  }
`;

export default styles;
