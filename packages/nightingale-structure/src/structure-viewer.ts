/* eslint-disable @typescript-eslint/no-non-null-assertion */
import "molstar/lib/mol-util/polyfill";
import { DefaultPluginSpec, PluginSpec } from "molstar/lib/mol-plugin/spec";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { PluginConfig } from "molstar/lib/mol-plugin/config";
import {
  StructureElement,
  StructureProperties,
  StructureSelection,
} from "molstar/lib/mol-model/structure";
import { PluginLayoutControlsDisplay } from "molstar/lib/mol-plugin/layout";
import { Script } from "molstar/lib/mol-script/script";
import { PluginCommands } from "molstar/lib/mol-plugin/commands";
import { Color } from "molstar/lib/mol-util/color";
import { ChainIdColorThemeProvider } from 'molstar/lib/mol-theme/color/chain-id';

import AfConfidenceScore from "./af-confidence/behavior";
import { AlphaMissenseColorTheme } from "./AlphaMissenseColorTheme";
import { AfConfidenceColorThemeProvider } from "./af-confidence/color";

const viewerOptions = {
  layoutIsExpanded: false,
  layoutShowControls: false,
  layoutShowRemoteState: false,
  layoutControlsDisplay: "reactive" as PluginLayoutControlsDisplay,
  layoutShowSequence: false,
  layoutShowLog: false,
  layoutShowLeftPanel: false,
  disableAntialiasing: false,
  pixelScale: 1,
  enableWboit: false,
  viewportShowExpand: true,
  viewportShowSelectionMode: false,
  viewportShowAnimation: false,
  pdbProvider: "pdbe",
  viewportShowControls: PluginConfig.Viewport.ShowControls.defaultValue,
  viewportShowSettings: PluginConfig.Viewport.ShowSettings.defaultValue,
};

const defaultSpec = DefaultPluginSpec(); // TODO: Make our own to select only essential plugins
const spec: PluginSpec = {
  actions: defaultSpec.actions,
  behaviors: [
    ...defaultSpec.behaviors,
    PluginSpec.Behavior(AfConfidenceScore, {
      autoAttach: true,
      showTooltip: true,
    }),
  ],
  layout: {
    initial: {
      isExpanded: viewerOptions.layoutIsExpanded,
      showControls: viewerOptions.layoutShowControls,
      controlsDisplay: viewerOptions.layoutControlsDisplay,
    },
  },
  config: [
    [
      PluginConfig.General.DisableAntialiasing,
      viewerOptions.disableAntialiasing,
    ],
    [PluginConfig.General.PixelScale, viewerOptions.pixelScale],
    [PluginConfig.General.EnableWboit, viewerOptions.enableWboit],
    [PluginConfig.Viewport.ShowExpand, viewerOptions.viewportShowExpand],
    [
      PluginConfig.Viewport.ShowSelectionMode,
      viewerOptions.viewportShowSelectionMode,
    ],
    [PluginConfig.Download.DefaultPdbProvider, viewerOptions.pdbProvider],
    [
      PluginConfig.Structure.DefaultRepresentationPresetParams,
      {
        theme: {
          globalName: "af-confidence",
          carbonByChainId: false,
          focus: {
            name: "element-symbol",
            params: { carbonByChainId: false },
          },
        },
      },
    ],
  ],
};

type SequencePosition = { chain: string; position: number };
type Range = { chain: string; start: number; end: number };

export type StructureViewer = {
  plugin: PluginContext;
  loadPdb(pdb: string): Promise<void>;
  loadCifUrl(url: string, isBinary?: boolean): Promise<void>;
  highlight(ranges: Range[]): void;
  clearHighlight(): void;
  changeHighlightColor(color: number): void;
  handleResize(): void;
  applyColorTheme(colorTheme?: string): void;
};

