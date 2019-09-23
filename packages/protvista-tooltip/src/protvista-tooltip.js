import { LitElement, html, css } from "lit-element";

class ProtvistaTooltip extends LitElement {
  static get properties() {
    return {
      title: { type: String }
    };
  }

  render() {
    return (
      this.title &&
      html`
        <style>
          :host {
            font-family: Roboto, Arial, sans-serif;
            font-size: 0.9rem;
            --tooltip-top: 100px;
            --tooltip-left: 300px;
            --tooltip-display: none;
            top: 0;
            left: 0;
            display: "none";
            z-index: 50000;
            position: absolute;
            min-width: 220px;
            max-width: 300px;
            margin-top: 20px;
            margin-left: -20px;
            -webkit-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            -moz-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
            opacity: 0.9;
            color: #ffffff;
          }

          :host a,
          :host a:link,
          :host a:active,
          :host a:hover {
            color: #ffffff;
          }

          .tooltip-header {
            background-color: #000000;
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
            line-height: 3em;
            height: 3rem;
            display: inline-block;
            padding-left: 0.4rem;
          }

          .tooltip-body {
            padding: 1em;
            background: #616161;
            font-weight: normal;
            overflow-y: auto;
            max-height: 40vh;
          }

          ::slotted(h4) {
            font-size: 1.2rem !important;
            margin: 0 0 0.5rem 0 !important;
            font-weight: 600 !important;
            color: #ffffff !important;
          }

          ::slotted(h5) {
            font-size: 1rem !important;
            margin: 0 !important;
            font-weight: 500 !important;
            color: #ffffff !important;
          }

          ::slotted(p) {
            margin: 0.25rem 0 1rem 0 !important;
          }

          ::slotted(ul) {
            list-style: none !important;
            margin: 0.25rem 0 1rem 0 !important;
            padding: 0 !important;
          }
        </style>
        <div class="tooltip-header">
          <span class="tooltip-header-title">${this.title}</span>
        </div>
        <div class="tooltip-body"><slot></slot></div>
      `
    );
  }
}

export default ProtvistaTooltip;
