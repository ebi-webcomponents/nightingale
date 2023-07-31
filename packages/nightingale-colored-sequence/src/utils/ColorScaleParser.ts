export function isColorValid(color: string): boolean {
  const fakeElement = document.createElement("div");
  fakeElement.style.borderColor = "";
  fakeElement.style.borderColor = color;
  if (fakeElement.style.borderColor === "") return false;
  return true;
}

export default (
  text: string | null = null,
): {
  range: string[];
  domain: number[];
} => {
  let range: string[] = [];
  let domain: number[] = [];
  if (text !== null && typeof text !== "string")
    throw new Error("The attribute text has to be of type string");
  if (text && text.trim() !== "") {
    const blocks = text.split(",").map((bl) => bl.split(":"));
    if (blocks.length < 2)
      throw new Error("There should be at least 2 points to create a scale");

    range = blocks.map((bl) => {
      const color = bl[0].trim().toUpperCase();
      if (!isColorValid(color)) {
        throw new Error(`The color '${color} is not valid'`);
      }
      return color;
    });
    domain = blocks.map((bl, i) => {
      const number = parseFloat(bl[1]);
      if (Number.isNaN(number))
        throw new Error(
          `The second part of every point should be a number. Error in point ${i}: ${bl}`,
        );
      return number;
    });
  }
  return {
    range,
    domain,
  };
};
