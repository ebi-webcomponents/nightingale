class NightingaleBaseElement extends HTMLElement {
  // eslint-disable-next-line class-methods-use-this
  get implements(): Array<string> {
    return [];
  }

  // eslint-disable-next-line class-methods-use-this
  get dependencies(): Array<string> {
    return [];
  }

  // implements: Array<string> = [];

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
