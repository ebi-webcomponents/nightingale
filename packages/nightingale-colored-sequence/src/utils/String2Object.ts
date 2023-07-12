const identity = (x: string) => x;

export default (
  text: string | null = null,
  options?: {
    keyFormatter?: (x: string) => string;
    valueFormatter?: (x: string) => unknown;
  },
): Record<string, unknown> => {
  if (text !== null && typeof text !== "string")
    throw new Error("The attribute text has to be of type string");
  const { keyFormatter, valueFormatter } = {
    keyFormatter: identity,
    valueFormatter: identity,
    ...options,
  };
  if (text && text.trim() !== "") {
    const blocks = text.split(",").map((bl) => bl.split(":"));
    const obj: Record<string, unknown> = {};
    blocks.forEach((bl) => {
      if (bl.length !== 2)
        throw new Error(
          `Bad block: ${bl.join(
            ":",
          )}\n The blocks of the string should follow the format KEY:VALUE`,
        );
      obj[keyFormatter(bl[0])] = valueFormatter(bl[1]);
    });
    return obj;
  }
  return {};
};
