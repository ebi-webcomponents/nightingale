/* eslint-disable @typescript-eslint/no-non-null-assertion */
import "molstar/lib/mol-util/polyfill";
import { createPlugin, DefaultPluginSpec } from "molstar/lib/mol-plugin";
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

import "../../../node_modules/molstar/build/viewer/molstar.css";
import { Color } from "molstar/lib/mol-util/color";

// require("../../../node_modules/molstar/lib/mol-plugin-ui/skin/light.scss");

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

class MolStar {
  plugin: PluginContext;

  constructor(
    elementOrId: string | HTMLElement,
    onHighlightClick: (sequencePosition: number) => void
  ) {
    const spec: PluginSpec = {
      actions: [...DefaultPluginSpec.actions],
      behaviors: [...DefaultPluginSpec.behaviors],
      customParamEditors: DefaultPluginSpec.customParamEditors,
      layout: {
        initial: {
          isExpanded: viewerOptions.layoutIsExpanded,
          showControls: viewerOptions.layoutShowControls,
          controlsDisplay: viewerOptions.layoutControlsDisplay,
        },
      },
      components: {
        ...DefaultPluginSpec.components,
        remoteState: viewerOptions.layoutShowRemoteState ? "default" : "none",
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
        const sequencePosition = StructureProperties.residue.auth_seq_id(loc);
        onHighlightClick(sequencePosition);
      }
    });
    PluginCommands.Canvas3D.SetSettings(this.plugin, {
      settings: (props) => {
        // eslint-disable-next-line no-param-reassign
        props.renderer.backgroundColor = Color(0xffffff);
      },
    });
  }

  loadPdb(pdb: string, options?: LoadStructureOptions): Promise<void> {
    this.plugin.clear();
    this.showMessage("Loading", pdb);
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

  highlight(ranges: { start: number; end: number }[]): void {
    const data = this.plugin.managers.structure.hierarchy.current.structures[0]
      ?.cell.obj?.data;
    if (!data) return;
    const sel = Script.getStructureSelection(
      (Q) =>
        Q.struct.generator.atomGroups({
          "residue-test": Q.core.logic.or(
            ranges.map(({ start, end }) =>
              Q.core.rel.inRange([
                Q.struct.atomProperty.macromolecular.auth_seq_id(),
                start,
                end,
              ])
            )
          ),
        }),
      data
    );
    const loci = StructureSelection.toLociWithSourceUnits(sel);
    this.plugin.managers.interactivity.lociSelects.selectOnly({ loci });
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

export default MolStar;
