import { css } from "lit-element";

const styles = css`
  :host {
    display: block;
  }
  .nightingale-datatable-container {
    overflow-y: auto;
    // Note: overflow-x was set to 'hidden' but changing
    // to 'auto' doesn't seem to be an issue.
    overflow-x: auto;
  }

  :host([scrollable="true"]) .nightingale-datatable-container {
    overflow-y: auto;
    will-change: scroll;
  }

  :host([scrollable="false"]) .nightingale-datatable-container {
    overflow-y: hidden;
  }

  table {
    width: 100%;
    padding: 0;
    margin: 0;
    border-spacing: 0;
  }

  th {
    position: sticky;
    position: -webkit-sticky;
    position: -moz-sticky;
    position: -ms-sticky;
    position: -o-sticky;
    text-align: left;
    background-color: var(--nightingale-datable__header-background, #fff);
    color: var(--nightingale-datable__header-text, #393b42);
    text-overflow: ellipsis;
    top: 0;
  }

  td,
  th {
    padding: 1rem;
    border-bottom: 1px solid #c2c4c4;
  }

  tr:hover:not(.active):not(.child-row) {
    background-color: var(--nightingale-datatable__hover, #f1f1f1);
  }

  td {
    cursor: pointer;
  }

  .withChildren:before {
    display: inline-block;
    font-family: "Courier New", Courier, monospace;
    width: 1rem;
    text-align: center;
    border-radius: 1rem;
    line-height: 1rem;
    font-weight: 700;
    font-size: 1rem;
    color: white;
    border: 2px solid white;
    background-color: var(--nightingale-datatable__childToggle, #00639a);
  }

  .plus:before {
    content: "+";
  }

  .minus:before {
    content: "-";
  }

  td:nth-child(1) {
    border-left: 0.5rem solid transparent;
  }

  .overlapped td:nth-child(1) {
    border-left: 0.5rem solid
      var(--nightingale-datatable__overlapped, rgba(255, 0, 0, 0.8));
  }

  .active {
    background-color: var(
      --nightingale-datatable__active,
      rgba(255, 235, 59, 0.3)
    ) !important;
  }
  .hidden {
    opacity: 0.2;
  }
  .evidence-tag {
    cursor: pointer;
    font-size: 80%;
    white-space: nowrap;
    margin-left: 0.5rem;
    border-radius: 0.5rem;
    background-color: #f1f1f1;
    padding: 0.25rem 0.5rem;
    color: #3a343a;
  }
  .evidence-tag__label {
    padding-left: 0.25rem;
    text-transform: capitalize;
  }
  .svg-colour-reviewed svg {
    color: #c39b00;
  }
  .svg-colour-unreviewed svg {
    color: #c0c0c0;
  }

  .nightingale-datatable__child-item {
    display: flex;
  }

  .nightingale-datatable__child-item__title {
    font-weight: 700;
    flex-basis: 10vw;
    flex-grow: 0;
    margin-right: 1rem;
  }

  .nightingale-datatable__child-item__content {
  }

  .odd {
    background-color: var(--nightingale-datatable__odd, #e4e8eb);
  }

  .even {
    background-color: var(--nightingale-datatable__even, #fff);
  }
`;

export default styles;
