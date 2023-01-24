import {
  StaticSchemeClass,
  DynSchemeClass,
  ColorStructure,
} from "./schemeclass";

import Aliphatic from "./aliphatic";
import Aromatic from "./aromatic";
import Charged from "./charged";
import Negative from "./negative";
import Polar from "./polar";
import Positive from "./positive";
import SerineThreonine from "./serine_threonine";
import Buried from "./buried";
import Cinema from "./cinema";
import Clustal from "./clustal";
import Clustal2 from "./clustal2";
import Helix from "./helix";
import Hydro from "./hydrophobicity";
import Lesk from "./lesk";
import Mae from "./mae";
import Nucleotide from "./nucleotide";
import Purine from "./purine";
import Strand from "./strand";
import Taylor from "./taylor";
import Turn from "./turn";
import Zappo from "./zappo";

// TODO: reenable dynamis colors!
import pid from "./pid_colors";

export const staticSchemes: Record<string, Record<string, string>> = {
  aliphatic: Aliphatic,
  aromatic: Aromatic,
  buried: Buried,
  buried_index: Buried,
  charged: Charged,
  cinema: Cinema,
  clustal2: Clustal2,
  clustal: Clustal,
  helix: Helix,
  helix_propensity: Helix,
  hydro: Hydro,
  lesk: Lesk,
  mae: Mae,
  negative: Negative,
  nucleotide: Nucleotide,
  polar: Polar,
  positive: Positive,
  purine: Purine,
  purine_pyrimidine: Purine,
  serine_threonine: SerineThreonine,
  strand: Strand,
  strand_propensity: Strand,
  taylor: Taylor,
  turn: Turn,
  turn_propensity: Turn,
  zappo: Zappo,
};

export const dynSchemes: Record<string, ColorStructure> = {
  conservation: pid,
};

export const defaultSchemes = Object.keys(staticSchemes);

class Colors {
  private maps = { ...staticSchemes };
  private dyn = { ...dynSchemes };
  private opt;
  constructor(opt?: unknown) {
    this.opt = opt;
  }
  // getScheme  (scheme: string) {
  //   return staticSchemes[scheme];
  // };
  getScheme(scheme: string) {
    let color = this.maps[scheme];
    if (color === undefined) {
      color = {};
      if (this.dyn[scheme] !== undefined) {
        return new DynSchemeClass(this.dyn[scheme], this.opt);
      }
    }
    return new StaticSchemeClass(color);
  }
  addStaticScheme(name: string, scheme: Record<string, string>) {
    this.maps[name] = scheme;
  }
  addDynScheme(name: string, scheme: ColorStructure) {
    this.dyn[name] = scheme;
  }
}

// Colors.getScheme = function (scheme: string) {
//   return staticSchemes[scheme];
// };

export default Colors;
