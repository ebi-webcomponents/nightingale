import { create } from "@storybook/theming";
import logo from "../resources/nightingale_logo_text.svg";

export default create({
  base: "light",
  brandTitle: "Nightingale",
  brandUrl: "https://ebi-webcomponents.github.io/nightingale/#/",
  brandImage: logo,
  brandTarget: "_self",
  fontBase: '"Open Sans", sans-serif',
  fontCode: "monospace",

  colorPrimary: "#2f4f4f",
  colorSecondary: "#daa520",

  // UI
  appBg: "#fffbe7",
  appContentBg: "#fdfbfb",
  appBorderRadius: 4,
});
