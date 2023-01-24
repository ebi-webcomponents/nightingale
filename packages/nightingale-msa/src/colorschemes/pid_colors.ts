import { ConservationManager } from "../types/types";
import { ColorStructure } from "./schemeclass";

const aLetterOffset = "A".charCodeAt(0);
const lettersInAlphabet = 26;
const gaps = new Set(["", " ", "-", "_", "."]);

const pid: ColorStructure = {
  // calculating the conservation is expensive
  // we only want to do it once
  init: function () {},
  run: function (base: string, ...args: unknown[]) {
    const pos = args[0] as number;
    const conservation = args[1] as ConservationManager;
    if (
      !conservation ||
      conservation.progress !== 1 ||
      gaps.has(base) ||
      pos > conservation.map.length / lettersInAlphabet
    )
      return "#ffffff";

    const letterIndex = base.charCodeAt(0) - aLetterOffset;
    if (letterIndex < 0 || letterIndex >= lettersInAlphabet) {
      // outside of bounds of "A" to "Z", ignore
      return "#ffffff";
    }
    const cons = conservation.map[pos * lettersInAlphabet + letterIndex] || 0;
    if (cons > 0.8) {
      return "#6464ff";
    } else if (cons > 0.6) {
      return "#9da5ff";
    } else if (cons > 0.4) {
      return "#cccccc";
    } else {
      return "#ffffff";
    }
  },

  map: {
    "> 0.8": "#6464ff",
    "> 0.6": "#9da5ff",
    "> 0.4": "#cccccc",
    "> 0": "#ffffff",
  },
};

export default pid;
