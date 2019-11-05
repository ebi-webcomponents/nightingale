const identity = x => x;

export default (
  string = null,
  { keyFormatter = identity, valueFormatter = identity } = {}
) => {
  if (string !== null && typeof string !== "string")
    throw new Error("The attribute text has to be of type string");
  if (string && string.trim() !== "") {
    const blocks = string.split(",").map(bl => bl.split(":"));
    const obj = {};
    blocks.forEach(bl => {
      if (bl.length !== 2)
        throw new Error(
          `Bad block: ${bl.join(
            ":"
          )}\n The blocks of the string should follow the format KEY:VALUE`
        );
      obj[keyFormatter(bl[0])] = valueFormatter(bl[1]);
    });
    return obj;
  }
  return {};
};
