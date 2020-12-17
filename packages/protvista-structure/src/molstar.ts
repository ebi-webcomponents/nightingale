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
import {
  RCSBAssemblySymmetry,
  RCSBValidationReport,
} from "molstar/lib/extensions/rcsb";
import { PDBeStructureQualityReport } from "molstar/lib/extensions/pdbe";
import { ObjectKeys } from "molstar/lib/mol-util/type-helpers";
import { PluginLayoutControlsDisplay } from "molstar/lib/mol-plugin/layout";
import { ANVILMembraneOrientation } from "molstar/lib/extensions/anvil/behavior";
import { DnatcoConfalPyramids } from "molstar/lib/extensions/dnatco";
import { G3DFormat, G3dProvider } from "molstar/lib/extensions/g3d/format";
import { DataFormatProvider } from "molstar/lib/mol-plugin-state/formats/provider";
import { Mp4Export } from "molstar/lib/extensions/mp4-export";
import { StructureRepresentationPresetProvider } from "molstar/lib/mol-plugin-state/builder/structure/representation-preset";

import "../../../node_modules/molstar/build/viewer/molstar.css";

// require("../../../node_modules/molstar/lib/mol-plugin-ui/skin/light.scss");

interface LoadStructureOptions {
  representationParams?: StructureRepresentationPresetProvider.CommonParams;
}

const CustomFormats = [["g3d", G3dProvider] as const];

const Extensions = {
  cellpack: PluginSpec.Behavior(CellPack),
  "dnatco-confal-pyramids": PluginSpec.Behavior(DnatcoConfalPyramids),
  "pdbe-structure-quality-report": PluginSpec.Behavior(
    PDBeStructureQualityReport
  ),
  "rcsb-assembly-symmetry": PluginSpec.Behavior(RCSBAssemblySymmetry),
  "rcsb-validation-report": PluginSpec.Behavior(RCSBValidationReport),
  "anvil-membrane-orientation": PluginSpec.Behavior(ANVILMembraneOrientation),
  g3d: PluginSpec.Behavior(G3DFormat),
  "mp4-export": PluginSpec.Behavior(Mp4Export),
};

const DefaultViewerOptions = {
  customFormats: CustomFormats as [string, DataFormatProvider][],
  extensions: ObjectKeys(Extensions),
  layoutIsExpanded: true,
  layoutShowControls: true,
  layoutShowRemoteState: true,
  layoutControlsDisplay: "reactive" as PluginLayoutControlsDisplay,
  layoutShowSequence: true,
  layoutShowLog: true,
  layoutShowLeftPanel: true,
  disableAntialiasing: false,
  pixelScale: 1,
  enableWboit: false,

  viewportShowExpand: PluginConfig.Viewport.ShowExpand.defaultValue,
  viewportShowControls: PluginConfig.Viewport.ShowControls.defaultValue,
  viewportShowSettings: PluginConfig.Viewport.ShowSettings.defaultValue,
  viewportShowSelectionMode:
    PluginConfig.Viewport.ShowSelectionMode.defaultValue,
  viewportShowAnimation: PluginConfig.Viewport.ShowAnimation.defaultValue,
  pluginStateServer: PluginConfig.State.DefaultServer.defaultValue,
  volumeStreamingServer:
    PluginConfig.VolumeStreaming.DefaultServer.defaultValue,
  volumeStreamingDisabled: !PluginConfig.VolumeStreaming.Enabled.defaultValue,
  pdbProvider: PluginConfig.Download.DefaultPdbProvider.defaultValue,
  emdbProvider: PluginConfig.Download.DefaultEmdbProvider.defaultValue,
};
type ViewerOptions = typeof DefaultViewerOptions;

class Viewer {
  plugin: PluginContext;

  constructor(
    elementOrId: string | HTMLElement,
    options: Partial<ViewerOptions> = {}
  ) {
    const o = { ...DefaultViewerOptions, ...options };

    const spec: PluginSpec = {
      actions: [...DefaultPluginSpec.actions],
      behaviors: [
        ...DefaultPluginSpec.behaviors,
        ...o.extensions.map((e) => Extensions[e]),
      ],
      animations: [...(DefaultPluginSpec.animations || [])],
      customParamEditors: DefaultPluginSpec.customParamEditors,
      customFormats: o?.customFormats,
      layout: {
        initial: {
          isExpanded: o.layoutIsExpanded,
          showControls: o.layoutShowControls,
          controlsDisplay: o.layoutControlsDisplay,
        },
        controls: {
          ...(DefaultPluginSpec.layout && DefaultPluginSpec.layout.controls),
          top: o.layoutShowSequence ? undefined : "none",
          bottom: o.layoutShowLog ? undefined : "none",
          left: o.layoutShowLeftPanel ? undefined : "none",
        },
      },
      components: {
        ...DefaultPluginSpec.components,
        remoteState: o.layoutShowRemoteState ? "default" : "none",
      },
      config: [
        [PluginConfig.General.DisableAntialiasing, o.disableAntialiasing],
        [PluginConfig.General.PixelScale, o.pixelScale],
        [PluginConfig.General.EnableWboit, o.enableWboit],
        [PluginConfig.Viewport.ShowExpand, o.viewportShowExpand],
        [PluginConfig.Viewport.ShowControls, o.viewportShowControls],
        [PluginConfig.Viewport.ShowSettings, o.viewportShowSettings],
        [PluginConfig.Viewport.ShowSelectionMode, o.viewportShowSelectionMode],
        [PluginConfig.Viewport.ShowAnimation, o.viewportShowAnimation],
        [PluginConfig.State.DefaultServer, o.pluginStateServer],
        [PluginConfig.State.CurrentServer, o.pluginStateServer],
        [PluginConfig.VolumeStreaming.DefaultServer, o.volumeStreamingServer],
        [PluginConfig.VolumeStreaming.Enabled, !o.volumeStreamingDisabled],
        [PluginConfig.Download.DefaultPdbProvider, o.pdbProvider],
        [PluginConfig.Download.DefaultEmdbProvider, o.emdbProvider],
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

  handleResize(): void {
    this.plugin.layout.events.updated.next();
  }
}

export default Viewer;
