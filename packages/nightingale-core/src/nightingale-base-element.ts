class NightingaleBaseElement extends HTMLElement {
  dependencies: Array<string> = [];

  implements: Array<string> = [];

  constructor() {
    super();
    for (const dependency of this.dependencies) {
      if (!this.implements.includes(dependency)) {
        throw new Error(
          `Dependency error: ${this} has a unreached dependency: ${dependency}`
        );
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  render(): void {}
}

export default NightingaleBaseElement;
