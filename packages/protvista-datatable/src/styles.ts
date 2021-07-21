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

  protvista-datatable table tr:hover:not(.active):not(.child-row) {
    background-color: var(--protvista-datatable__hover, #f1f1f1);
  }

  protvista-datatable table td {
    cursor: pointer;
  }

  protvista-datatable table .withChildren:before {
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
    background-color: var(--protvista-datatable__childToggle, #00639a);
  }

  protvista-datatable table .plus:before {
    content: "+";
  }

  protvista-datatable table .minus:before {
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

  protvista-datatable table .hidden {
    display: none;
  }

  protvista-datatable table .evidence-tag {
    cursor: pointer;
    font-size: 80%;
    white-space: nowrap;
    margin-left: 0.5rem;
    border-radius: 0.5rem;
    background-color: #f1f1f1;
    padding: 0.25rem 0.5rem;
    color: #3a343a;
  }
  protvista-datatable table .evidence-tag__label {
    padding-left: 0.25rem;
    text-transform: capitalize;
  }
  protvista-datatable table .svg-colour-reviewed svg {
    color: #c39b00;
  }
  protvista-datatable table .svg-colour-unreviewed svg {
    color: #c0c0c0;
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
