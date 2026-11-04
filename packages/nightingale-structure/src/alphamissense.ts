import { rgb } from "d3";
import { CustomElementProperty } from "molstar/lib/mol-model-props/common/custom-element-property";
import type { ElementIndex, Model } from "molstar/lib/mol-model/structure";
import type { PluginContext } from "molstar/lib/mol-plugin/context";
import { Color } from "molstar/lib/mol-util/color";

import { amColorScale } from "./am-color-scale";

/** Mean AlphaMissense pathogenicity of each residue, by residue number. */
export type AlphaMissenseScores = ReadonlyMap<number, number>;

/** The name the AlphaMissense colour theme is registered under. */
export const ALPHAMISSENSE_THEME = "nightingale-alphamissense";

/** The colour of residues without AlphaMissense scores. */
export const NO_SCORE_COLOR = Color(0x999999);

const VARIANT = /^[A-Z](\d+)[A-Z]$/;

/**
 * Parse an AlphaFold DB AlphaMissense file (its `amAnnotationsUrl`), which has
 * a row per amino acid substitution (`protein_variant,am_pathogenicity,...`,
 * e.g. `M1A,0.2406,LBen`), into the mean pathogenicity of the substitutions
 * at each residue number.
 */
export const parseAlphaMissense = (csv: string): AlphaMissenseScores => {
  const [header, ...rows] = csv.split(/\r?\n/);
  const columns = header.split(",").map((name) => name.trim());
  const variantColumn = columns.indexOf("protein_variant");
  const scoreColumn = columns.indexOf("am_pathogenicity");
  if (variantColumn < 0 || scoreColumn < 0) {
    throw new Error("Not an AlphaMissense file: unexpected header");
  }
  const totals = new Map<number, { sum: number; count: number }>();
  rows.forEach((row) => {
    if (!row.trim()) return;
    const cells = row.split(",");
    const position = VARIANT.exec(cells[variantColumn]?.trim() ?? "")?.[1];
    const score = Number.parseFloat(cells[scoreColumn]);
    if (!position || !Number.isFinite(score)) {
      throw new Error(`Not an AlphaMissense substitution: "${row}"`);
    }
    const total = totals.get(+position) ?? { sum: 0, count: 0 };
    total.sum += score;
    total.count += 1;
    totals.set(+position, total);
  });
  return new Map(
    Array.from(totals, ([position, { sum, count }]) => [position, sum / count]),
  );
};

/** The colour of a pathogenicity score, on `amColorScale`. */
export const alphaMissenseColor = (score: number): Color => {
  const { r, g, b } = rgb(amColorScale(score));
  return Color.fromRgb(r, g, b);
};

/**
 * The score of each of `model`'s atoms: its residue's, by author residue
 * number (`auth_seq_id`). The AlphaFold models that have AlphaMissense files
 * (whole-sequence UniProt models) number residues by UniProt position, as the
 * files do.
 */
export const atomScores = (
  model: Model,
  scores: AlphaMissenseScores,
): Map<ElementIndex, number> => {
  const { atoms, residues, residueAtomSegments } = model.atomicHierarchy;
  const atomScore = new Map<ElementIndex, number>();
  for (let atom = 0; atom < atoms._rowCount; atom += 1) {
    const residue = residueAtomSegments.index[atom];
    const score = scores.get(residues.auth_seq_id.value(residue));
    if (score !== undefined) atomScore.set(atom as ElementIndex, score);
  }
  return atomScore;
};

/**
 * Register the AlphaMissense colour theme, and its hover label, on `plugin`.
 * It colours a model by `getScores()` as they are when the theme is first
 * applied to that model (pdbe-molstar parses a new model on every load).
 *
 * molstar's registries belong to the plugin, so each viewer registers its
 * own: the theme name only has to be unique within a plugin.
 */
export const registerAlphaMissenseTheme = (
  plugin: PluginContext,
  getScores: () => AlphaMissenseScores,
): void => {
  const property = CustomElementProperty.create<number>({
    label: "AlphaMissense pathogenicity",
    name: ALPHAMISSENSE_THEME,
    getData: (model) => ({ value: atomScores(model, getScores()) }),
    coloring: { getColor: alphaMissenseColor, defaultColor: NO_SCORE_COLOR },
    getLabel: (score) =>
      `Mean AlphaMissense pathogenicity: ${score.toFixed(2)}`,
  });
  // Attached when the theme is applied, not to every model loaded.
  plugin.customModelProperties.register(property.propertyProvider, false);
  if (property.colorThemeProvider) {
    plugin.representation.structure.themes.colorThemeRegistry.add(
      property.colorThemeProvider,
    );
  }
  if (property.labelProvider) {
    plugin.managers.lociLabels.addProvider(property.labelProvider);
  }
};
