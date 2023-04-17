import schemes from "../colorschemes";
import { DynSchemeClass, StaticSchemeClass } from "../colorschemes/schemeclass";
import { ConservationManager } from "../types/types";
const schemesMgr = new schemes();

/**
 * Simple color scheme abstraction over msa-colorschemes. To be extended.
 */
class ColorScheme {
  scheme: DynSchemeClass | StaticSchemeClass;
  conservation?: ConservationManager;

  constructor(colorScheme: string) {
    this.scheme = schemesMgr.getScheme(colorScheme);
  }

  // TODO: enable conservation
  updateConservation(conservation: ConservationManager) {
    this.conservation = conservation;
  }

  getColor(element: string, position: number) {
    if (this.scheme.type === "dyn") {
      return (this.scheme as DynSchemeClass).getColor(
        element,
        position,
        this.conservation
      );
    }
    return this.scheme.getColor(element); // , position, schemesMgr.conservation);
  }
}
export default ColorScheme;
export { ColorScheme };
