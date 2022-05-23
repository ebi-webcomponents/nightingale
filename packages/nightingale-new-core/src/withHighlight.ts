import { property } from "lit/decorators.js";
import NightingaleBaseElement, {
  Constructor,
} from "./nightingale-base-element";

export declare class WithHighlightInterface {
  highlight: string;
}

const withHighlight = <T extends Constructor<NightingaleBaseElement>>(
  superClass: T,
  options: {
    highlight?: string | null;
  } = {
    highlight: null,
  }
) => {
  class WithHighlight extends superClass {
    @property({ type: String })
    highlight = options.highlight;

    // TODO: use the track highlighter.
  }
  return WithHighlight as Constructor<WithHighlightInterface> & T;
};

export default withHighlight;
