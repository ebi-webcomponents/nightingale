import { OrderedSet } from "molstar/lib/mol-data/int";
import type { Model } from "molstar/lib/mol-model/structure";
import type { PluginContext } from "molstar/lib/mol-plugin/context";
import { Color } from "molstar/lib/mol-util/color";

import {
  ALPHAMISSENSE_THEME,
  alphaMissenseColor,
  atomScores,
  parseAlphaMissense,
  registerAlphaMissenseTheme,
} from "../src/alphamissense";

describe("parseAlphaMissense", () => {
  test("averages the substitutions at each residue number", () => {
    const scores = parseAlphaMissense(
      [
        "protein_variant,am_pathogenicity,am_class",
        "M1A,0.2,LBen",
        "M1C,0.4,LBen",
        "M1D,0.9,LPath",
        "L2A,0.1,LBen",
        "P12A,0.5,Amb",
        "",
      ].join("\n"),
    );
    expect([...scores.keys()]).toEqual([1, 2, 12]);
    expect(scores.get(1)).toBeCloseTo(0.5);
    expect(scores.get(2)).toBeCloseTo(0.1);
    expect(scores.get(12)).toBeCloseTo(0.5);
  });

  test("finds the columns by name and accepts CRLF line endings", () => {
    const scores = parseAlphaMissense(
      "am_class,am_pathogenicity,protein_variant\r\nLBen,0.25,A30G\r\n",
    );
    expect([...scores]).toEqual([[30, 0.25]]);
  });

  test.each([
    ["a file of something else", "variant,score\nM1A,0.2"],
    ["a malformed variant", "protein_variant,am_pathogenicity\nM1,0.2"],
    ["a missing score", "protein_variant,am_pathogenicity\nM1A,"],
  ])("rejects %s", (_, csv) => {
    expect(() => parseAlphaMissense(csv)).toThrow();
  });
});

describe("alphaMissenseColor", () => {
  test("is amColorScale's colour as a molstar Color", () => {
    expect(alphaMissenseColor(0)).toBe(Color(0x2166ac));
    expect(alphaMissenseColor(0.4527)).toBe(Color(0xe2e2e2));
    expect(alphaMissenseColor(1)).toBe(Color(0xb2182b));
    // amColorScale(0.5) is rgb(230, 219, 212).
    expect(alphaMissenseColor(0.5)).toBe(Color.fromRgb(230, 219, 212));
  });
});

describe("atomScores", () => {
  /**
   * A model shaped as far as atomScores reads it: `residueAtomSegments.index`
   * gives each atom's residue index, `auth_seq_id` each residue's number.
   */
  const model = (residueOfAtom: number[], authSeqIds: number[]) =>
    ({
      atomicHierarchy: {
        atoms: { _rowCount: residueOfAtom.length },
        residueAtomSegments: { index: residueOfAtom },
        residues: { auth_seq_id: { value: (i: number) => authSeqIds[i] } },
      },
    }) as unknown as Model;

  test("gives each atom its residue's score, by residue number", () => {
    // Residues 30, 31 and 32 (indices 0..2), as in a model of a fragment.
    const atoms = atomScores(
      model([0, 0, 1, 1, 2], [30, 31, 32]),
      new Map([
        [1, 0.5],
        [30, 0.1],
        [32, 0.9],
      ]),
    );
    // Residue 31 has no score; residue 1 is not in the model.
    expect([...atoms]).toEqual([
      [0, 0.1],
      [1, 0.1],
      [4, 0.9],
    ]);
  });
});

describe("registerAlphaMissenseTheme", () => {
  /**
   * Register the theme on a plugin shaped as far as it is registered on, and
   * attach its property to a model of residues 1, 2 and 3 (one atom each).
   */
  const register = async (scores: Map<number, number>) => {
    const plugin = {
      customModelProperties: { register: jest.fn() },
      representation: {
        structure: { themes: { colorThemeRegistry: { add: jest.fn() } } },
      },
      managers: { lociLabels: { addProvider: jest.fn() } },
    };
    registerAlphaMissenseTheme(
      plugin as unknown as PluginContext,
      () => scores,
    );
    const [[property]] = plugin.customModelProperties.register.mock.calls;
    const [[theme]] =
      plugin.representation.structure.themes.colorThemeRegistry.add.mock.calls;
    const [[label]] = plugin.managers.lociLabels.addProvider.mock.calls;
    const model = {
      atomicHierarchy: {
        atoms: { _rowCount: 3 },
        residueAtomSegments: { index: [0, 1, 2] },
        residues: { auth_seq_id: { value: (i: number) => i + 1 } },
      },
      customProperties: {
        add() {},
        assets() {},
        reference() {},
        hasReference: () => true,
      },
      _dynamicPropertyData: {},
    };
    await property.attach({}, model);
    const unit = { model, elements: [0, 1, 2] };
    const coloring = theme.factory({ structure: { models: [model] } }, {});
    return {
      theme,
      color: (atom: number) =>
        coloring.color({ kind: "element-location", unit, element: atom }),
      label: (atom: number) =>
        label.label({
          kind: "element-loci",
          elements: [{ unit, indices: OrderedSet.ofSingleton(atom) }],
        }),
    };
  };

  test("colours residues by score, and those without one mid-grey", async () => {
    const { theme, color } = await register(
      new Map([
        [1, 0.1],
        [2, 0.9],
      ]),
    );
    expect(theme.name).toBe(ALPHAMISSENSE_THEME);
    expect(color(0)).toBe(alphaMissenseColor(0.1));
    expect(color(1)).toBe(alphaMissenseColor(0.9));
    expect(color(2)).toBe(Color(0x999999));
  });

  test("labels residues with their mean score", async () => {
    const { label } = await register(new Map([[2, 0.9234]]));
    expect(label(1)).toBe("Mean AlphaMissense pathogenicity: 0.92");
    expect(label(0)).toBeUndefined();
  });
});
