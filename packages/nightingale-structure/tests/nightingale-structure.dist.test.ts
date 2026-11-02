// The published bundle, as rollup.config.mjs builds it. The other suites test
// src/ (with pdbe-molstar stubbed), so these are what catch a broken plugin in
// the package's rollup config. Like the typecheck, they need `pnpm build`
// first; CI builds before testing.
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const DIST = join(__dirname, "../dist/index.js");

const bundle = (): string => {
  if (!existsSync(DIST)) {
    throw new Error(`${DIST} is missing: run \`pnpm build\` first`);
  }
  return readFileSync(DIST, "utf8");
};

describe("nightingale-structure's bundle", () => {
  test("reads no process.env.NODE_ENV", () => {
    // Unreplaced, it bundles React's development build too, and throws
    // "process is not defined" in a page loaded without a bundler.
    expect(bundle().match(/process\.env\.NODE_ENV/g)).toBeNull();
  });

  test("imports nothing but other Nightingale packages", () => {
    // E.g. a Node built-in that one of molstar's imports leaves unstubbed.
    const imports = [
      ...bundle().matchAll(
        /(?:^|[;}\s])import\s*(?:[\w*{}\s,$]+?\s*from\s*)?["']([^"']+)["']/g,
      ),
    ].map(([, source]) => source);
    expect(imports.length).toBeGreaterThan(0);
    expect(
      imports.filter((source) => !source.startsWith("@nightingale-elements/")),
    ).toEqual([]);
  });

  test("inlines pdbe-molstar's stylesheet as a string", () => {
    expect(bundle()).toContain(".msp-plugin");
  });
});
