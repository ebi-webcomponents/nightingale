import { html, css, LitElement, unsafeCSS } from "lit-element";

class ProtvistaCheckbox extends LitElement {
  constructor() {
    super();
    this._toggleChecked = this._toggleChecked.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    const styleElement = document.createElement("style");
    styleElement.innerHTML = this.css;
    this.appendChild(styleElement);
  }

  static get styles() {
    return css`
      :host {
        font-size: 12px;
      }

      :host[disabled] {
        opacity: 0.5;
      }

      .protvista_checkbox {
        position: relative;
        cursor: pointer;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        margin-top: 10px;
        line-height: 24px;
        outline: none;
      }

      label
        .protvista_checkbox_input:checked
        + .protvista_checkbox_label::before {
        opacity: 1;
      }

      .protvista_checkbox_input {
        opacity: 0;
        width: 0;
        height: 0;
        margin: 0;
      }

      .protvista_checkbox_label {
        display: flex;
        flex-direction: column;
        text-indent: 1em;
        margin-left: 16px;
      }

      .protvista_checkbox_input + .protvista_checkbox_label::before {
        content: "";
        width: 24px;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        border-radius: 4px;
        display: block;
        box-sizing: border-box;
        border: 1px solid #bdc3c7;
      }
    `;
  }

  static get properties() {
    return {
      checked: { type: Boolean },
      disabled: { type: Boolean },
      value: { type: String },
      options: { type: Object }
    };
  }

  render() {
    let {
      value,
      options: { labels, colors },
      checked = false,
      disabled = false
    } = this;
    if (colors.length == null) {
      colors = [colors];
    }
    const isCompound = this.options.colors.length > 1;

    value = `filter-${value.split(":")[1]}`;
    return html`
      <style>
        label .protvista_checkbox_input + .protvista_checkbox_label::before {
          background: ${isCompound
            ? `
              linear-gradient(${this.options.colors[0]},
              ${this.options.colors[1]})
            `
            : this.options.colors[0]};
          opacity: 0.4;
        }
      </style>
      <label
        class="protvista_checkbox ${isCompound ? "compound" : ""}"
        tabindex="0"
      >
        <input
          type="checkbox"
          class="protvista_checkbox_input"
          ?checked="${checked}"
          ?disabled="${disabled}"
          .value="${value}"
          @change="${this._toggleChecked}"
        />
        <span class="protvista_checkbox_label">
          ${labels.map(
            l =>
              html`
                <span>${l}</span>
              `
          )}
        </span>
      </label>
    `;
  }

  _toggleChecked(event) {
    event.stopPropagation();
    this.checked = !this.checked;
    this._fireEvent();
  }

  _fireEvent() {
    this.dispatchEvent(
      new CustomEvent("filterChange", {
        bubbles: true,
        composed: true,
        detail: {
          checked: this.checked,
          value: this.value
        }
      })
    );
  }
}

export { ProtvistaCheckbox };
