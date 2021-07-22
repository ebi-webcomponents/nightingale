import { Location } from "molstar/lib/mol-model/location";
import { StructureElement } from "molstar/lib/mol-model/structure";
import { ColorTheme, LocationColor } from "molstar/lib/mol-theme/color";
import { ThemeDataContext } from "molstar/lib/mol-theme/theme";
import { Color } from "molstar/lib/mol-util/color";
// import { TableLegend } from 'molstar/lib/mol-util/legend';
import { ParamDefinition as PD } from "molstar/lib/mol-util/param-definition";
import { CustomProperty } from "molstar/lib/mol-model-props/common/custom-property";

import {
  AfConfidenceProvider,
  getCategories,
  getConfidenceScore,
  isApplicable,
} from "./prop";

const ConfidenceColors: any = {
  "No Score": Color.fromRgb(170, 170, 170), // not applicable
  "Very low": Color.fromRgb(255, 125, 69), // VL
  Low: Color.fromRgb(255, 219, 19), // L
  Medium: Color.fromRgb(101, 203, 243), // M
  High: Color.fromRgb(0, 83, 214), // H
};

export const AfConfidenceColorThemeParams = {
  type: PD.MappedStatic("score", {
    score: PD.Group({}),
    category: PD.Group({
      kind: PD.Text(),
    }),
  }),
};

type Params = typeof AfConfidenceColorThemeParams;

export function AfConfidenceColorTheme(
  ctx: ThemeDataContext,
  props: PD.Values<Params>
): ColorTheme<Params> {
  let color: LocationColor;

  if (
    ctx.structure &&
    !ctx.structure.isEmpty &&
    ctx.structure.models[0].customProperties.has(
      AfConfidenceProvider.descriptor
    )
  ) {
    if (props.type.name === "score") {
      color = (location: Location) => {
        if (StructureElement.Location.is(location)) {
          const confidenceScore = getConfidenceScore(location);
          return ConfidenceColors[confidenceScore[1]];
        }
        return ConfidenceColors["No Score"];
      };
    } else {
      const categoryProp = props.type.params.kind;
      color = (location: Location) => {
        if (StructureElement.Location.is(location)) {
          const confidenceScore = getConfidenceScore(location);
          if (confidenceScore[1] === categoryProp)
            return ConfidenceColors[confidenceScore[1]];
          return ConfidenceColors["No Score"];
        }
        return ConfidenceColors["No Score"];
      };
    }
  } else {
    color = () => ConfidenceColors["No Score"];
  }

  return {
    factory: AfConfidenceColorTheme,
    granularity: "group",
    color,
    props,
    description: "Assigns residue colors according to the AF Confidence score",
  };
}

export const AfConfidenceColorThemeProvider: ColorTheme.Provider<
  Params,
  "af-confidence"
> = {
  name: "af-confidence",
  label: "AF Confidence",
  category: ColorTheme.Category.Validation,
  factory: AfConfidenceColorTheme,
  getParams: (ctx) => {
    const categories = getCategories(ctx.structure);
    if (categories.length === 0) {
      return {
        type: PD.MappedStatic("score", {
          score: PD.Group({}),
        }),
      };
    }

    return {
      type: PD.MappedStatic("score", {
        score: PD.Group({}),
        category: PD.Group(
          {
            kind: PD.Select(categories[0], PD.arrayToOptions(categories)),
          },
          { isFlat: true }
        ),
      }),
    };
  },
  defaultValues: PD.getDefaultValues(AfConfidenceColorThemeParams),
  isApplicable: (ctx: ThemeDataContext) =>
    isApplicable(ctx.structure?.models[0]),
  ensureCustomProperties: {
    attach: (ctx: CustomProperty.Context, data: ThemeDataContext) =>
      data.structure
        ? AfConfidenceProvider.attach(
            ctx,
            data.structure.models[0],
            undefined,
            true
          )
        : Promise.resolve(),
    detach: (data) =>
      data.structure &&
      data.structure.models[0].customProperties.reference(
        AfConfidenceProvider.descriptor,
        false
      ),
  },
};
