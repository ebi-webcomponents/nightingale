/**
 * Copyright 2018, Plotly, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import schemes from "../colorschemes";
import { DynSchemeClass, StaticSchemeClass } from "../colorschemes/schemeclass";
const schemesMgr = new schemes();

/**
 * Simple color scheme abstraction over msa-colorschemes. To be extended.
 */
class ColorScheme {
  scheme: DynSchemeClass | StaticSchemeClass;
  conservation?: any;

  constructor(colorScheme: string) {
    this.scheme = schemesMgr.getScheme(colorScheme);
  }

  // TODO: enable conservation
  updateConservation(conservation: any) {
    this.conservation = conservation;
  }

  getColor(element: string, position: number) {
    if ((this.scheme.type = "dyn")) {
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

/**
 * Checks whether the `obj` is a color scheme.
 * Everything that looks like a color scheme is very likely one.
 */
export function isColorScheme(obj: any) {
  return obj && typeof obj.getColor === "function";
}
