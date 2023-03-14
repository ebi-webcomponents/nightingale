import ColorScheme from "../utils/ColorScheme";

export type RawSequence = {
  sequence: string;
};
export type SequencesMSA = Array<{
  name: string;
  sequence: string;
}>;

export type SequencesType = {
  raw: Array<RawSequence>;
  length: number;
  maxLength: number;
};

export type Movement = {
  xMovement: number;
  yMovement: number;
};

export type RawPosition = {
  xPos: number;
  yPos: number;
};

export type Position = {
  xPos: number;
  yPos: number;
  currentViewSequencePosition: number;
  currentViewSequence: number;
  xPosOffset: number;
  yPosOffset: number;
};

export type TilePositions = {
  startXTile: number;
  startYTile: number;
  endXTile: number;
  endYTile: number;
};

export type ResidueTileOptions = {
  tileWidth: number;
  tileHeight: number;
  colorScheme: ColorScheme;
  textFont: string;
  borderColor: string;
  overlayConservation: boolean;
  // conservation:any;
};
export type TileOptions =
  // | ResidueTileOptions
  {
    tileWidth: number;
    tileHeight: number;
    colorScheme: ColorScheme;
    textFont: string;
    borderColor: string;
    overlayConservation: boolean;
    xGridSize: number;
    yGridSize: number;
    sequences: SequencesType;
  };
export type Region = {
  id?: string;
  residues: {
    from: number;
    to: number;
  };
  sequences: {
    from: number;
    to: number;
  };
  mouseOverFillColor: string;
  fillColor: string;
  borderColor: string;
  mouseOverBorderColor?: string;
};

export type Stats = {
  nrXTiles: number;
  nrYTiles: number;
  fullWidth: number;
  fullHeight: number;
};

// export type RawPosition = [number, number];

export type SequencePosition = {
  position: number;
  i: number;
  sequence: RawSequence;
  residue: string;
};

export type ConservationManager = { progress: number; map: Array<number> };
