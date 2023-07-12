import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import { ifDefined } from "lit/directives/if-defined.js";
import "../../packages/nightingale-textarea-sequence/src/index.ts";

export default {
  title: "Components/Other/Textarea Sequence",
  argTypes: {
    "valid-border-color": {
      control: {
        type: "color",
      },
    },

    "error-border-color": {
      control: {
        type: "color",
      },
    },

    "comments-color": {
      control: {
        type: "color",
      },
    },

    "base-error-color": {
      control: {
        type: "color",
      },
    },

    "base-error-background-color": {
      control: {
        type: "color",
      },
    },

    "second-header-error-background-color": {
      control: {
        type: "color",
      },
    },

    "too-short-error-background-color": {
      control: {
        type: "color",
      },
    },
  },
} as Meta;

export const TextareaWithoutControls = () => html`
  <h3>Textarea</h3>
  <h3>Protein alphabet</h3>
  <nightingale-textarea-sequence
    id="track"
    min-sequence-length="5"
    width="800"
    height="400"
  ></nightingale-textarea-sequence>
`;

const Template: Story<{
  width: number;
  height: number;
  "min-sequence-length": number;
  "case-sensitive": boolean;
  "allow-comments": boolean;
  "disable-header-check": boolean;
  single: boolean;
  "inner-style": string;
  alphabet: string;
  "valid-border-color": string;
  "error-border-color": string;
  "comments-color": string;
  "base-error-color": string;
  "base-error-background-color": string;
  "second-header-error-background-color": string;
  "too-short-error-background-color": string;
}> = (args) => {
  const { width, height, alphabet, single } = args;
  return html`
    <nightingale-textarea-sequence
      id="textarea"
      min-sequence-length=${args["min-sequence-length"]}
      inner-style=${args["inner-style"]}
      ?case-sensitive=${args["case-sensitive"]}
      ?allow-comments=${args["allow-comments"]}
      ?disable-header-check=${args["disable-header-check"]}
      ?single=${single}
      width=${width}
      height=${height}
      alphabet=${alphabet}
      valid-border-color=${ifDefined(args["valid-border-color"])}
      error-border-color=${ifDefined(args["error-border-color"])}
      comments-color=${ifDefined(args["comments-color"])}
      base-error-color=${ifDefined(args["base-error-color"])}
      base-error-background-color=${ifDefined(
        args["base-error-background-color"],
      )}
      second-header-error-background-color=${ifDefined(
        args["second-header-error-background-color"],
      )}
      too-short-error-background-color=${ifDefined(
        args["too-short-error-background-color"],
      )}
    ></nightingale-textarea-sequence>
    <br />
    <button id="clean-up">Clean Up</button>
    <ul id="errors"></ul>
  `;
};

export const TextareaSequence = Template.bind({});
TextareaSequence.args = {
  width: 500,
  height: 100,
  "min-sequence-length": 5,
  "case-sensitive": false,
  "allow-comments": false,
  "disable-header-check": false,
  single: false,
  alphabet: "protein",
  "inner-style": "background: #eed",
};
TextareaSequence.play = async () => {
  await customElements.whenDefined("nightingale-textarea-sequence");
  const button = document.getElementById("clean-up");
  const textarea = document.getElementById("textarea");
  const errorsUL = document.getElementById("errors");
  button?.addEventListener("click", () => {
    (textarea as any)?.cleanUp();
  });
  textarea?.addEventListener("error-change", (event: Event) => {
    const errors = (event as CustomEvent).detail.errors;
    if (errorsUL)
      errorsUL.innerHTML = Object.entries(errors)
        .map(([error, value]) => `<li>${error}: ${value ? "❌" : "✅"}</li>`)
        .join("");
  });
};
