import { NightingaleElement } from "@nightingale-elements/types";
import Registry from "./registryWith";
import { WithDimensionsI } from "./withDimensions";
import { WithHighlightI } from "./withHighlight";
import { withPositionI } from "./withPosition";

class NightingaleBaseElement
  extends NightingaleElement
  implements WithDimensionsI, withPositionI, WithHighlightI {
  // eslint-disable-next-line class-methods-use-this
  get implements(): Array<keyof typeof Registry> {
    return [];
  }

  // eslint-disable-next-line class-methods-use-this
  get dependencies(): Array<keyof typeof Registry> {
    return [];
  }

  static observedAttributes: Array<string> = [];

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    const nv = newValue === "null" ? null : newValue;
    if (oldValue !== nv) {
      this.render();
    }
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  disconnectedCallback(): void {}

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  connectedCallback(): void {}

  constructor() {
    super();
    for (const dependency of this.dependencies) {
      if (!this.implements.includes(dependency)) {
        throw new Error(
          `Dependency error: ${this.constructor.name} has an unsatisfied dependency: ${dependency}`
        );
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  render(): void {}
}

export default NightingaleBaseElement;
