export enum Shape {
  rectangle = "rectangle",
  bridge = "bridge",
  diamond = "diamond",
  chevron = "chevron",
  catFace = "catFace",
  triangle = "triangle",
  wave = "wave",
  hexagon = "hexagon",
  pentagon = "pentagon",
  circle = "circle",
  arrow = "arrow",
  doubleBar = "doubleBar",
}

export declare type ProtvistaTrackDatum = {
  accession: string;
  start: number;
  end: number;
  color?: string;
  shape?: Shape;
  tooltipContent?: string;
  locations?: [
    {
      fragments: [
        {
          start: number;
          end: number;
        }
      ];
    }
  ];
};
