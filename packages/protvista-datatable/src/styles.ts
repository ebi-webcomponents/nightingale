import { css } from "lit-element";

const styles = css`
  protvista-datatable table {
    width: 100%;
    padding: 0;
    margin: 0;
    border-spacing: 0;
  }

  protvista-datatable table th {
    position: sticky;
    position: -webkit-sticky;
    position: -moz-sticky;
    position: -ms-sticky;
    position: -o-sticky;
    text-align: left;
    background-color: var(--protvista-datable__header-background, #fff);
    color: var(--protvista-datable__header-text, #393b42);
    text-overflow: ellipsis;
    top: 0;
  }

  protvista-datatable table td,
  th {
    padding: 1rem;
    border-bottom: 1px solid #c2c4c4;
  }

  protvista-datatable table tr:hover:not(.active):not(.transparent) {
    background-color: var(--protvista-datatable__hover, #f1f1f1);
  }

  protvista-datatable table td {
    cursor: pointer;
  }

  protvista-datatable table .pd-group-trigger button {
    background: none;
    border: none;
    padding: 0.2rem; // increase click area
    text-decoration: none;
    cursor: pointer;
    transition: background 250ms ease-in-out, transform 150ms ease;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  protvista-datatable table .pd-group-trigger button:before {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    line-height: 1rem;
    border-radius: 1rem;
    background: #0069ed;
    color: #ffffff;
    font-family: monospace;
    font-size: 1rem;
    content: "+";
  }

  protvista-datatable
    table
    .pd-group-trigger
    button.pd-group-trigger__minus:before {
    content: "-";
  }

  protvista-datatable table td:nth-child(1) {
    border-left: 0.5rem solid transparent;
  }

  protvista-datatable table .overlapped td:nth-child(1) {
    border-left: 0.5rem solid
      var(--protvista-datatable__overlapped, rgba(255, 0, 0, 0.8));
  }

  protvista-datatable table .active {
    background-color: var(
      --protvista-datatable__active,
      rgba(255, 235, 59, 0.3)
    ) !important;
  }

  protvista-datatable table .transparent {
    opacity: 0.2;
  }
  protvista-datatable table .transparent td:hover {
    cursor: default;
    background-color: inherit;
  }

  protvista-datatable table .hidden {
    display: none;
  }

  protvista-datatable table .protvista-datatable__child-item {
    display: flex;
  }

  protvista-datatable table .protvista-datatable__child-item__title {
    font-weight: 700;
    flex-basis: 10vw;
    flex-grow: 0;
    margin-right: 1rem;
  }

  protvista-datatable table .protvista-datatable__child-item__content {
  }

  // Can't use :nth-child selector here because of column groups
  protvista-datatable table .odd {
    background-color: var(--protvista-datatable__odd, #e4e8eb);
  }

  protvista-datatable table .even {
    background-color: var(--protvista-datatable__even, #fff);
  }
`;

export default styles;
