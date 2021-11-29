import { css } from "lit-element";

export const EXPANDED = css`pd-group-trigger__expanded`;
export const ACTIVE = css`active`;
export const TRANSPARENT = css`transparent`;
export const OVERLAPPED = css`overlapped`;
export const HIDDEN = css`hidden`;

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
    vertical-align: top;
    background-color: var(--protvista-datable__header-background, #fff);
    color: var(--protvista-datable__header-text, #393b42);
    text-overflow: ellipsis;
    top: 0;
    text-transform: uppercase;
    z-index: 400;
  }

  protvista-datatable table th .filter-wrap {
    display: flex;
    flex-direction: column;
  }

  protvista-datatable table th .filter-wrap select {
    width: fit-content;
  }

  protvista-datatable table td,
  protvista-datatable table th {
    padding: 1rem;
    border-bottom: 1px solid #c2c4c4;
  }

  protvista-datatable table tr:hover:not(.${ACTIVE}):not(.${TRANSPARENT}) {
    background-color: var(--protvista-datatable__hover, #f1f1f1);
  }

  protvista-datatable table td {
    cursor: pointer;
  }

  protvista-datatable table .pd-group-trigger {
    width: 1rem;
  }

  protvista-datatable table .pd-group-trigger button {
    background: none;
    border: none;
    padding: 0.2rem; // increase click area
    position: relative;
    text-decoration: none;
    cursor: pointer;
    transition: background 250ms ease-in-out, transform 150ms ease;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  protvista-datatable table .pd-group-trigger button:before {
    display: inline-block;
    content: " ";
    border-style: solid;
    border-width: 0.4rem 0 0.4rem 0.6rem;
    border-color: transparent transparent transparent #161d39;
    transition-duration: 0.3s;
    transition-property: transform;
  }

  protvista-datatable table .pd-group-trigger button.${EXPANDED}:before {
    transform: rotate(90deg);
  }

  protvista-datatable table td:nth-child(1) {
    border-left: 0.5rem solid transparent;
  }

  protvista-datatable table .${OVERLAPPED} td:nth-child(1) {
    border-left: 0.5rem solid
      var(--protvista-datatable__overlapped, rgba(255, 0, 0, 0.8));
  }

  protvista-datatable table .${ACTIVE} {
    background-color: var(
      --protvista-datatable__active,
      rgba(255, 235, 59, 0.3)
    ) !important;
  }

  protvista-datatable table .${TRANSPARENT} {
    opacity: 0.2;
  }
  protvista-datatable table .${TRANSPARENT} td:hover {
    cursor: default;
    background-color: inherit;
  }

  protvista-datatable table .${HIDDEN} {
    display: none;
  }

  protvista-datatable table tr[data-group-for] td {
    padding-left: 2rem;
  }

  protvista-datatable table .odd {
    background-color: var(--protvista-datatable__odd, #e4e8eb);
  }

  protvista-datatable table .even {
    background-color: var(--protvista-datatable__even, #fff);
  }
`;

export default styles;
