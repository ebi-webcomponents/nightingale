const aLetterOffset = "A".charCodeAt(0);
const lettersInAlphabet = 26;

const pid = {};

// calculating the conservation is expensive
// we only want to do it once
pid.init = function () {};
const gaps = new Set(["", " ", "-", "_", "."]);
pid.run = function (letter, pos, conservation) {
  if (
    !conservation ||
    conservation.progress !== 1 ||
    gaps.has(letter) ||
    pos > conservation.map.length / lettersInAlphabet
  )
    return "#ffffff";

  const letterIndex = letter.charCodeAt(0) - aLetterOffset;
  if (letterIndex < 0 || letterIndex >= lettersInAlphabet) {
    // outside of bounds of "A" to "Z", ignore
    return "#ffffff";
  }
  var cons = conservation.map[pos * lettersInAlphabet + letterIndex] || 0;
  if (cons > 0.8) {
    return "#6464ff";
  } else if (cons > 0.6) {
    return "#9da5ff";
  } else if (cons > 0.4) {
    return "#cccccc";
  } else {
    return "#ffffff";
  }
};

pid.map = {
  "> 0.8": "#6464ff",
  "> 0.6": "#9da5ff",
  "> 0.4": "#cccccc",
  "> 0": "#ffffff",
};

export default pid;
