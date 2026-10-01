import { config } from "../src/config";

describe("nightingale-track config", () => {
  test.each(Object.entries(config))("%s has a valid color", (_, { color }) => {
    expect(color).toMatch(/^(#[0-9A-Fa-f]{6}|[a-z]+)$/);
  });
});
