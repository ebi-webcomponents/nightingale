import { NightingaleElement } from "@nightingale-elements/types";
import Registry from "./registryWith";

class NightingaleBaseElement extends NightingaleElement {
  // eslint-disable-next-line class-methods-use-this
  get implements(): Array<keyof typeof Registry> {
    return [];
  }

  // eslint-disable-next-line class-methods-use-this
  get dependencies(): Array<keyof typeof Registry> {
    return [];
  }

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
