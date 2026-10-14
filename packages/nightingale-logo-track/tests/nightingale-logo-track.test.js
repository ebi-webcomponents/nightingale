import "../dist/index";

let rendered;

// Fully conserved at every column so each position renders exactly one
// letter (heightFraction 1), making the output deterministic to assert on.
const rnaSequences = [
  { name: "seq1", sequence: "AAACCCGGGUUU" },
  { name: "seq2", sequence: "AAACCCGGGUUU" },
];

const proteinSequences = [
  { name: "seq1", sequence: "MSKRLE" },
  { name: "seq2", sequence: "MSKRLE" },
];

const mount = async (attributes, sequences) => {
  document.documentElement.innerHTML = `<nightingale-logo-track ${attributes}></nightingale-logo-track>`;
  const element = document.querySelector("nightingale-logo-track");
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await element.updateComplete;
  if (sequences) element.sequences = sequences;
  return element;
};

const transformOf = (text) => {
  const [, x, y, , scaleY] = text
    .getAttribute("transform")
    .match(/translate\(([-\d.]+),([-\d.]+)\) scale\(([-\d.]+),([-\d.]+)\)/)
    .map(Number);
  return { x, baselineY: y, height: scaleY * 12 * 0.72 };
};

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

    test("it should display the highlight after being set", async () => {
      // jsdom has no layout, so give the track a width for zoom refreshes to render.
      rendered.setAttribute("width", "500");
      rendered.setAttribute("highlight", "1:3");
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const highlight = document.querySelector("g.highlighted>rect");
      expect(highlight).toBeTruthy();
      expect(Number(highlight.getAttribute("width"))).toBeGreaterThan(0);
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
        '<nightingale-logo-track length="6" height="120"></nightingale-logo-track>';
      rendered = document.querySelector("nightingale-logo-track");
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await rendered.updateComplete;
      rendered.sequences = proteinSequences;
    });

    test("it should detect protein sequences and color residues by chemistry group", () => {
      const texts = Array.from(document.querySelectorAll("text"));
      expect(texts.length).toBe(6);
      expect(texts.map((t) => t.textContent)).toEqual([..."MSKRLE"]);
      expect(texts[0].getAttribute("fill")).toBe("#FF8C00"); // M - hydrophobic
      expect(texts[1].getAttribute("fill")).toBe("#00CC00"); // S - polar uncharged
      expect(texts[2].getAttribute("fill")).toBe("#0000CC"); // K - positively charged
      expect(texts[3].getAttribute("fill")).toBe("#0000CC"); // R - positively charged
      expect(texts[4].getAttribute("fill")).toBe("#FF8C00"); // L - hydrophobic
      expect(texts[5].getAttribute("fill")).toBe("#CC0000"); // E - negatively charged
    });
  });

  describe("IUPAC ambiguity codes in a DNA alignment", () => {
    // 1 of 10 characters per sequence is an ambiguity code (R or Y), which
    // are also amino acid letters: this must still be read as nucleotides.
    test("it should keep nucleotide mode, coloring and T to U conversion", async () => {
      await mount('length="10" height="120"', [
        { name: "seq1", sequence: "AAAAATTTTR" },
        { name: "seq2", sequence: "AAAAATTTTY" },
      ]);
      const texts = Array.from(document.querySelectorAll("text"));
      expect(texts.map((t) => t.textContent)).toEqual([..."AAAAAUUUU"]);
      expect(texts[0].getAttribute("fill")).toBe("#00CC00"); // A
      expect(texts[5].getAttribute("fill")).toBe("#CC0000"); // U
    });

    test.each([..."BDHKMNRSVWY"])(
      "it should not count ambiguity code %s as protein evidence",
      async (code) => {
        // 4 of 20 characters (20%) are the code, well above the 5% threshold.
        const sequence = "AAAAAAAA" + code + code;
        await mount('length="10" height="120"', [
          { name: "seq1", sequence },
          { name: "seq2", sequence },
        ]);
        const texts = Array.from(document.querySelectorAll("text"));
        expect(texts.map((t) => t.textContent)).toEqual([..."AAAAAAAA"]);
        expect(texts.every((t) => t.getAttribute("fill") === "#00CC00")).toBe(true);
      },
    );
  });

  describe("fractional display range", () => {
    const sequences = [
      { name: "seq1", sequence: "A".repeat(30) },
      { name: "seq2", sequence: "A".repeat(30) },
    ];
    const drawnColumns = (element) =>
      Array.from(document.querySelectorAll("text")).map((text) =>
        Math.floor(element.getSeqPositionFromX(transformOf(text).x)),
      );

    test("it should draw a partially visible column at the right edge", async () => {
      const element = await mount(
        'length="30" width="810" height="120" display-start="10.45" display-end="19.45"',
        sequences,
      );
      expect(drawnColumns(element)).toEqual(
        Array.from({ length: 11 }, (_, i) => 10 + i),
      );
    });

    test("it should draw a partially visible column at the left edge", async () => {
      const element = await mount(
        'length="30" width="810" height="120" display-start="10.6" display-end="19.6"',
        sequences,
      );
      expect(drawnColumns(element)[0]).toBe(10);
    });
  });

  describe("dimension changes", () => {
    test("it should resize the svg when width/height attributes change", async () => {
      const element = await mount('length="4" width="400" height="120"', [
        { name: "seq1", sequence: "AAAA" },
        { name: "seq2", sequence: "AAAA" },
      ]);
      element.setAttribute("height", "200");
      element.setAttribute("width", "800");
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const svg = element.querySelector("svg");
      expect(svg.getAttribute("height")).toBe("200");
      expect(svg.getAttribute("width")).toBe("800");
      // A fully conserved column fills the new height down to its bottom edge.
      const baselines = Array.from(document.querySelectorAll("text")).map(
        (text) => transformOf(text).baselineY,
      );
      expect(Math.max(...baselines)).toBe(200);
    });
  });

  describe("pointer events", () => {
    const sequences = [
      { name: "seq1", sequence: "AAACCC" },
      { name: "seq2", sequence: "AAACCC" },
    ];
    const fire = (target, type) =>
      target.dispatchEvent(new MouseEvent(type, { bubbles: true }));

    const setup = async (highlightEvent) => {
      const element = await mount(
        `length="6" width="600" height="120" highlight-event="${highlightEvent}"`,
        sequences,
      );
      const events = [];
      element.addEventListener("change", (event) => events.push(event.detail));
      const column = document.querySelectorAll("rect.logo-column")[2];
      return { events, column };
    };

    test("it should render one hit area per visible column", async () => {
      await setup("onmouseover");
      expect(document.querySelectorAll("rect.logo-column").length).toBe(6);
    });

    test("it should emit a highlight for the hovered column with onmouseover", async () => {
      const { events, column } = await setup("onmouseover");
      fire(column, "mouseover");
      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe("mouseover");
      expect(events[0].highlight).toBe("3:3");
      fire(column, "mouseout");
      expect(events[1].eventType).toBe("mouseout");
    });

    test("it should only emit a highlight on click with onclick", async () => {
      const { events, column } = await setup("onclick");
      fire(column, "mouseover");
      expect(events[0].highlight).toBeUndefined();
      fire(column, "click");
      expect(events[1].eventType).toBe("click");
      expect(events[1].highlight).toBe("3:3");
    });

    test("it should let pointer events over a letter reach its column", async () => {
      const { events, column } = await setup("onmouseover");
      // jsdom doesn't hit-test, so pick the target a browser would: the topmost
      // of the letter (drawn above) and its column that accepts pointer events.
      const letter = document.querySelectorAll("text")[2];
      const acceptsPointer = (el) => !el.closest('[style*="pointer-events: none"]');
      fire([letter, column].find(acceptsPointer), "mouseover");
      expect(events[0]?.highlight).toBe("3:3");
    });

    test("it should keep hit areas aligned with their columns after zooming", async () => {
      const element = await mount(
        'length="12" width="600" height="120" margin-top="15" margin-bottom="5"',
        rnaSequences,
      );
      const expectAligned = (positions) => {
        const rects = Array.from(document.querySelectorAll("rect.logo-column"));
        const texts = Array.from(document.querySelectorAll("text"));
        expect(rects.map((rect) => rect.__data__.position)).toEqual(positions);
        rects.forEach((rect, i) => {
          const x = Number(rect.getAttribute("x"));
          const width = Number(rect.getAttribute("width"));
          expect(x).toBeCloseTo(element.getXFromSeqPosition(positions[i]), 5);
          expect(width).toBeCloseTo(element.getSingleBaseWidth(), 5);
          expect(Number(rect.getAttribute("y"))).toBe(15);
          expect(Number(rect.getAttribute("height"))).toBe(100);
          expect(x + width / 2).toBeCloseTo(transformOf(texts[i]).x, 1);
        });
      };

      expectAligned(Array.from({ length: 12 }, (_, i) => i + 1));
      element.setAttribute("display-start", "4");
      element.setAttribute("display-end", "9");
      await new Promise((resolve) => requestAnimationFrame(resolve));
      expectAligned([4, 5, 6, 7, 8, 9]);
    });
  });

  describe("column statistics", () => {
    test("it should not recompute column statistics on re-render", async () => {
      const element = await mount('length="12" width="600" height="120"', rnaSequences);
      const computeColumnData = jest.spyOn(element, "computeColumnData");

      element.setAttribute("highlight", "3:5");
      element.setAttribute("display-start", "2");
      await new Promise((resolve) => requestAnimationFrame(resolve));

      expect(computeColumnData).not.toHaveBeenCalled();
      expect(document.querySelectorAll("text").length).toBe(11);
    });
  });

  describe("information content", () => {
    const HEIGHT = 120;
    const informationContent = (frequencies, maxBits) =>
      maxBits + frequencies.reduce((sum, f) => sum + f * Math.log2(f), 0);
    const letters = () =>
      Array.from(document.querySelectorAll("text")).map((text) => ({
        residue: text.textContent,
        ...transformOf(text),
      }));

    test("it should size letters by Shannon IC and stack the smallest at the bottom", async () => {
      await mount(`length="1" height="${HEIGHT}"`, [
        { name: "seq1", sequence: "A" },
        { name: "seq2", sequence: "A" },
        { name: "seq3", sequence: "A" },
        { name: "seq4", sequence: "C" },
      ]);
      const ic = informationContent([0.75, 0.25], 2);
      const [c, a] = letters();
      expect([c.residue, a.residue]).toEqual(["C", "A"]);
      expect(c.height).toBeCloseTo(((0.25 * ic) / 2) * HEIGHT, 1);
      expect(a.height).toBeCloseTo(((0.75 * ic) / 2) * HEIGHT, 1);
      expect(c.baselineY).toBeCloseTo(HEIGHT, 1);
      expect(a.baselineY).toBeCloseTo(HEIGHT - c.height, 1);
    });

    test("it should scale gap-heavy columns by coverage", async () => {
      await mount(`length="1" height="${HEIGHT}"`, [
        { name: "seq1", sequence: "A" },
        { name: "seq2", sequence: "A" },
        { name: "seq3", sequence: "-" },
        { name: "seq4", sequence: "-" },
      ]);
      const [a] = letters();
      expect(a.height).toBeCloseTo(0.5 * HEIGHT, 1);
    });

    test("it should use log2(20) as the protein maximum", async () => {
      // Column 1 is an even M/K split; column 2 (L) makes the alignment protein.
      await mount(`length="2" height="${HEIGHT}"`, [
        { name: "seq1", sequence: "ML" },
        { name: "seq2", sequence: "KL" },
      ]);
      const maxBits = Math.log2(20);
      const ic = informationContent([0.5, 0.5], maxBits);
      const column = letters().filter((l) => l.residue !== "L");
      expect(column.map((l) => l.residue).sort()).toEqual(["K", "M"]);
      for (const l of column) {
        expect(l.height).toBeCloseTo(((0.5 * ic) / maxBits) * HEIGHT, 1);
      }
    });

    test("it should treat missing trailing residues in a ragged alignment as gaps", async () => {
      // Longest sequence in the middle, so the column count can't come from
      // the first, last or shortest sequence.
      await mount(`length="4" height="${HEIGHT}"`, [
        { name: "seq1", sequence: "A" },
        { name: "seq2", sequence: "AAAA" },
        { name: "seq3", sequence: "AA" },
      ]);
      const heights = letters().map((l) => l.height);
      expect(heights).toHaveLength(4);
      [1, 2 / 3, 1 / 3, 1 / 3].forEach((coverage, i) =>
        expect(heights[i]).toBeCloseTo(coverage * HEIGHT, 1),
      );
    });
  });

  describe("sequence type detection", () => {
    const residues = () =>
      Array.from(document.querySelectorAll("text")).map((t) => t.textContent);

    test("it should detect lowercase protein sequences", async () => {
      await mount('length="6" height="120"', [
        { name: "seq1", sequence: "mskrle" },
        { name: "seq2", sequence: "mskrle" },
      ]);
      expect(residues()).toEqual([..."MSKRLE"]);
      expect(document.querySelector("text").getAttribute("fill")).toBe("#FF8C00");
    });

    test("it should ignore gaps when detecting protein", async () => {
      const sequence = "L" + "-".repeat(13) + ".".repeat(13) + " ".repeat(13);
      await mount('length="40" height="120"', [
        { name: "seq1", sequence },
        { name: "seq2", sequence },
      ]);
      expect(residues()).toEqual(["L"]);
      expect(document.querySelector("text").getAttribute("fill")).toBe("#FF8C00");
    });

    test("it should switch to protein above 5% protein-only letters", async () => {
      // 2 of 20 characters (10%) are protein-only, so A uses the protein palette.
      const sequence = "LE" + "ACG".repeat(6);
      await mount('length="20" height="120"', [
        { name: "seq1", sequence },
        { name: "seq2", sequence },
      ]);
      const a = Array.from(document.querySelectorAll("text")).find(
        (t) => t.textContent === "A",
      );
      expect(a.getAttribute("fill")).toBe("#FF8C00");
    });
  });

  describe("layout", () => {
    test("it should sit letters on the bottom margin and honour margin-top", async () => {
      await mount('length="12" height="120" margin-top="15" margin-bottom="5"', rnaSequences);
      const texts = Array.from(document.querySelectorAll("text"));
      expect(texts.length).toBe(12);
      for (const text of texts) {
        expect(transformOf(text).baselineY).toBeCloseTo(115, 1);
        expect(transformOf(text).height).toBeCloseTo(100, 1);
      }
    });

    test("it should only render the display-start..display-end window", async () => {
      await mount('length="12" height="120" display-start="3" display-end="5"', rnaSequences);
      const texts = Array.from(document.querySelectorAll("text"));
      expect(texts.map((t) => t.textContent)).toEqual(["A", "C", "C"]);
    });

    test("it should remove stale letters when sequences change", async () => {
      const element = await mount('length="12" height="120"', rnaSequences);
      element.sequences = [
        { name: "seq1", sequence: "GGGG" },
        { name: "seq2", sequence: "GGGG" },
      ];
      const texts = Array.from(document.querySelectorAll("text"));
      expect(texts.map((t) => t.textContent)).toEqual([..."GGGG"]);
    });

    test("it should render sequences set before the first update", async () => {
      const element = document.createElement("nightingale-logo-track");
      element.setAttribute("length", "12");
      element.setAttribute("height", "120");
      element.sequences = rnaSequences;
      document.body.appendChild(element);
      await element.updateComplete;
      expect(document.querySelectorAll("text").length).toBe(12);
    });
  });
});
