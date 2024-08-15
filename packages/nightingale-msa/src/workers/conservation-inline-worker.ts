import { SequencesMSA } from "../types/types";

declare const self: Worker & { previous: unknown };

// This file exports the JavaScript source code string of a function which calculates conversvation that is used for an inline worker.
// The point of doing this is so we can avoid rollup/webpack issues which were arising when using a normal worker.
// See this article for more information on inline workers: https://web.dev/articles/workers-basics#inline_workers

export const calculateConservation = (
  sequences: SequencesMSA,
  sampleSize: number | null = null,
  isWorker = false,
) => {
  const aLetterOffset = "A".charCodeAt(0);
  const lettersInAlphabet = 26;
  const length =
    (sequences && sequences.length && sequences[0].sequence.length) || 0;
  const finalSampleSize = sampleSize
    ? Math.min(sampleSize, sequences.length)
    : sequences.length;

  const sequencesToLoopThrough = sampleSize
    ? sequences.slice(0, finalSampleSize)
    : sequences;
  const conservation = new Float32Array(length * lettersInAlphabet);
  for (let i = 0; i < sequencesToLoopThrough.length; i++) {
    const { sequence } = sequencesToLoopThrough[i];
    for (let j = 0; j < sequence.length; j++) {
      const aa = sequence[j].toUpperCase();
      const loopOffset = j * lettersInAlphabet;
      const letterIndex = aa.charCodeAt(0) - aLetterOffset;
      if (letterIndex < 0 || letterIndex >= lettersInAlphabet) {
        // outside of bounds of "A" to "Z", ignore
        continue;
      }
      conservation[loopOffset + letterIndex]++;
    }
  }

  for (let i = 0; i < conservation.length; i++) {
    conservation[i] /= finalSampleSize;
  }
  if (isWorker) {
    self.postMessage({ progress: 1, conservation }, [conservation.buffer]);
  }
  return conservation;
};

// Note that the line `const f = ${calculateConservation.toString()};` allows us to keep that
// function's source code in TypeScript while also being transpiled into JavaScript.
const conservationInlineWorkerString = `
self.addEventListener('message', (e) => {
  if (self.previous !== e.data) {
    const f = ${calculateConservation.toString()};
    f(e.data.sequences, e.data.sampleSize, true);
  }
  self.previous = e.data;
})`;

export default conservationInlineWorkerString;
