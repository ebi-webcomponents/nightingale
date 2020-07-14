import { cleanUpText, formatSequence, alphabets } from "./defaults";

describe("textarea-sequence: formatSequence", () => {
  test("trims", () => {
    const seq = "   XXXXXXXXXXXXXXX  ";
    expect(formatSequence(seq, 40, 80)).toEqual(seq.trim());
  });
  test("same line blocks of 5", () => {
    const seq = "   XXXXXXXXXXXXXXX  ";
    expect(formatSequence(seq, 5, 80)).toEqual("XXXXX XXXXX XXXXX");
  });
  test("lines of 10 blocks of 5", () => {
    const seq = "   XXXXXXXXXXXXXXX  ";
    expect(formatSequence(seq, 5, 10)).toEqual("XXXXX XXXXX\nXXXXX");
  });
});

describe("textarea-sequence: cleanUpText", () => {
  const seq = "\n\n\n\n>header\n   AAAAAAAAAAAAAAAAAAAAA  \n\n";
  const cleaned = "> header\nAAAAAAAAAA AAAAAAAAAA A";
  test("lines of 10 blocks of 5", () => {
    expect(cleanUpText(seq.trim())).toEqual(cleaned);
  });
  test("lines of 10 blocks of 5 + trim", () => {
    expect(cleanUpText(seq)).toEqual(cleaned);
  });
  test("lines of 10 blocks of 5 + no header", () => {
    const seq = "\n\n\n\n\n   AAAAAAAAAAAAAAAAAAAAA  \n\n";
    const clean = cleanUpText(seq);
    const lines = clean.split("\n");
    expect(lines[0]).toMatch(/> Generated Header \[\d{4}\]/);
    expect(lines[1]).toEqual("AAAAAAAAAA AAAAAAAAAA A");
  });

  test("lines of 10 blocks of 5: removing invalid character U", () => {
    expect(cleanUpText(`${seq}UUU`)).toEqual(cleaned);
  });
  test("lines of 10 blocks of 5: using the dna alphabet", () => {
    expect(cleanUpText(`${seq}MMM`, alphabets.dna)).toEqual(cleaned);
  });
  test("lines of 10 blocks of 5: cleaning lowercase", () => {
    expect(cleanUpText(`${seq}aaa`, alphabets.dna, true)).toEqual(cleaned);
  });
  test("lines of 10 blocks of 5: comments", () => {
    const comment = "; this is a comment";
    expect(
      cleanUpText(`${seq}\n${comment}`, alphabets.dna, true, true)
    ).toEqual(cleaned);
    expect(
      cleanUpText(`${seq}\n${comment}`, alphabets.dna, true, false)
    ).toEqual(`${cleaned}\n${comment}`);
  });
  test("lines of 10 blocks of 5: single", () => {
    expect(cleanUpText(`${seq}\n${seq}`)).toEqual(cleaned);
    expect(
      cleanUpText(`${seq}\n${seq}`, alphabets.protein, false, true, false)
    ).toEqual(`${cleaned}\n\n${cleaned}`);
  });
  test("lines of 10 blocks of 5: formatting function", () => {
    const cleaned2 = "> header\nAAAAAAAAAAAAAAAAAAAAA";
    expect(
      cleanUpText(seq, alphabets.protein, false, true, false, x => x)
    ).toEqual(cleaned2);
  });
});
