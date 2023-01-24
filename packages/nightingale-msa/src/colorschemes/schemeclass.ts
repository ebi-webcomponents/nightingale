export class StaticSchemeClass {
  defaultColor = "#ffffff";
  type = "static";
  map: Record<string, string>;
  constructor(map: Record<string, string>) {
    this.map = map;
  }
  getColor(letter: string) {
    if (this.map[letter] !== undefined) {
      return this.map[letter];
    } else {
      return this.defaultColor;
    }
  }
}

type BaseColorFunction = (base: string, ...args: unknown[]) => string;

export type ColorStructure = {
  init: () => void;
  run: BaseColorFunction;
  map: Record<string, string>;
};
type ColorFunction = ColorStructure | BaseColorFunction;

export class DynSchemeClass {
  type = "dyn";
  opt?: unknown;
  getColor: BaseColorFunction;
  reset?: () => void;
  map?: Record<string, string>;

  constructor(fun: ColorFunction, opt?: unknown) {
    this.opt = opt;
    const funCS = fun as ColorStructure;
    if (funCS.init !== undefined) {
      funCS.init.call(this);
      this.getColor = funCS.run;
      this.reset = funCS.init;
      this.map = funCS.map;
    } else {
      this.getColor = fun as BaseColorFunction;
    }
  }
}
