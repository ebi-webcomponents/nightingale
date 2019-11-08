import { css } from "lit-element";

const styles = css`
  :host {
    display: block;
  }
  .protvista-datatable-container {
    overflow-y: auto;
    overflow-x: hidden;
  }

  .protvista-datatable__child-toggle svg {
    width: 1.1rem;
    height: 1.1rem;
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
    background-color: var(--protvista-datable__header-background, #fff);
    color: var(--protvista-datable__header-text, #393b42);
    text-overflow: ellipsis;
    top: 0;
  }

  td,
  th {
    padding: 1rem;
    border-bottom: 1px solid #c2c4c4;
  }

  tr:hover:not(.active):not(.child-row) {
    background-color: var(--protvista-datatable__hover, #f1f1f1);
  }

  td {
    cursor: pointer;
  }

  td:nth-child(1) {
    border-left: 0.5rem solid transparent;
  }

  .overlapped td:nth-child(1) {
    border-left: 0.5rem solid
      var(--protvista-datatable__overlapped, rgba(255, 0, 0, 0.8));
  }

  .active {
    background-color: var(
      --protvista-datatable__active,
      rgba(255, 235, 59, 0.3)
    );
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
  .svg-colour-reviewed {
    fill: #c39b00;
  }
  .svg-colour-unreviewed {
    fill: #c0c0c0;
  }

  .protvista-datatable__child-item {
    display: flex;
  }

  .protvista-datatable__child-item__title {
    font-weight: 700;
    flex-basis: 10vw;
    flex-grow: 0;
    margin-right: 1rem;
  }

  .protvista-datatable__child-item__content {
  }
`;

export default styles;