export const getStructureViewer = async (
  container: HTMLDivElement,
  onHighlightClick: (sequencePositions: SequencePosition[]) => void,
  colorTheme?: string,
): Promise<StructureViewer> => {
  const plugin = new PluginContext(spec);
  await plugin.init();

  const canvas = container.querySelector<HTMLCanvasElement>("canvas");

  if (!canvas || !plugin.initViewer(canvas, container)) {
    throw new Error("Failed to init Mol*");
  }

  if (AlphaMissenseColorTheme.colorThemeProvider)
    plugin.representation.structure.themes.colorThemeRegistry.add(
      AlphaMissenseColorTheme.colorThemeProvider,
    );
  if (AlphaMissenseColorTheme.labelProvider)
    plugin.managers.lociLabels.addProvider(
      AlphaMissenseColorTheme.labelProvider,
    );
    plugin.customModelProperties.register(
    AlphaMissenseColorTheme.propertyProvider,
    true,
  );

  // const data = await plugin.builders.data.download({ url: '...' }, { state: { isGhost: true } });
  // const trajectory = await plugin.builders.structure.parseTrajectory(data, format);
  // await plugin.builders.structure.hierarchy.applyPreset(trajectory, "default");

  plugin.behaviors.interaction.click.subscribe((event) => {
    if (StructureElement.Loci.is(event.current.loci)) {
      const loc = StructureElement.Location.create();
      StructureElement.Loci.getFirstLocation(event.current.loci, loc);
      // auth_seq_id  : UniProt coordinate space
      // label_seq_id : PDB coordinate space
      const sequencePosition = StructureProperties.residue.label_seq_id(loc);
      const chain = StructureProperties.chain.auth_asym_id(loc);
      onHighlightClick([{ position: sequencePosition, chain: chain }]);
    }
  });

  PluginCommands.Canvas3D.SetSettings(plugin, {
    settings: ({ renderer, marking }) => {
      renderer.backgroundColor = Color(0xeeeeee);
      // For highlight
      marking.edgeScale = 1.5;
      renderer.selectStrength = 0;
      // For hover
      renderer.highlightStrength = 1;
    },
  });

  const structureViewer: StructureViewer = {
    plugin,
    async loadPdb(pdb) {
      await this.loadCifUrl(
        `https://www.ebi.ac.uk/pdbe/model-server/v1/${pdb.toLowerCase()}/full?encoding=bcif`,
        true,
      );
    },
    async loadCifUrl(url, isBinary = false): Promise<void> {
      const data = await plugin.builders.data.download(
        { url, isBinary },
        { state: { isGhost: true } },
      );

      const trajectory = await plugin.builders.structure.parseTrajectory(
        data,
        "mmcif",
      );

      await plugin.builders.structure.hierarchy.applyPreset(
        trajectory,
        "all-models",
        { useDefaultIfSingleModel: true },
      );
      this.applyColorTheme(colorTheme);
    },

    applyColorTheme(colorTheme) {
      let colouringTheme: string;
      if (colorTheme === 'alphamissense') {
        colouringTheme =
            AlphaMissenseColorTheme.propertyProvider.descriptor.name;
      } else {
        colouringTheme = AfConfidenceColorThemeProvider.name;
      }
  
      // apply colouring
      plugin?.dataTransaction(async () => {
        for (const s of plugin?.managers.structure.hierarchy.current
          .structures || []) {
          await plugin?.managers.structure.component.updateRepresentationsTheme(
            s.components,
            {
              color: colouringTheme as typeof ChainIdColorThemeProvider.name,
            },
          );
        }
      });
    },

    highlight(ranges) {
      // What nightingale calls "highlight", mol* calls "select"
      // The query in this method is over label_seq_id so the provided start & end
      // coordinates must be in PDB space
      const data =
        plugin.managers.structure.hierarchy.current.structures[0]?.cell.obj
          ?.data;
      if (!data) {
        return;
      }
      const sel = Script.getStructureSelection(
        (Q) =>
          Q.struct.generator.atomGroups({
            "residue-test": Q.core.logic.or(
              ranges.map(({ start, end, chain }) =>
                Q.core.logic.and([
                  Q.core.rel.inRange([
                    Q.struct.atomProperty.macromolecular.label_seq_id(),
                    start,
                    end,
                  ]),
                  Q.core.rel.eq([
                    Q.struct.atomProperty.macromolecular.auth_asym_id(),
                    chain,
                  ]),
                ]),
              ),
            ),
          }),
        data,
      );
      const loci = StructureSelection.toLociWithSourceUnits(sel);
      plugin.managers.camera.focusLoci(loci);
      plugin.managers.interactivity.lociSelects.selectOnly({ loci });
    },
    clearHighlight() {
      plugin.managers.interactivity.lociSelects.deselectAll();
      PluginCommands.Camera.Reset(plugin, {});
    },
    changeHighlightColor(color: number) {
      PluginCommands.Canvas3D.SetSettings(plugin, {
        settings: ({ renderer, marking }) => {
          // For highlight
          marking.selectEdgeColor = Color(color);
          // For hover
          marking.highlightEdgeColor = Color(color);
          renderer.highlightColor = Color(color);
        },
      });
    },
    handleResize() {
      plugin.layout.events.updated.next(null);
    },
  };

  return structureViewer;
};
