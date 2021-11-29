/* eslint-disable @typescript-eslint/no-non-null-assertion */
import "molstar/lib/mol-util/polyfill";
import { createPlugin } from "molstar/lib/mol-plugin-ui";
import { DefaultPluginUISpec } from "molstar/lib/mol-plugin-ui/spec";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { PluginSpec } from "molstar/lib/mol-plugin/spec";
import {
  DownloadStructure,
  PdbDownloadProvider,
} from "molstar/lib/mol-plugin-state/actions/structure";
import { PluginConfig } from "molstar/lib/mol-plugin/config";
import {
  StructureElement,
  StructureProperties,
  StructureSelection,
} from "molstar/lib/mol-model/structure";
import { PluginLayoutControlsDisplay } from "molstar/lib/mol-plugin/layout";
import { Script } from "molstar/lib/mol-script/script";
import { StructureRepresentationPresetProvider } from "molstar/lib/mol-plugin-state/builder/structure/representation-preset";
import { PluginCommands } from "molstar/lib/mol-plugin/commands";
import { Color } from "molstar/lib/mol-util/color";

import AfConfidenceScore from "./af-confidence/behavior";

import "molstar/build/viewer/molstar.css";

interface LoadStructureOptions {
  representationParams?: StructureRepresentationPresetProvider.CommonParams;
}

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

class StructureViewer {
  plugin: PluginContext;

  constructor(
    elementOrId: string | HTMLElement,
    onHighlightClick: (sequencePositions: number[]) => void
  ) {
    const defaultSpec = DefaultPluginUISpec(); // TODO: Make our own to select only essential plugins
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

    const element =
      typeof elementOrId === "string"
        ? document.getElementById(elementOrId)
        : elementOrId;
    if (!element)
      throw new Error(`Could not get element with id '${elementOrId}'`);
    this.plugin = createPlugin(element, spec);
    this.plugin.behaviors.interaction.click.subscribe((event) => {
      if (StructureElement.Loci.is(event.current.loci)) {
        const loc = StructureElement.Location.create();
        StructureElement.Loci.getFirstLocation(event.current.loci, loc);
        // auth_seq_id  : UniProt coordinate space
        // label_seq_id : PDB coordinate space
        const sequencePosition = StructureProperties.residue.label_seq_id(loc);
        onHighlightClick([sequencePosition]);
      }
    });

    PluginCommands.Canvas3D.SetSettings(this.plugin, {
      settings: (props) => {
        // eslint-disable-next-line no-param-reassign
        props.renderer.backgroundColor = Color(0xffffff);
      },
    });
  }

  clear(message?: string): void {
    this.plugin.clear();
    if (message) {
      this.showMessage("Loading", message);
    }
  }

  loadPdb(pdb: string, options?: LoadStructureOptions): Promise<void> {
    const params = DownloadStructure.createDefaultParams(
      this.plugin.state.data.root.obj!,
      this.plugin
    );
    const provider = this.plugin.config.get(
      PluginConfig.Download.DefaultPdbProvider
    )!;
    return this.plugin
      .runTask(
        this.plugin.state.data.applyAction(DownloadStructure, {
          source: {
            name: "pdb" as const,
            params: {
              provider: {
                id: pdb,
                server: {
                  name: provider,
                  params: PdbDownloadProvider[provider].defaultValue as any,
                },
              },
              options: {
                ...params.source.params.options,
                representationParams: options?.representationParams as any,
              },
            },
          },
        })
      )
      .then(() => {
        this.clearMessages();
      });
  }

  async loadAF(id: string, url: string): Promise<void> {
    const { plugin } = this;

    const data = await plugin.builders.data.download(
      { url, isBinary: false },
      { state: { isGhost: true } }
    );

    const trajectory = await plugin.builders.structure.parseTrajectory(
      data,
      "mmcif"
    );

    return this.plugin.builders.structure.hierarchy
      .applyPreset(trajectory, "all-models", { useDefaultIfSingleModel: true })
      .then(() => this.clearMessages());
  }

  highlight(ranges: { start: number; end: number }[]): void {
    // What nightingale calls "highlight", mol* calls "select"
    // The query in this method is over label_seq_id so the provided start & end
    // coordinates must be in PDB space
    const data =
      this.plugin.managers.structure.hierarchy.current.structures[0]?.cell.obj
        ?.data;
    if (!data) return;
    const sel = Script.getStructureSelection(
      (Q) =>
        Q.struct.generator.atomGroups({
          "residue-test": Q.core.logic.or(
            ranges.map(({ start, end }) =>
              Q.core.rel.inRange([
                Q.struct.atomProperty.macromolecular.label_seq_id(),
                start,
                end,
              ])
            )
          ),
        }),
      data
    );
    const loci = StructureSelection.toLociWithSourceUnits(sel);
    this.plugin.managers.camera.focusLoci(loci);
    this.plugin.managers.interactivity.lociSelects.selectOnly({ loci });
  }

  clearHighlight(): void {
    this.plugin.managers.interactivity.lociSelects.deselectAll();
    PluginCommands.Camera.Reset(this.plugin, {});
  }

  showMessage(title: string, message: string, timeoutMs?: number): void {
    this.clearMessages();
    PluginCommands.Toast.Show(this.plugin, {
      title,
      message,
      timeoutMs,
    });
  }

  clearMessages(): void {
    PluginCommands.Toast.Hide(this.plugin);
  }

  handleResize(): void {
    this.plugin.layout.events.updated.next();
  }
}

export default StructureViewer;
