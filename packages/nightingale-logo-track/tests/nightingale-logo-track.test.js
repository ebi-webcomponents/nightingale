import "../dist/index";

let rendered;

// Fully conserved at every column so each position renders exactly one
// letter (heightFraction 1), making the output deterministic to assert on.
const rnaSequences = [
  { name: "seq1", sequence: "AAACCCGGGUUU" },
  { name: "seq2", sequence: "AAACCCGGGUUU" },
];

const proteinSequences = [
  { name: "seq1", sequence: "MSKR" },
  { name: "seq2", sequence: "MSKR" },
];

describe("nightingale-logo-track tests", () => {
  afterEach(() => {
    document.querySelector("nightingale-logo-track")?.remove();
  });

  describe("RNA alignment", () => {
    beforeEach(async () => {
      document.documentElement.innerHTML =
        '<nightingale-logo-track length="12" height="120"></nightingale-logo-track>';
      rendered = document.querySelector("nightingale-logo-track");
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await rendered.updateComplete;
      rendered.sequences = rnaSequences;
    });

    test("it should render one letter per conserved column, colored by nucleotide, with no highlight", () => {
      const texts = Array.from(document.querySelectorAll("text"));
      expect(texts.length).toBe(12);
      expect(texts.map((t) => t.textContent)).toEqual([..."AAACCCGGGUUU"]);
      expect(texts[0].getAttribute("fill")).toBe("#00CC00"); // A
      expect(texts[3].getAttribute("fill")).toBe("#0000CC"); // C
      expect(texts[6].getAttribute("fill")).toBe("#FFB300"); // G
      expect(texts[9].getAttribute("fill")).toBe("#CC0000"); // U

      expect(document.querySelector("g.highlighted")).toBeTruthy();
      expect(document.querySelector("g.highlighted>rect")).toBeFalsy();
    });

    test("it should render margin rects sized from margin-top/margin-bottom", () => {
      rendered.setAttribute("margin-top", "15");
      rendered.setAttribute("margin-bottom", "5");
      rendered.sequences = rnaSequences;

      expect(document.querySelector("rect.margin-top")?.getAttribute("height")).toBe("15");
      expect(document.querySelector("rect.margin-bottom")?.getAttribute("height")).toBe("5");
    });

    // eslint-disable-next-line jest/no-disabled-tests
    test.skip("it should display the highlight after being set", (done) => {
      rendered.setAttribute("highlight", "1:3");
      window.requestAnimationFrame(() => {
        expect(document.querySelector("g.highlighted>rect")).toBeTruthy();
        done();
      });
    });
  });

  describe("N-heavy nucleotide alignment", () => {
    // 2 of 20 non-gap characters are ambiguity code "N" (10%, over the 5%
    // threshold): this must still be classified as RNA, not protein.
    const sequences = [
      { name: "seq1", sequence: "AAAAAAAAAAAAAAAAAANN" },
      { name: "seq2", sequence: "AAAAAAAAAAAAAAAAAANN" },
    ];

    beforeEach(async () => {
      document.documentElement.innerHTML =
        '<nightingale-logo-track length="20" height="120"></nightingale-logo-track>';
      rendered = document.querySelector("nightingale-logo-track");
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await rendered.updateComplete;
      rendered.sequences = sequences;
    });

    test("it should keep nucleotide coloring for A despite N ambiguity codes", () => {
      const texts = Array.from(document.querySelectorAll("text"));
      // The 2 all-"N" columns have no counted alphabet member, so no letter
      // is rendered there; only the 18 "A" columns produce a letter.
      expect(texts.length).toBe(18);
      expect(texts.every((t) => t.textContent === "A")).toBe(true);
      // Nucleotide "A" is green (#00CC00); protein "A" would be orange
      // (#FF8C00), so this fails if N pushes detection into protein mode.
      expect(texts.every((t) => t.getAttribute("fill") === "#00CC00")).toBe(true);
    });
  });

  describe("protein alignment", () => {
    beforeEach(async () => {
      document.documentElement.innerHTML =
        '<nightingale-logo-track length="4" height="120"></nightingale-logo-track>';
      rendered = document.querySelector("nightingale-logo-track");
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await rendered.updateComplete;
      rendered.sequences = proteinSequences;
    });

    test("it should detect protein sequences and color residues by chemistry group", () => {
      const texts = Array.from(document.querySelectorAll("text"));
      expect(texts.length).toBe(4);
      expect(texts.map((t) => t.textContent)).toEqual([..."MSKR"]);
      expect(texts[0].getAttribute("fill")).toBe("#FF8C00"); // M - hydrophobic
      expect(texts[1].getAttribute("fill")).toBe("#00CC00"); // S - polar uncharged
      expect(texts[2].getAttribute("fill")).toBe("#0000CC"); // K - positively charged
      expect(texts[3].getAttribute("fill")).toBe("#0000CC"); // R - positively charged
    });
  });
});
