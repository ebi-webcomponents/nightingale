import { property, state, customElement } from "lit/decorators.js";
import { PropertyValues } from "lit";

import { clamp, floor, isEqual } from "lodash-es";

import DraggingComponent from "./DraggingComponent";
import TilingGrid from "./CanvasTilingGrid";
import CanvasCache from "./CanvasCache";

import Mouse from "../../utils/mouse";
import { roundMod } from "../../utils/math";
import {
  SequencesType,
  Movement,
  Position,
  TilePositions,
  Region,
  Stats,
  RawPosition,
  SequencePosition,
  ResidueTileOptions,
  TileOptions,
  ConservationManager,
} from "../../types/types";

import ColorScheme from "../../utils/ColorScheme";

const debug = true;

const DEFAULT_COLOR_SCHEME = "clustal";

/**
 * Component to draw the main sequence alignment.
 */
@customElement("msa-sequence-viewer")
class SequenceViewerComponent extends DraggingComponent {
  private tileCache: CanvasCache;
  private residueTileCache: CanvasCache;
  private tilingGridManager: TilingGrid;

  private redrawStarted = 0;
  private redrawnTiles = 0;
  private colorSchemeManager = new ColorScheme(DEFAULT_COLOR_SCHEME);

  @property({
    type: Number,
    attribute: "tile-width",
  })
  tileWidth = 20;

  @property({
    type: Number,
    attribute: "tile-height",
  })
  tileHeight = 20;

  @property({
    type: String,
    attribute: "color-scheme",
  })
  colorScheme: string = DEFAULT_COLOR_SCHEME;

  @state()
  props: SequenceViewerComponentProps = {
    showModBar: false,
    xGridSize: 10,
    yGridSize: 10,
    border: false,
    borderColor: "black",
    borderWidth: 1,
    cacheElements: 20,
    textColor: "black",
    textFont: "18px Arial",
    overflow: "hidden",
    overflowX: "auto",
    overflowY: "auto",
    scrollBarPositionX: "bottom",
    scrollBarPositionY: "right",
    overlayConservation: false,
    // TODO: deal with conservation
    conservation: null,
    sequenceDisableDragging: false,
  };

  private _position?: Position;
  @state()
  sequences?: SequencesType;

  set position(position: RawPosition) {
    this._position = {
      xPosOffset: -(position.xPos % this.tileWidth),
      yPosOffset: -(position.yPos % this.tileHeight),
      currentViewSequence: clamp(
        floor(position.yPos / this.tileHeight),
        0,
        (this.sequences?.length || 1) - 1
      ),
      currentViewSequencePosition: clamp(
        floor(position.xPos / this.tileWidth),
        0,
        this.sequences?.maxLength || 0
      ),
      ...position,
    };
    this.x = position.xPos;
    this.y = position.yPos;
  }
  @state()
  get position(): Position {
    return this._position as Position;
  }

  /**
   * Displays a highlight
   */

  @state()
  highlight?: Region | Array<Region>;

  /**
   * An array of features which can be clicked
   */
  @state()
  features?: Array<Region>;

  protected stats: Stats | undefined;
  private mouseOverFeatureIds: string[] = [];

  constructor() {
    super();
    // cache fully drawn tiles
    this.tileCache = new CanvasCache();
    // cache individual residue cells
    this.residueTileCache = new CanvasCache();
    // the manager which is in charge of drawing residues
    this.tilingGridManager = new TilingGrid();

    this.onClick = this.onClick.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.draw = this.draw.bind(this);
  }

  setProp(key: string, value: unknown) {
    this.props = {
      ...this.props,
      [key]: value,
    };
    if (key === "conservation") {
      this.colorSchemeManager.updateConservation(value as ConservationManager);
      this.draw();
    }
  }
  getColorMap() {
    return {
      name: this.colorScheme,
      map: this.colorSchemeManager.scheme.map,
    };
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    // only need to check changed properties for an expensive computation.
    if (
      changedProperties.has("sequences") ||
      changedProperties.has("tileWidth") ||
      changedProperties.has("width") ||
      changedProperties.has("height")
    ) {
      this.stats = this.sequences
        ? {
            nrXTiles: Math.ceil(this.width / this.tileWidth) + 1,
            nrYTiles: Math.ceil(this.height / this.tileHeight) + 1,
            fullWidth: this.tileWidth * this.sequences.maxLength,
            fullHeight: this.tileHeight * this.sequences.length,
          }
        : undefined;
      this.fullWidth = this.tileWidth * (this.sequences?.maxLength || 0);
      this.fullHeight = this.tileHeight * (this.sequences?.length || 0);
    }
    if (changedProperties.has("colorScheme")) {
      this.colorSchemeManager = new ColorScheme(this.colorScheme);
    }
  }

