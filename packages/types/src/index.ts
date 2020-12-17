/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */

// Main type definitions used throughout the Nightingale project

// eslint-disable-next-line @typescript-eslint/ban-types
export type TrackData = object;

export class NightingaleElement extends HTMLElement {
  static readonly is: string;

  // eslint-disable-next-line class-methods-use-this
  render(): void {
    /**/
  }
}

export abstract class NightingaleAdapterElement extends NightingaleElement {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static transform(data: any): TrackData | undefined {
    return data;
  }
}
