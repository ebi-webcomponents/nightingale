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
import { CellPack } from "molstar/lib/extensions/cellpack";
import { PDBeStructureQualityReport } from "molstar/lib/extensions/pdbe";
import { ObjectKeys } from "molstar/lib/mol-util/type-helpers";
import { StructureSelection } from "molstar/lib/mol-model/structure";
import { PluginLayoutControlsDisplay } from "molstar/lib/mol-plugin/layout";
import { Script } from "molstar/lib/mol-script/script";
import { ANVILMembraneOrientation } from "molstar/lib/extensions/anvil/behavior";
import { DnatcoConfalPyramids } from "molstar/lib/extensions/dnatco";
import { Mp4Export } from "molstar/lib/extensions/mp4-export";
import { StructureRepresentationPresetProvider } from "molstar/lib/mol-plugin-state/builder/structure/representation-preset";

import "../../../node_modules/molstar/build/viewer/molstar.css";
// require("../../../node_modules/molstar/lib/mol-plugin-ui/skin/light.scss");

interface LoadStructureOptions {
  representationParams?: StructureRepresentationPresetProvider.CommonParams;
}

const Extensions = {
  cellpack: PluginSpec.Behavior(CellPack),
  "dnatco-confal-pyramids": PluginSpec.Behavior(DnatcoConfalPyramids),
  "pdbe-structure-quality-report": PluginSpec.Behavior(
    PDBeStructureQualityReport
  ),
  "anvil-membrane-orientation": PluginSpec.Behavior(ANVILMembraneOrientation),
  "mp4-export": PluginSpec.Behavior(Mp4Export),
};

const viewerOptions = {
  extensions: ObjectKeys(Extensions),
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
  pluginStateServer: PluginConfig.State.DefaultServer.defaultValue,
  volumeStreamingServer:
    PluginConfig.VolumeStreaming.DefaultServer.defaultValue,
  volumeStreamingDisabled: !PluginConfig.VolumeStreaming.Enabled.defaultValue,
};

class MolStar {
  plugin: PluginContext;

  constructor(elementOrId: string | HTMLElement) {
    const spec: PluginSpec = {
      actions: [...DefaultPluginSpec.actions],
      behaviors: [
        ...DefaultPluginSpec.behaviors,
        ...viewerOptions.extensions.map((e) => Extensions[e]),
      ],
      animations: [...(DefaultPluginSpec.animations || [])],
      customParamEditors: DefaultPluginSpec.customParamEditors,
      layout: {
        initial: {
          isExpanded: viewerOptions.layoutIsExpanded,
          showControls: viewerOptions.layoutShowControls,
          controlsDisplay: viewerOptions.layoutControlsDisplay,
        },
        controls: {
          ...(DefaultPluginSpec.layout && DefaultPluginSpec.layout.controls),
          top: viewerOptions.layoutShowSequence ? undefined : "none",
          bottom: viewerOptions.layoutShowLog ? undefined : "none",
          left: viewerOptions.layoutShowLeftPanel ? undefined : "none",
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
          PluginConfig.Viewport.ShowControls,
          viewerOptions.viewportShowControls,
        ],
        [
          PluginConfig.Viewport.ShowSettings,
          viewerOptions.viewportShowSettings,
        ],
        [
          PluginConfig.Viewport.ShowSelectionMode,
          viewerOptions.viewportShowSelectionMode,
        ],
        [
          PluginConfig.Viewport.ShowAnimation,
          viewerOptions.viewportShowAnimation,
        ],
        [PluginConfig.State.DefaultServer, viewerOptions.pluginStateServer],
        [PluginConfig.State.CurrentServer, viewerOptions.pluginStateServer],
        [
          PluginConfig.VolumeStreaming.DefaultServer,
          viewerOptions.volumeStreamingServer,
        ],
        [
          PluginConfig.VolumeStreaming.Enabled,
          !viewerOptions.volumeStreamingDisabled,
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
  }

  loadPdb(pdb: string, options?: LoadStructureOptions): Promise<void> {
    const params = DownloadStructure.createDefaultParams(
      this.plugin.state.data.root.obj!,
      this.plugin
    );
    const provider = this.plugin.config.get(
      PluginConfig.Download.DefaultPdbProvider
    )!;
    return this.plugin.runTask(
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
    );
  }

  highlight(): void {
    const data = this.plugin.managers.structure.hierarchy.current.structures[0]
      ?.cell.obj?.data;
    if (!data) return;

    const seqId = 7;
    const sel = Script.getStructureSelection(
      (Q) =>
        Q.struct.generator.atomGroups({
          "residue-test": Q.core.rel.eq([
            Q.struct.atomProperty.macromolecular.label_seq_id(),
            seqId,
          ]),
          "group-by": Q.struct.atomProperty.macromolecular.residueKey(),
        }),
      data
    );
    console.log(sel);
    const loci = StructureSelection.toLociWithSourceUnits(sel);
    this.plugin.managers.interactivity.lociHighlights.highlightOnly({ loci });
  }

  handleResize(): void {
    this.plugin.layout.events.updated.next();
  }
}

export default MolStar;