  firstUpdated() {
    super.firstUpdated();
    this.container?.addEventListener("mousemove", this.onMouseMove);
    this.addEventListener("fake-scroll", ((e: CustomEvent) => {
      this.movePosition(e.detail.movement);
    }) as EventListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.container?.removeEventListener("mousemove", this.onMouseMove);
  }

  handleZooomChanged(): void {
    this.tileWidth = this.getSingleBaseWidth();
    this.position = {
      xPos: ((this["display-start"] || 1) - 1) * this.tileWidth,
      yPos: this.position.yPos,
    };
  }

  // starts the drawing process
  drawScene() {
    const positions = this.getTilePositions();
    if (!positions)
      throw Error(
        "Failed to draw scene because couldn't get the tile positions"
      );

    this.updateTileSpecs();
    if (debug) {
      this.redrawStarted = Date.now();
      this.redrawnTiles = 0;
    }
    this.drawTiles(positions);
    this.drawHighlightedRegions();
    if (this.ctx) {
      this.ctx.canvas.dispatchEvent(
        new CustomEvent("drawCompleted", {
          bubbles: true,
        })
      );
    }
    if (debug) {
      const elapsed = Date.now() - this.redrawStarted;
      if (elapsed > 5) {
        console.log(
          `Took ${elapsed} msecs to redraw for ${positions.startXTile} ${positions.startYTile} (redrawnTiles: ${this.redrawnTiles})`
        );
      }
    }
  }

  // figures out from where to start drawing
  getTilePositions(): TilePositions | null {
    if (!this.position || !this.sequences || !this.stats) return null;
    const startXTile = Math.max(
      0,
      this.position.currentViewSequencePosition - this.props.cacheElements
    );
    const startYTile = Math.max(
      0,
      this.position.currentViewSequence - this.props.cacheElements
    );
    const endYTile = Math.min(
      this.sequences.length,
      startYTile + this.stats.nrYTiles + 2 * this.props.cacheElements
    );
    const endXTile = Math.min(
      this.sequences.maxLength,
      startXTile + this.stats.nrXTiles + 2 * this.props.cacheElements
    );
    return { startXTile, startYTile, endXTile, endYTile };
  }

  renderTile = ({ row, column }: { row: number; column: number }) => {
    const key = row + "-" + column;
    return this.tileCache.createTile({
      key: key,
      tileWidth: this.tileWidth * this.props.xGridSize,
      tileHeight: this.tileHeight * this.props.yGridSize,
      create: ({ ctx }) => {
        if (!this.sequences) return;
        if (debug) {
          this.redrawnTiles++;
        }
        this.tilingGridManager.draw({
          ctx,
          startYTile: row,
          startXTile: column,
          residueTileCache: this.residueTileCache,
          endYTile: row + this.props.yGridSize,
          endXTile: column + this.props.xGridSize,
          sequences: this.sequences,
          colorScheme: this.colorSchemeManager,
          textFont: this.props.textFont,
          textColor: this.props.textColor,
          tileHeight: this.tileHeight,
          tileWidth: this.tileWidth,
          border: this.props.border,
          borderWidth: this.props.borderWidth,
          borderColor: this.props.borderColor,
          overlayConservation: this.props.overlayConservation,
          conservation: this.props.conservation,
        });
      },
    });
  };

  drawTiles({ startXTile, startYTile, endXTile, endYTile }: TilePositions) {
    if (!this.position) throw Error("This method requires position to be set");

    const xGridSize = this.props.xGridSize;
    const yGridSize = this.props.yGridSize;
    const startY = roundMod(startYTile, yGridSize);
    const startX = roundMod(startXTile, xGridSize);

    for (let i = startY; i < endYTile; i = i + yGridSize) {
      for (let j = startX; j < endXTile; j = j + xGridSize) {
        const canvas = this.renderTile({ row: i, column: j }); //, canvas: this.ctx });
        const width = xGridSize * this.tileWidth;
        const height = yGridSize * this.tileHeight;
        const yPos =
          (i - this.position.currentViewSequence) * this.tileHeight +
          this.position.yPosOffset;
        const xPos =
          (j - this.position.currentViewSequencePosition) * this.tileWidth +
          this.position.xPosOffset;
        this.ctx?.drawImage(
          canvas,
          0,
          0,
          width,
          height,
          xPos,
          yPos,
          width,
          height
        );
      }
    }
  }

  drawHighlightedRegions() {
    if (this.highlight) {
      if (Array.isArray(this.highlight)) {
        for (const h of this.highlight) {
          this.drawHighlightedRegion(h);
        }
      } else {
        this.drawHighlightedRegion(this.highlight);
      }
    }
    if (this.features) {
      this.features.forEach((feature) => {
        this.drawHighlightedRegion(feature);
      });
    }
  }

  drawHighlightedRegion(region: Region) {
    if (!this.ctx || !region || !this.position) return;
    const regionWidth =
      this.tileWidth * (1 + region.residues.to - region.residues.from);
    const regionHeight =
      this.tileHeight * (1 + region.sequences.to - region.sequences.from);
    const yPosFrom =
      (region.sequences.from - this.position.currentViewSequence) *
        this.tileHeight +
      this.position.yPosOffset;
    const xPosFrom =
      (region.residues.from - 1 - this.position.currentViewSequencePosition) *
        this.tileWidth +
      this.position.xPosOffset;

    const canvas = document.createElement("canvas");
    canvas.width = regionWidth;
    canvas.height = regionHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const mouseOver = this.mouseOverFeatureIds?.some((id) => id === region.id);
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = mouseOver
      ? region.mouseOverFillColor || "green"
      : region.fillColor || "#9999FF";
    ctx.fillRect(0, 0, regionWidth, regionHeight);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = mouseOver
      ? region.mouseOverBorderColor || "black "
      : region.borderColor || "777700";
    ctx.lineWidth = 4;
    ctx.rect(0, 0, regionWidth, regionHeight);

    ctx.stroke();
    this.ctx.drawImage(
      canvas,
      0,
      0,
      regionWidth,
      regionHeight,
      xPosFrom,
      yPosFrom,
      regionWidth,
      regionHeight
    );
  }
  movePosition = (m: Movement) => {
    if (!this.position) throw Error("This method requires position to be set");
    if (!m.xMovement && !m.yMovement) return;
    this.position = {
      xPos: this.position.xPos + m.xMovement,
      yPos: this.position.yPos + m.yMovement,
    };
  };
  onPositionUpdate = (oldPos: RawPosition, newPos: RawPosition) => {
    const relativeMovement = {
      xMovement: oldPos.xPos - newPos.xPos,
      yMovement: oldPos.yPos - newPos.yPos,
    };
    this.sendEvent("onPositionUpdate", newPos);
    this.movePosition(relativeMovement);
  };

  positionToSequence(pos: RawPosition): SequencePosition {
    if (!this.position || !this.sequences)
      throw Error("This method requires position and sequence to be set");
    const sequences = this.sequences.raw;
    const seqNr = clamp(
      floor((this.position.yPos + pos.yPos) / this.tileHeight),
      0,
      sequences.length - 1
    );
    const sequence = sequences[seqNr];

    const position = clamp(
      floor((this.position.xPos + pos.xPos) / this.tileWidth),
      0,
      sequence.sequence.length - 1
    );
    return {
      i: seqNr,
      sequence,
      position,
      residue: sequence.sequence[position],
    };
  }

  sequencePositionToFeatureIds(sequencePosition: SequencePosition): string[] {
    if (!this.features) {
      return [];
    }
    return this.features
      .filter(
        (feature) =>
          feature.id &&
          sequencePosition.position >= feature.residues.from - 1 &&
          sequencePosition.position <= feature.residues.to - 1 &&
          sequencePosition.i >= feature.sequences.from &&
          sequencePosition.i <= feature.sequences.to
      )
      .map((feature) => feature.id || "");
  }

  updateScrollPosition = () => {
    this.draw();
  };

  /**
   * Returns the position of the mouse position relative to the sequences
   */
  currentPointerPosition(e: MouseEvent) {
    return this.positionToSequence(Mouse.relative(e));
  }

  /**
   * Only sends an event if the actual function is set.
   */
  sendEvent(name: string, data: unknown) {
    if (this.ctx) {
      this.ctx.canvas.dispatchEvent(
        new CustomEvent(name, {
          bubbles: true,
          detail: data,
        })
      );
    }

    // if (this.props[name] !== undefined) {
    //   this.props[name](data);
    // }
  }

  private currentMouseSequencePosition?: SequencePosition;

  onMouseMove = (event: MouseEvent) => {
    // if (typeof this.isInDragPhase === "undefined") {
    // if (this.hasOnMouseMoveProps()) {
    const eventData = this.currentPointerPosition(event);
    const lastValue = this.currentMouseSequencePosition;
    if (!isEqual(lastValue, eventData)) {
      if (lastValue !== undefined) {
        this.sendEvent("onResidueMouseLeave", lastValue);
      }
      this.currentMouseSequencePosition = eventData;
      this.sendEvent("onResidueMouseEnter", eventData);

      if (this.features && this.features.length > 0) {
        const lastMouseOverFeatureIds = this.mouseOverFeatureIds || [];
        const mouseOverFeatureIds =
          this.sequencePositionToFeatureIds(eventData);
        if (!isEqual(lastMouseOverFeatureIds, mouseOverFeatureIds)) {
          this.mouseOverFeatureIds = mouseOverFeatureIds;
          super.draw();
        }
      }
      // }
    }
    // }
    // super.onMouseMove(event);
  };

  onMouseLeave = (/*event: MouseEvent*/) => {
    this.sendEvent("onResidueMouseLeave", this.currentMouseSequencePosition);
    this.currentMouseSequencePosition = undefined;
    if (this.mouseOverFeatureIds) {
      this.mouseOverFeatureIds = [];
      super.draw();
    }
    // super.onMouseLeave(event);
  };

  onClick = (event: MouseEvent) => {
    if (!this.mouseHasMoved) {
      const eventData = this.currentPointerPosition(event);
      this.sendEvent("onResidueClick", eventData);
      if (this.features) {
        this.sequencePositionToFeatureIds(eventData).forEach((id) => {
          this.sendEvent("onFeatureClick", { event, id });
        });
      }
    }
    // super.onClick(event);
  };

  onDoubleClick = (event: MouseEvent) => {
    const eventData = this.currentPointerPosition(event);
    this.sendEvent("onResidueDoubleClick", eventData);
    // super.onDoubleClick(event);
  };

  componentWillUnmount() {
    this.tileCache.invalidate();
    this.residueTileCache.invalidate();
  }

  updateTileSpecs() {
    const residueTileSpecs = {
      tileWidth: this.tileWidth,
      tileHeight: this.tileHeight,
      colorScheme: this.colorSchemeManager,
      textFont: this.props.textFont,
      borderColor: this.props.borderColor,
      overlayConservation: this.props.overlayConservation,
      conservation: this.props.conservation,
    };
    this.tileCache.updateTileSpecs({
      ...residueTileSpecs,
      xGridSize: this.props.xGridSize,
      yGridSize: this.props.yGridSize,
      sequences: this.sequences,
    } as TileOptions);
    this.residueTileCache.updateTileSpecs(
      residueTileSpecs as ResidueTileOptions
    );
  }

  render() {
    return super.render();
  }
  updated() {
    this.draw();
  }
}

type SequenceViewerComponentProps = {
  /**
   * Show the custom ModBar
   */
  showModBar: boolean;

  /**
   * Number of residues to cluster in one tile (x-axis) (default: 10)
   */
  xGridSize: number;

  /**
   * Number of residues to cluster in one tile (y-axis) (default: 10)
   */
  yGridSize: number;

  /**
   * Number of residues to prerender outside of the visible viewbox.
   */
  cacheElements: number;

  /**
   * Whether to draw a border.
   */
  border: boolean;

  /**
   * Color of the border. Name, hex or RGB value.
   */
  borderColor: string;

  /**
   * Width of the border.
   */
  borderWidth: number;

  /**
   * Color of the text residue letters (name, hex or RGB value)
   */
  textColor: string;

  /**
   * Font to use when drawing the individual residues.
   */
  textFont: string;

  /**
   * What should happen if content overflows.
   */
  overflow: "hidden" | "auto" | "scroll";

  /**
   * What should happen if x-axis content overflows (overwrites "overflow")
   */
  overflowX: "hidden" | "auto" | "scroll" | "initial";

  /**
   * What should happen if y-axis content overflows (overwrites "overflow")
   */
  overflowY: "hidden" | "auto" | "scroll" | "initial";

  /**
   * X Position of the scroll bar ("top or "bottom")
   */
  scrollBarPositionX: "top" | "bottom";

  /**
   * Y Position of the scroll bar ("left" or "right")
   */
  scrollBarPositionY: "left" | "right";

  conservation?: ConservationManager | null;
  /**
   * The conservation data can be used to define an overlay that
   * defines the opacity of the background color of each residue.
   */
  overlayConservation?: boolean;
  // onPositionUpdate?: () => void;
  sequenceDisableDragging?: boolean;

  // TODO: deal with this as external events
  //
  //  /**
  //   * Callback fired when the mouse pointer is entering a residue.
  //   */
  //  onResidueMouseEnter: PropTypes.func,

  //  /**
  //   * Callback fired when the mouse pointer is leaving a residue.
  //   */
  //  onResidueMouseLeave: PropTypes.func,

  //  /**
  //   * Callback fired when the mouse pointer clicked a residue.
  //   */
  //  onResidueClick: PropTypes.func,

  //  /**
  //   * Callback fired when the mouse pointer clicked a feature.
  //   */
  //  onFeatureClick: PropTypes.func,
  //  /**
  //  * Callback fired when the mouse pointer clicked a residue.
  //  */
  //   onResidueDoubleClick: PropTypes.func,
};

export default SequenceViewerComponent;
