import { addons } from "@storybook/manager-api";
import nightingale from "./nightingale.theme";

addons.setConfig({
  theme: nightingale,
  showToolbar: false,
});
