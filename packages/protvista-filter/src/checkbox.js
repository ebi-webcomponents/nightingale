import { html, css, LitElement } from "lit-element";

/* eslint-disable import/prefer-default-export */
export class ProtvistaCheckbox extends LitElement {
  constructor() {
    super();
    this._toggleChecked = this._toggleChecked.bind(this);
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

      .protvista_checkbox_input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
      }

      .checkmark {
        opacity: 0.4;
        height: 25px;
        width: 25px;
        background-color: #eee;
        border-radius: 4px;
        box-sizing: border-box;
        border: 1px solid #bdc3c7;
      }

      .protvista_checkbox_input:checked ~ .checkmark {
        opacity: 1;
      }

      .protvista_checkbox_label {
        margin-left: 0.2rem;
        line-height: 1rem;
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
    const {
      options: { labels },
      checked = false,
      disabled = false
    } = this;
    let {
      value,
      options: { colors }
    } = this;
    if (colors.length == null) {
      colors = [colors];
    }
    const isCompound = this.options.colors.length > 1;
    value = `filter-${value.split(":")[1]}`;
    return html`
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
        <span
          class="checkmark"
          style=${`background: ${
            isCompound
              ? `
            linear-gradient(${this.options.colors[0]},
            ${this.options.colors[1]})
          `
              : this.options.colors[0]
          };`}
        ></span>
        <span class="protvista_checkbox_label">
          ${labels.join("/")}
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
