import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-filter/src/index";

import filterConfig from "../../packages/nightingale-filter/tests/filterConfig";
import NightingaleFilter from "../../packages/nightingale-filter/src/index";

export default {
  title: "Components/Utils/Filter",
} as Meta;

const Template: Story<{
  for: string;
}> = () => {
  setTimeout(async () => {
    await customElements.whenDefined("nightingale-filter");
    const filterComponent = document.getElementById("filter") as unknown as NightingaleFilter;
    if (filterComponent) {
      (filterComponent).filters = filterConfig;
    }

  }, 500);

  return html`<nightingale-filter
      for="variation"
      id="filter"
    ></nightingale-filter>
    `;
};

export const Filter = Template.bind({});
Filter.args = {
  for: "variation",
};
