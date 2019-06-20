import { LitElement, html, css } from "lit-element";

class ProtvistaTooltip extends LitElement {
  static get styles() {
    return css`
      :host {
        font-family: Roboto, Arial, sans-serif;
        z-index: 50000;
        position: absolute;
        min-width: 220px;
        margin-top: 20px;
        margin-left: -20px;
        -webkit-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        -moz-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
        opacity: 0.9;
      }

      .tooltip-header .tooltip-header-title,
      .tooltip-body,
      a,
      a:link,
      a:hover,
      a:active,
      a:visited {
        color: #ffffff;
      }

      .tooltip-header {
        background-color: #000000;
        line-height: 3em;
      }

      .tooltip-header::before {
        content: " ";
        position: absolute;
        bottom: 100%;
        left: 20px;
        margin-left: -10px;
        border-width: 10px;
        border-style: solid;
        border-color: transparent transparent black transparent;
      }

      .tooltip-header::before {
        left: 20px;
      }

      .tooltip-header .tooltip-header-title {
        background-color: #000000;
        font-weight: 700;
        line-height: 1em;
        display: inline-block;
        vertical-align: middle;
        padding-left: 0.4em;
      }

      .tooltip-body {
        padding: 1em;
        background: #616161;
        font-weight: normal;
      }

      table td {
        padding: 0.5em 0.5em;
        vertical-align: top;
      }

      table td:first-child {
        font-weight: 600;
        text-align: right;
      }

      table td p {
        margin-top: 0;
      }
    `;
  }

  static get properties() {
    return {
      top: { type: Number },
      left: { type: Number },
      title: { type: String },
      visible: { type: Boolean }
    };
  }

  _updatePosition() {
    this.style.top = `${this.top}px`;
    this.style.left = `${this.left}px`;
  }

  render() {
    this._updatePosition();

    this.style.display = this.visible ? "block" : "none";

    return html`
      ${this.title && html``}
      <div class="tooltip-header">
        <span class="tooltip-header-title">${this.title}</span>
      </div>
      <div class="tooltip-body"><slot></slot></div>
    `;
  }
}

export default ProtvistaTooltip;
