import CanvasCache from "./CanvasCache";
import ColorScheme from "../../utils/ColorScheme";
import { ConservationManager, SequencesType } from "../../types/types";

type TilingGridOptions = {
  ctx: CanvasRenderingContext2D;
  startYTile: number;
  startXTile: number;
  endYTile: number;
  endXTile: number;
  tileWidth: number;
  tileHeight: number;
  sequences: SequencesType;
  //TODO: correct this types when migrated
  residueTileCache: CanvasCache;
  colorScheme: ColorScheme;
  overlayConservation?: boolean;
  conservation?: ConservationManager;
  border: boolean;
  borderWidth: number;
  borderColor: string;
  textColor: string;
  textFont: string;
};

const aLetterOffset = "A".charCodeAt(0);
const lettersInAlphabet = 26;

/**
 * Allows rendering in tiles of grids.
 *
 * |---|---|---|
 * |-1-|-2-|-3-|
 * |---|---|---|
 * ―――――――――――――
 * |---|---|---|
 * |-4-|-5-|-6-|
 * |---|---|---|
 *
 * where 1..6 are TilingGrid component of xGridSize and yGridSize of 3.
 *
 * This split-up is required to avoid frequent repaints and keeps the React
 * Tree calculations slim.
 */

class CanvasTilingGridComponent {
  private props?: TilingGridOptions;

  drawTile({ row, column }: { row: number; column: number }) {
    if (!this.props) return;
    const tileWidth = this.props.tileWidth;
    const tileHeight = this.props.tileHeight;
    const yPos = tileHeight * (row - this.props.startYTile);
    const xPos = tileWidth * (column - this.props.startXTile);
    if (row >= this.props.sequences.raw.length) return undefined;
    const sequence = this.props.sequences.raw[row].sequence;
    if (column >= sequence.length) return undefined;
    const text = sequence[column];
    if (text !== undefined) {
      const colorSchemeName = this.props.colorScheme.getColor(text, column);
      const overlayFactor = this.getOverlayFactor(text, column);
      const key = `${text}-${colorSchemeName}-${overlayFactor}`;
      const canvasTile = this.props.residueTileCache.createTile({
        key,
        tileWidth,
        tileHeight,
        create: ({ ctx }) => {
          return this.drawResidue({
            text,
            canvas: ctx,
            // row,
            // column,
            colorSchemeName,
            overlayFactor,
          });
        },
      });
      this.props.ctx.drawImage(
        canvasTile,
        0,
        0,
        tileWidth,
        tileHeight,
        xPos,
        yPos,
        tileWidth,
        tileHeight
      );
    }
  }

  getOverlayFactor(text: string, column: number) {
    if (!this.props?.overlayConservation || !this.props.conservation) return 1;

    const letterIndex = text.charCodeAt(0) - aLetterOffset;
    if (letterIndex < 0 || letterIndex >= lettersInAlphabet) {
      // outside of bounds of "A" to "Z", ignore
      return 0;
    }
    const raw =
      this.props.conservation.map[column * lettersInAlphabet + letterIndex] ||
      0;

    return Math.floor(raw * 5) / 5.0;
  }

  drawResidue({
    // row,
    // column,
    canvas,
    colorSchemeName,
    text,
    overlayFactor = 1,
  }: {
    // row: number;
    // column: number;
    canvas: CanvasRenderingContext2D;
    colorSchemeName: string;
    text: string;
    overlayFactor: number;
  }) {
    if (!this.props) return;
    canvas.globalAlpha = 0.7 * overlayFactor;
    canvas.fillStyle = colorSchemeName;
    canvas.fillRect(0, 0, this.props.tileWidth, this.props.tileHeight);
    const minW = 4;
    const fullOpacityW = 10;
    if (this.props.tileWidth < minW) return;

    if (this.props.border) {
      canvas.globalAlpha = 1;
      canvas.lineWidth = this.props.borderWidth;
      canvas.strokeStyle = this.props.borderColor;
      canvas.strokeRect(0, 0, this.props.tileWidth, this.props.tileHeight);
    }
    const m = 1.0 / (fullOpacityW - minW);
    const b = -m * minW;
    canvas.globalAlpha = Math.min(1, m * this.props.tileWidth + b);
    // 1.0;
    canvas.fillStyle = this.props.textColor;
    canvas.font = this.props.textFont;
    canvas.textBaseline = "middle";
    canvas.textAlign = "center";
    canvas.fillText(
      text,
      this.props.tileWidth / 2,
      this.props.tileHeight / 2 + 1,
      this.props.tileWidth
    );
  }

  draw(props: TilingGridOptions) {
    this.props = props;
    for (let i = this.props.startYTile; i < this.props.endYTile; i++) {
      for (let j = this.props.startXTile; j < this.props.endXTile; j++) {
        this.drawTile({ row: i, column: j });
      }
    }
  }
}

export default CanvasTilingGridComponent;
