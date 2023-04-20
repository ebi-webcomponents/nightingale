/* eslint-disable no-case-declarations */
import { OrderedSet } from "molstar/lib/mol-data/int";
import { Loci } from "molstar/lib/mol-model/loci";
import { StructureElement } from "molstar/lib/mol-model/structure";
import { ParamDefinition as PD } from "molstar/lib/mol-util/param-definition";
import { PluginBehavior } from "molstar/lib/mol-plugin/behavior/behavior";

import { AfConfidenceProvider, getConfidenceScore } from "./prop";
import { AfConfidenceColorThemeProvider } from "./color";

export default PluginBehavior.create<{
  autoAttach: boolean;
  showTooltip: boolean;
}>({
  name: "af-confidence-prop",
  category: "custom-props",
  display: {
    name: "AlphaFold Confidence Score",
    description: "AlphaFold Confidence Score.",
  },
  ctor: class extends PluginBehavior.Handler<{
    autoAttach: boolean;
    showTooltip: boolean;
  }> {
    private provider = AfConfidenceProvider;

    private labelAfConfScore = {
      label: (loci: Loci): string | undefined => {
        if (
          this.params.showTooltip &&
          loci.kind === "element-loci" &&
          loci.elements.length !== 0
        ) {
          const e = loci.elements[0];
          const u = e.unit;
          if (
            !u.model.customProperties.hasReference(
              AfConfidenceProvider.descriptor
            )
          )
            return;

          const se = StructureElement.Location.create(
            loci.structure,
            u,
            u.elements[OrderedSet.getAt(e.indices, 0)]
          );
          const confidenceScore = getConfidenceScore(se);
          // eslint-disable-next-line consistent-return
          return confidenceScore && (+confidenceScore[0] > 0)
            ? `Confidence score: ${confidenceScore[0]} <small>( ${confidenceScore[1]} )</small>`
            : ``;
        }
      },
    };

    register(): void {
      this.ctx.customModelProperties.register(
        this.provider,
        this.params.autoAttach
      );
      this.ctx.managers.lociLabels.addProvider(this.labelAfConfScore);

      this.ctx.representation.structure.themes.colorThemeRegistry.add(
        AfConfidenceColorThemeProvider
      );
    }

    update(p: { autoAttach: boolean; showTooltip: boolean }) {
      const updated = this.params.autoAttach !== p.autoAttach;
      this.params.autoAttach = p.autoAttach;
      this.params.showTooltip = p.showTooltip;
      this.ctx.customModelProperties.setDefaultAutoAttach(
        this.provider.descriptor.name,
        this.params.autoAttach
      );
      return updated;
    }

    unregister() {
      this.ctx.customModelProperties.unregister(
        AfConfidenceProvider.descriptor.name
      );
      this.ctx.managers.lociLabels.removeProvider(this.labelAfConfScore);
      this.ctx.representation.structure.themes.colorThemeRegistry.remove(
        AfConfidenceColorThemeProvider
      );
    }
  },
  params: () => ({
    autoAttach: PD.Boolean(false),
    showTooltip: PD.Boolean(true),
  }),
});
