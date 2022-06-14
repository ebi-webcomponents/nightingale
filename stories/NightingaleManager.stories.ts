import { html } from "lit-html";
import "../packages/nightingale-navigation/src/index.ts";
import "../packages/nightingale-manager/src/index.ts";

export default {
  title: "Nightingale/NightingaleManager",
};
const defaultSequence =
  "iubcbcIUENACBPAOUBCASFUBRUABBRWOAUVBISVBAISBVDOASViubcbcIUENACBPAOUBCASFUBRUABBRWOAUVBISVBAISBVDOASViubcbcIUENACBPAOUBCASFUBRUABBRWOAUVBISVBAISBVDOASViubcbcIUENACBPAOUBCASFUBRUABBRWOAUVBISVBAISBVDOASV";

const Template = (args) => {
  const { width, height, length, sequence } = args;
  return html`
    <nightingale-manager>
      <div style="line-height: 0">
        <nightingale-navigation
          id="navigation"
          width="${width}"
          height=${height}
          length="${length}"
          display-start="${args["display-start"]}"
          display-end="${args["display-end"]}"
          highlight-color=${args["highlight-color"]}
          margin-color=${args["margin-color"]}
          show-highlight
        >
        </nightingale-navigation>
      </div>
      <div style="line-height: 0">
        <nightingale-sequence
          id="sequence"
          sequence=${sequence}
          width="${width}"
          height=${height}
          length="${length}"
          display-start="${args["display-start"]}"
          display-end="${args["display-end"]}"
          highlight-event="onmouseover"
          highlight-color=${args["highlight-color"]}
          margin-color=${args["margin-color"]}
        >
        </nightingale-sequence>
      </div>
    </nightingale-manager>
    <script>
      customElements.whenDefined("nightingale-sequence").then(() => {
        if (document.getElementById("sequence"))
          document.getElementById("sequence").fixedHighlight = "10:20";
      });
      customElements.whenDefined("nightingale-navigation").then(() => {
        if (document.getElementById("navigation"))
          document.getElementById("navigation").fixedHighlight = "10:20";
      });
    </script>
  `;
};

export const Manager = Template.bind({});
Manager.args = {
  width: "800",
  height: "50",
  length: defaultSequence.length,
  sequence: defaultSequence,
  "display-start": "10",
  "display-end": "80",
  "highlight-color": "#EB3BFF22",
  "margin-color": "transparent",
};
