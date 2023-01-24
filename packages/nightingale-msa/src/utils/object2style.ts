const object2style = (object: Record<string, unknown>): string =>
  Object.entries(object)
    .map(([k, v]) => `${k}: ${v};`)
    .join(" ");

export default object2style;
